<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guest\CheckInGuestRequest;
use App\Http\Resources\CheckInGuestResource;
use App\Models\Guest;
use App\Models\Invitation;
use App\Services\CheckInService;
use App\Services\GuestService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The door of the event. The staff opens the door link once; then scanning a pass opens the guest's check-in screen
 * (see InvitationController::guest), and the door page counts arrivals and finds guests who forgot their pass.
 */
class CheckInController extends Controller
{
    public function __construct(
        private readonly CheckInService $checkIn,
        private readonly GuestService $guests,
    ) {}

    /**
     * Give this phone door access until check-in closes. Outside the check-in window the page says when it opens.
     */
    public function enter(Invitation $invitation, string $doorToken): Response|RedirectResponse
    {
        abort_unless($this->checkIn->isDoorToken($invitation, $doorToken), 404);

        if (! $invitation->checkInIsOpen()) {
            return $this->render($invitation, 'DoorPage', ['guests' => null]);
        }

        return to_route('invitations.door.show', $invitation)->withCookie($this->checkIn->doorCookie($invitation));
    }

    /**
     * The arrivals so far and the guest list, to check in guests without their pass.
     */
    public function show(Invitation $invitation): Response
    {
        return $this->render($invitation, 'DoorPage', [
            'guests' => CheckInGuestResource::collection($this->guests->list($invitation)),
        ]);
    }

    public function store(CheckInGuestRequest $request, Invitation $invitation, Guest $guest): RedirectResponse
    {
        $this->checkIn->checkIn($guest, $request->integer('seats'));

        return back();
    }

    public function destroy(Invitation $invitation, Guest $guest): RedirectResponse
    {
        $this->checkIn->undo($guest);

        return back();
    }

    /**
     * @param  array<string, mixed>  $props
     */
    private function render(Invitation $invitation, string $page, array $props): Response
    {
        return Inertia::render(CheckInService::PAGES.$page, [
            ...$props,
            ...$this->checkIn->doorPageProps($invitation),
        ]);
    }
}
