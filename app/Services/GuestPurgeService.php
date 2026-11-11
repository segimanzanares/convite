<?php

namespace App\Services;

use App\Models\Invitation;

/**
 * Deletes the guest data of past events once the retention period ends (config convite.guest_retention_days).
 */
class GuestPurgeService
{
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
     * Delete the guests and RSVPs of an invitation and record when it happened, so it is not purged again.
     *
     * The guests and RSVPs tables arrive in phase 2 of the plan; their deletion goes here, before the mark.
     */
    public function purge(Invitation $invitation): void
    {
        $invitation->forceFill(['guests_purged_at' => now()])->save();
    }
}
