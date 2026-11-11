<?php

namespace App\Jobs;

use App\Mail\GuestInvitationMail;
use App\Models\Guest;
use App\Services\GuestDeliveryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

/**
 * Email a guest their invitation, then mark them as sent. The guest is only marked once the mail went out, so a
 * failed job leaves them pending and the next bulk send retries them.
 */
class SendGuestInvitation implements ShouldQueue
{
    use Queueable;

    /** The guest may be deleted (or purged) before the job runs; then there is nothing to send. */
    public bool $deleteWhenMissingModels = true;

    public int $tries = 3;

    public function __construct(public Guest $guest) {}

    /**
     * Execute the job.
     */
    public function handle(GuestDeliveryService $delivery): void
    {
        if (blank($this->guest->email)) {
            return;
        }

        Mail::to($this->guest->email, $this->guest->name)->send(new GuestInvitationMail($this->guest));

        $delivery->markSent($this->guest);
    }
}
