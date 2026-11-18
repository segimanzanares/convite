<?php

namespace App\Services;

use App\Models\Invitation;
use Illuminate\Support\Facades\DB;

/**
 * Deletes the guest data of past events once the retention period ends (config convite.guest_retention_days).
 */
class GuestPurgeService
{
    public function __construct(
        private readonly LiveGalleryService $gallery,
        private readonly WishService $wishes,
    ) {}

    /**
     * Purge every invitation whose event ended more than the retention period ago, and return how many there were.
     */
    public function purgeDue(): int
    {
        $purged = 0;

        Invitation::query()
            ->dueForGuestPurge(config('convite.guest_retention_days'))
            ->eachById(function (Invitation $invitation) use (&$purged): void {
                $this->purge($invitation);
                $purged++;
            });

        return $purged;
    }

    /**
     * Delete the guests and RSVPs of an invitation, with their arrivals, the photos they shared in the live gallery and
     * the messages they left in the wishes book, revoke its door and gallery links and record when it happened, so it is not purged again.
     */
    public function purge(Invitation $invitation): void
    {
        DB::transaction(function () use ($invitation): void {
            $invitation->rsvps()->delete();
            $this->wishes->purge($invitation);
            $invitation->guests()->delete();
            $invitation->forceFill(['guests_purged_at' => now(), 'door_token' => null])->save();
            $this->gallery->purge($invitation);
        });
    }
}
