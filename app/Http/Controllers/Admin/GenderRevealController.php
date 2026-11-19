<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invitation\UpdateRevealRequest;
use App\Models\Invitation;
use App\Services\InvitationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

/**
 * The moment a gender reveal shows its result, set by the admin from the content form or by the client from their
 * invitations, usually during the party.
 */
class GenderRevealController extends Controller
{
    public function __construct(private readonly InvitationService $invitations) {}

    public function update(UpdateRevealRequest $request, Invitation $invitation): RedirectResponse
    {
        $shown = $request->boolean('shown');

        $this->invitations->showReveal($invitation, $shown);

        Inertia::flash('toast', ['type' => 'success', 'message' => $shown ? __('The result is now shown.') : __('The result is hidden again.')]);

        return back();
    }
}
