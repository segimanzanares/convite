<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryPhoto\StoreGalleryPhotoRequest;
use App\Http\Resources\GalleryPhotoResource;
use App\Models\Invitation;
use App\Services\LiveGalleryService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The live gallery at the event: the page the gallery QR code opens, where guests share their photos, and the wall
 * projected at the venue. Both refresh themselves to show the new photos.
 */
class LiveGalleryController extends Controller
{
    /** How many of the latest photos the guests' page shows under the upload button. */
    private const int UPLOAD_PAGE_PHOTOS = 30;

    public function __construct(private readonly LiveGalleryService $gallery) {}

    /**
     * Share photos. Outside the event the page says when the gallery opens.
     */
    public function show(Invitation $invitation): Response
    {
        return $this->render($invitation, 'upload', self::UPLOAD_PAGE_PHOTOS);
    }

    public function store(StoreGalleryPhotoRequest $request, Invitation $invitation): JsonResponse
    {
        $photo = $this->gallery->store(
            $invitation,
            $request->file('photo'),
            $request->validated('uploader_name'),
            $request->validated('message'),
        );

        return GalleryPhotoResource::make($photo)->response()->setStatusCode(201);
    }

    /**
     * The photos as they arrive, full screen, with the QR code to share more.
     */
    public function wall(Invitation $invitation): Response
    {
        return $this->render($invitation, 'wall', LiveGalleryService::WALL_PHOTOS);
    }

    private function render(Invitation $invitation, string $page, int $photos): Response
    {
        return Inertia::render(LiveGalleryService::PAGES.$page, [
            ...$this->gallery->pageProps($invitation),
            'photos' => fn () => GalleryPhotoResource::collection($this->gallery->wallPhotos($invitation, $photos)),
        ]);
    }
}
