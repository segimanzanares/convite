<?php

namespace App\Http\Controllers\Admin;

use App\Enums\WishStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Wish\UpdateWishRequest;
use App\Http\Requests\Wish\UpdateWishSettingsRequest;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\WishResource;
use App\Models\Invitation;
use App\Models\Wish;
use App\Services\WishService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The wishes book in the panel: its settings, moderation of the guests' messages and their download in a PDF.
 */
class WishController extends Controller
{
    public function __construct(private readonly WishService $wishes) {}

    /**
     * Display the book's settings and every message the guests left.
     */
    public function index(Invitation $invitation): Response
    {
        Gate::authorize('manageWishes', $invitation);

        return Inertia::render('wishes/index', [
            'invitation' => InvitationResource::make($invitation->loadMissing('order')),
            'book' => $this->wishes->panelSettings($invitation),
            'wishes' => WishResource::collection($this->wishes->list($invitation)->load('guest')),
        ]);
    }

    public function updateSettings(UpdateWishSettingsRequest $request, Invitation $invitation): RedirectResponse
    {
        $this->wishes->updateSettings($invitation, $request->settings());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Wishes book updated.')]);

        return to_route('admin.invitations.wishes.index', $invitation);
    }

    public function update(UpdateWishRequest $request, Invitation $invitation, Wish $wish): RedirectResponse
    {
        $this->wishes->setStatus($wish, WishStatus::from($request->validated('status')));

        return to_route('admin.invitations.wishes.index', $invitation);
    }

    public function destroy(Invitation $invitation, Wish $wish): RedirectResponse
    {
        Gate::authorize('manageWishes', $invitation);

        $this->wishes->delete($wish);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message deleted.')]);

        return to_route('admin.invitations.wishes.index', $invitation);
    }

    /**
     * Download the messages the client keeps (all but the hidden ones) in a PDF.
     */
    public function download(Invitation $invitation): HttpResponse
    {
        Gate::authorize('manageWishes', $invitation);

        return response($this->wishes->pdf($invitation), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"deseos-{$invitation->slug}.pdf\"",
        ]);
    }
}
