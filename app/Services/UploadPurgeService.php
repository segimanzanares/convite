<?php

namespace App\Services;

use App\Models\Invitation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Deletes the uploads (photos, music and live gallery) of archived invitations once their event is past the
 * retention period (config convite.uploads_retention_days).
 */
class UploadPurgeService
{
    public function __construct(private readonly LiveGalleryService $gallery) {}

    /**
     * Purge every archived invitation whose event ended more than the retention period ago, and return how many
     * there were.
     */
    public function purgeDue(): int
    {
        $purged = 0;

        Invitation::query()
            ->dueForUploadsPurge(config('convite.uploads_retention_days'))
            ->eachById(function (Invitation $invitation) use (&$purged): void {
                $this->purge($invitation);
                $purged++;
            });

        return $purged;
    }

    /**
     * Delete the invitation's media folder on the public disk, with the live gallery's photos and their rows, and
     * record when it happened. The content keeps the paths: the invitation is archived, so nobody opens it.
     */
    public function purge(Invitation $invitation): void
    {
        DB::transaction(function () use ($invitation): void {
            $this->gallery->purge($invitation);
            $invitation->forceFill(['uploads_purged_at' => now()])->save();
        });

        Storage::disk('public')->deleteDirectory($invitation->mediaDirectory());
    }
}
