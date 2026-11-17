<?php

namespace App\Http\Controllers\Admin;

use App\Enums\GalleryPhotoStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\GalleryPhoto\UpdateGalleryPhotoRequest;
use App\Http\Requests\GalleryPhoto\UpdateGallerySettingsRequest;
use App\Http\Resources\GalleryPhotoResource;
use App\Http\Resources\InvitationResource;
use App\Models\GalleryPhoto;
use App\Models\Invitation;
use App\Services\LiveGalleryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * The live gallery in the panel: its QR code and links, moderation of the guests' photos, and the download of them all.
 */
class LiveGalleryController extends Controller
{
    public function __construct(private readonly LiveGalleryService $gallery) {}

    /**
     * Display the gallery's settings and every photo the guests shared.
     */
    public function index(Invitation $invitation): Response
    {
        Gate::authorize('manageGallery', $invitation);

        return Inertia::render('gallery/index', [
            'invitation' => InvitationResource::make($invitation->loadMissing('order')),
            'gallery' => $this->gallery->panelSettings($invitation),
            'photos' => GalleryPhotoResource::collection($this->gallery->list($invitation)),
        ]);
    }

    /**
     * Make a new gallery link. The previous one, and the QR codes printed with it, stop working.
     */
    public function regenerateLink(Invitation $invitation): RedirectResponse
    {
        Gate::authorize('manageGallery', $invitation);

        $hadLink = $invitation->gallery_token !== null;

        $this->gallery->regenerateToken($invitation);

        Inertia::flash('toast', ['type' => 'success', 'message' => $hadLink
            ? __('New gallery link ready. The previous one and its QR code no longer work.')
            : __('Gallery link ready.')]);

        return to_route('admin.invitations.gallery.index', $invitation);
    }

    public function updateSettings(UpdateGallerySettingsRequest $request, Invitation $invitation): RedirectResponse
    {
        $this->gallery->setModerated($invitation, $request->boolean('moderated'));

        Inertia::flash('toast', ['type' => 'success', 'message' => $request->boolean('moderated')
            ? __('New photos will wait for your approval.')
            : __('New photos will show on the wall right away.')]);

        return to_route('admin.invitations.gallery.index', $invitation);
    }

    public function updatePhoto(UpdateGalleryPhotoRequest $request, Invitation $invitation, GalleryPhoto $galleryPhoto): RedirectResponse
    {
        $this->gallery->setStatus($galleryPhoto, GalleryPhotoStatus::from($request->validated('status')));

        return to_route('admin.invitations.gallery.index', $invitation);
    }

    public function destroyPhoto(Invitation $invitation, GalleryPhoto $galleryPhoto): RedirectResponse
    {
        Gate::authorize('manageGallery', $invitation);

        $this->gallery->delete($galleryPhoto);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Photo deleted.')]);

        return to_route('admin.invitations.gallery.index', $invitation);
    }

    /**
     * Download the photos the client keeps (all but the hidden ones) in a ZIP file.
     */
    public function download(Invitation $invitation): BinaryFileResponse
    {
        Gate::authorize('manageGallery', $invitation);

        return response()
            ->download($this->gallery->zip($invitation), "fotos-{$invitation->slug}.zip", ['Content-Type' => 'application/zip'])
            ->deleteFileAfterSend();
    }
}
