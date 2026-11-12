<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Http\Resources\GuestResource;
use App\Http\Resources\InvitationResource;
use App\Models\Guest;
use App\Models\Invitation;
use App\Services\CheckInService;
use App\Services\GuestService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The guest list of an invitation. Its forms open in modals whose state comes from the URL, so several controllers
 * render it.
 */
trait RendersGuestPage
{
    /**
     * @param  'create'|'edit'|'import'|null  $modal
     */
    protected function renderGuestPage(Invitation $invitation, ?string $modal = null, ?Guest $guest = null): Response
    {
        $guests = app(GuestService::class);

        return Inertia::render('guests/index', [
            'invitation' => InvitationResource::make($invitation->loadMissing('order')),
            'guests' => GuestResource::collection($guests->list($invitation)),
            'remaining' => $guests->remainingSlots($invitation),
            'check_in' => app(CheckInService::class)->panelSettings($invitation),
            'modal' => $modal,
            'guest' => $guest ? GuestResource::make($guest) : null,
        ]);
    }
}
