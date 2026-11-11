<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\RendersGuestPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\StoreGuestRequest;
use App\Http\Requests\Guest\UpdateGuestRequest;
use App\Models\Guest;
use App\Models\Invitation;
use App\Services\GuestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    use RendersGuestPage;

    public function __construct(private readonly GuestService $guests) {}

    /**
     * Display the guest list of an invitation.
     */
    public function index(Invitation $invitation): Response
    {
        Gate::authorize('manageGuests', $invitation);

        return $this->renderGuestPage($invitation);
    }

    /**
     * Display the guest list with the form to add a guest open in a modal.
     */
    public function create(Invitation $invitation): Response
    {
        Gate::authorize('manageGuests', $invitation);

        return $this->renderGuestPage($invitation, 'create');
    }

    public function store(StoreGuestRequest $request, Invitation $invitation): RedirectResponse
    {
        $this->guests->create($invitation, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Guest added.')]);

        return to_route('admin.invitations.guests.index', $invitation);
    }

    /**
     * Display the guest list with the edit form open in a modal.
     */
    public function edit(Invitation $invitation, Guest $guest): Response
    {
        Gate::authorize('manageGuests', $invitation);

        return $this->renderGuestPage($invitation, 'edit', $guest);
    }

    public function update(UpdateGuestRequest $request, Invitation $invitation, Guest $guest): RedirectResponse
    {
        $this->guests->update($guest, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Guest updated.')]);

        return to_route('admin.invitations.guests.index', $invitation);
    }

    public function destroy(Invitation $invitation, Guest $guest): RedirectResponse
    {
        Gate::authorize('manageGuests', $invitation);

        $this->guests->delete($guest);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Guest deleted.')]);

        return to_route('admin.invitations.guests.index', $invitation);
    }
}
