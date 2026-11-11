<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Invitation;
use App\Services\GuestDeliveryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

/**
 * Sending guests their invitation. WhatsApp messages are sent from the panel user's own WhatsApp (the panel opens a
 * wa.me link), so the server only records that they were sent; emails are queued.
 */
class GuestDeliveryController extends Controller
{
    public function __construct(private readonly GuestDeliveryService $delivery) {}

    /**
     * Record that the guest was sent their invitation through WhatsApp.
     */
    public function markSent(Invitation $invitation, Guest $guest): RedirectResponse
    {
        Gate::authorize('manageGuests', $invitation);

        $this->delivery->ensureSendable($invitation);
        $this->delivery->markSent($guest);

        return to_route('admin.invitations.guests.index', $invitation);
    }

    /**
     * Email one guest their invitation, also when it was sent before.
     */
    public function email(Invitation $invitation, Guest $guest): RedirectResponse
    {
        Gate::authorize('manageGuests', $invitation);

        $this->delivery->email($guest);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('The invitation is on its way to :email.', ['email' => $guest->email])]);

        return to_route('admin.invitations.guests.index', $invitation);
    }

    /**
     * Email every guest with an email address who was not sent their invitation yet.
     */
    public function emailPending(Invitation $invitation): RedirectResponse
    {
        Gate::authorize('manageGuests', $invitation);

        $count = $this->delivery->emailPending($invitation);

        Inertia::flash('toast', $count === 0
            ? ['type' => 'info', 'message' => __('Every guest with an email address was already sent the invitation.')]
            : ['type' => 'success', 'message' => trans_choice('{1} Sending the invitation to :count guest.|[2,*] Sending the invitation to :count guests.', $count)]);

        return to_route('admin.invitations.guests.index', $invitation);
    }
}
