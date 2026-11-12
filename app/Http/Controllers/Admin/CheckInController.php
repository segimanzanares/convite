<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\CheckInGuestRequest;
use App\Models\Guest;
use App\Models\Invitation;
use App\Services\CheckInService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

/**
 * Check-in from the panel's guest list: the door link for the staff, and arrivals marked by hand.
 */
class CheckInController extends Controller
{
    public function __construct(private readonly CheckInService $checkIn) {}

    /**
     * Make a new door link. Phones that opened the previous one lose door access.
     */
    public function regenerateDoorLink(Invitation $invitation): RedirectResponse
    {
        Gate::authorize('manageGuests', $invitation);

        $hadLink = $invitation->door_token !== null;

        $this->checkIn->regenerateDoorToken($invitation);

        Inertia::flash('toast', ['type' => 'success', 'message' => $hadLink
            ? __('New door link ready. The previous one no longer works.')
            : __('Door link ready.')]);

        return to_route('admin.invitations.guests.index', $invitation);
    }

    public function store(CheckInGuestRequest $request, Invitation $invitation, Guest $guest): RedirectResponse
    {
        $this->checkIn->checkIn($guest, $request->integer('seats'));

        return to_route('admin.invitations.guests.index', $invitation);
    }

    public function destroy(Invitation $invitation, Guest $guest): RedirectResponse
    {
        Gate::authorize('manageGuests', $invitation);

        $this->checkIn->undo($guest);

        return to_route('admin.invitations.guests.index', $invitation);
    }
}
