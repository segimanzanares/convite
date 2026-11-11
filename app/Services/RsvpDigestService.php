<?php

namespace App\Services;

use App\Enums\PlanFeature;
use App\Models\Invitation;
use App\Models\Rsvp;
use App\Models\User;
use App\Notifications\RsvpDigest;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Notification;

/**
 * The daily email that tells clients who answered their invitation the day before. Clients may turn it off in their
 * profile (users.receives_rsvp_digest).
 */
class RsvpDigestService
{
    /**
     * Send the summary of the given day's answers to the client users of every invitation that got any.
     *
     * @return int How many invitations had a summary sent.
     */
    public function send(CarbonImmutable $day): int
    {
        $invitations = Invitation::query()
            ->whereNotNull('client_id')
            ->whereNull('guests_purged_at')
            ->whereHas('rsvps', fn (Builder $query) => $this->answeredOn($query, $day))
            ->with(['order', 'client.users' => fn ($query) => $query->receivingRsvpDigest()])
            ->get()
            ->filter(fn (Invitation $invitation) => $invitation->hasFeature(PlanFeature::OnlineRsvp));

        $sent = 0;

        foreach ($invitations as $invitation) {
            /** @var Collection<int, User> $recipients */
            $recipients = $invitation->client->users;

            if ($recipients->isNotEmpty()) {
                Notification::send($recipients, new RsvpDigest($invitation, $day));
                $sent++;
            }
        }

        return $sent;
    }

    /**
     * The answers given (or changed) on the given day, in the order they came in.
     *
     * @return Collection<int, Rsvp>
     */
    public function answers(Invitation $invitation, CarbonImmutable $day): Collection
    {
        return $this->answeredOn($invitation->rsvps()->getQuery(), $day)->oldest('responded_at')->get();
    }

    /**
     * @param  Builder<Rsvp>  $query
     * @return Builder<Rsvp>
     */
    private function answeredOn(Builder $query, CarbonImmutable $day): Builder
    {
        return $query->whereBetween('responded_at', [$day->startOfDay(), $day->endOfDay()]);
    }
}
