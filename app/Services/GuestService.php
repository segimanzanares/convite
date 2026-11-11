<?php

namespace App\Services;

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GuestService
{
    /**
     * The guests of an invitation in alphabetical order, with their answers.
     *
     * @return Collection<int, Guest>
     */
    public function list(Invitation $invitation): Collection
    {
        return $invitation->guests()->with('rsvp')->orderBy('name')->orderBy('id')->get();
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException when the invitation already has as many guests as its plan allows.
     */
    public function create(Invitation $invitation, array $data): Guest
    {
        return $this->addGuests($invitation, [$data])->first();
    }

    /**
     * Add the rows of an imported file, all of them or none.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return Collection<int, Guest>
     *
     * @throws ValidationException when the rows do not fit in the plan's guest limit.
     */
    public function import(Invitation $invitation, array $rows): Collection
    {
        return $this->addGuests($invitation, $rows);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Guest $guest, array $data): Guest
    {
        $guest->update($data);

        return $guest;
    }

    /**
     * Delete a guest along with their answer. Their personalized link then shows the open invitation.
     */
    public function delete(Guest $guest): void
    {
        $guest->delete();
    }

    /**
     * How many more guests the invitation may have, or null when its plan sets no limit.
     */
    public function remainingSlots(Invitation $invitation): ?int
    {
        $limit = $invitation->guestLimit();

        return $limit === null ? null : max(0, $limit - $invitation->guests()->count());
    }

    /**
     * The guest a personalized link belongs to. Null when the token is unknown or the invitation has no guest list,
     * in which case the link shows the open invitation.
     */
    public function findByToken(Invitation $invitation, string $token): ?Guest
    {
        if (! $invitation->hasFeature(PlanFeature::GuestManagement)) {
            return null;
        }

        return $invitation->guests()->where('token', $token)->first();
    }

    /**
     * Record the first time a guest opened their personalized link.
     */
    public function markOpened(Guest $guest): void
    {
        if ($guest->first_opened_at === null) {
            $guest->forceFill(['first_opened_at' => now()])->save();
        }
    }

    /**
     * Create guests within the plan's limit. The invitation row is locked so that two requests at once cannot both
     * take the last slot.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return Collection<int, Guest>
     */
    private function addGuests(Invitation $invitation, array $rows): Collection
    {
        return DB::transaction(function () use ($invitation, $rows): Collection {
            Invitation::query()->whereKey($invitation->id)->lockForUpdate()->first();

            $remaining = $this->remainingSlots($invitation);

            if ($remaining !== null && count($rows) > $remaining) {
                throw ValidationException::withMessages([
                    'guests' => trans_choice(
                        '{0} The plan allows :limit guests and the list is full.|[1,*] The plan allows :limit guests, so only :count more can be added.',
                        $remaining,
                        ['limit' => $invitation->guestLimit()],
                    ),
                ]);
            }

            return new Collection(array_map(fn (array $row): Guest => $invitation->guests()->create($row), $rows));
        });
    }
}
