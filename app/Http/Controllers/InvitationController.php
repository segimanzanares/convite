<?php

namespace App\Http\Controllers;

use App\Enums\PlanFeature;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Resources\CheckInGuestResource;
use App\Http\Resources\InvitationContentResource;
use App\Http\Resources\PassGuestResource;
use App\Http\Resources\PublicGuestResource;
use App\Models\Invitation;
use App\Services\CheckInService;
use App\Services\GuestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function __construct(
        private readonly GuestService $guests,
        private readonly CheckInService $checkIn,
    ) {}

    /**
     * The open invitation, which anyone with its link can answer when the plan includes online RSVPs.
     */
    public function show(Invitation $invitation): Response
    {
        return $this->render($invitation, 'InvitationPage', $invitation->title, [
            'rsvp' => $this->rsvpSettings($invitation),
            'guest' => null,
        ]);
    }

    /**
     * A guest's personalized link. An unknown token (e.g. of a deleted guest) shows the open invitation instead of an
     * error, since the link may have been shared already. The link is also the QR code of the guest's pass, so on the
     * phone of the staff at the door (see CheckInController) it opens the check-in screen instead.
     */
    public function guest(Request $request, Invitation $invitation, string $token): Response
    {
        $guest = $this->guests->findByToken($invitation, $token);

        if ($this->checkIn->hasDoorAccess($request, $invitation)) {
            HandleInertiaRequests::servePages($request, HandleInertiaRequests::PUBLIC_PAGES);

            return Inertia::render(CheckInService::PAGES.'guest', [
                'guest' => $guest ? CheckInGuestResource::make($guest->load('rsvp')) : null,
                ...$this->checkIn->doorPageProps($invitation),
            ]);
        }

        // Admins and clients previewing a link from the panel do not count as the guest opening it
        if ($guest !== null && $request->user() === null) {
            $this->guests->markOpened($guest);
        }

        if ($guest !== null && $invitation->hasFeature(PlanFeature::OnlineRsvp)) {
            $guest->load('rsvp');
        }

        return $this->render($invitation, 'InvitationPage', $invitation->title, [
            'rsvp' => $this->rsvpSettings($invitation),
            'guest' => $guest ? PublicGuestResource::make($guest) : null,
        ]);
    }

    public function printCard(Invitation $invitation): Response
    {
        return $this->render($invitation, Invitation::PRINT_CARD_PAGE, "Tarjeta impresa — {$invitation->title}");
    }

    /**
     * The printable passes. With a guest list they are printed from it, so only the invitation's panel users may open
     * them (the list has every guest's personal link); without one, the page lets the visitor type the list.
     */
    public function guestPasses(Request $request, Invitation $invitation): Response|RedirectResponse
    {
        abort_unless($invitation->offersPage(Invitation::GUEST_PASSES_PAGE), 404);

        $guests = null;

        if ($invitation->hasFeature(PlanFeature::GuestManagement)) {
            if ($request->user() === null) {
                return redirect()->guest(route('login'));
            }

            Gate::authorize('manageGuests', $invitation);

            $guests = PassGuestResource::collection($this->guests->list($invitation));
        }

        return $this->render($invitation, Invitation::GUEST_PASSES_PAGE, "Pases de invitados — {$invitation->title}", [
            'guests' => $guests,
        ]);
    }

    /**
     * @param  array<string, mixed>  $props
     */
    private function render(Invitation $invitation, string $page, string $title, array $props = []): Response
    {
        abort_unless($invitation->offersPage($page), 404);

        return Inertia::render($invitation->component($page), [
            ...$props,
            'invitation' => InvitationContentResource::make($invitation),
            // Drafts and archived invitations only reach their panel users (see EnsureInvitationIsVisible)
            'preview' => $invitation->isPublished() ? null : $invitation->status->value,
            // Read by resources/views/app.blade.php for link previews
            'meta' => [
                'title' => $title,
                'description' => $invitation->description,
                'image' => $invitation->og_image ? url(Invitation::mediaUrl($invitation->og_image)) : null,
                'robots' => 'noindex, nofollow',
            ],
        ]);
    }

    /**
     * How the invitation's RSVP section works: stored online when the plan includes it, or through WhatsApp.
     *
     * @return array{online: bool, open: bool, url: string, max_seats: int}
     */
    private function rsvpSettings(Invitation $invitation): array
    {
        return [
            'online' => $invitation->hasFeature(PlanFeature::OnlineRsvp),
            'open' => $invitation->acceptsRsvps(),
            'url' => route('invitations.rsvp.store', $invitation),
            'max_seats' => config('convite.open_rsvp_max_seats'),
        ];
    }
}
