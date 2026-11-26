<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Services\CheckInService;
use App\Services\DemoShowcaseService;
use App\Services\LiveGalleryService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The door and the live gallery of a demo, linked from a demo showing a plan that includes them (see
 * DemoShowcaseService). They render the real pages with sample guests and photos, and store nothing.
 */
class DemoShowcaseController extends Controller
{
    public function __construct(private readonly DemoShowcaseService $showcase) {}

    /**
     * The door page, open, with sample guests to find and check in.
     */
    public function door(Invitation $invitation): Response
    {
        $this->ensureDemo($invitation);

        return Inertia::render(CheckInService::PAGES.'door', $this->showcase->doorProps($invitation));
    }

    /**
     * The page the gallery QR code opens, with the invitation's photos as the ones shared so far.
     */
    public function gallery(Invitation $invitation): Response
    {
        $this->ensureDemo($invitation);

        return Inertia::render(LiveGalleryService::PAGES.'upload', $this->showcase->galleryProps($invitation));
    }

    /**
     * The wall projected at the venue, cycling through the invitation's photos.
     */
    public function wall(Invitation $invitation): Response
    {
        $this->ensureDemo($invitation);

        return Inertia::render(LiveGalleryService::PAGES.'wall', $this->showcase->galleryProps($invitation));
    }

    /**
     * Only demos (invitations without an order) have these pages.
     */
    private function ensureDemo(Invitation $invitation): void
    {
        abort_unless($invitation->order_id === null, 404);
    }
}
