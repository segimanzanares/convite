<?php

namespace App\Services;

use App\Enums\GalleryPhotoStatus;
use App\Enums\PlanFeature;
use App\Models\GalleryPhoto;
use App\Models\Invitation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Exceptions\ImageException;
use Intervention\Image\ImageManager;
use RuntimeException;
use ZipArchive;

/**
 * The live gallery: guests scan the invitation's gallery QR code at the event and share their photos, and a wall
 * (projected at the venue) shows them as they arrive. The QR code opens a link with the invitation's gallery token;
 * making a new one revokes the old link.
 */
class LiveGalleryService
{
    /** Length of the token in the gallery links. */
    public const int TOKEN_LENGTH = 32;

    /** Folder of the gallery's Inertia pages, under resources/js/app/pages (see HandleInertiaRequests::PUBLIC_PAGES). */
    public const string PAGES = 'live-gallery/';

    /** The most days before the event the gallery may open, e.g. for a welcome party the day before. */
    public const int MAX_OPENS_DAYS_BEFORE = 7;

    /** The most days after the event the gallery may keep taking photos, unless the purge comes sooner. */
    public const int MAX_CLOSES_DAYS_AFTER = 30;

    /** How long the wall may show each photo, in seconds. */
    public const int MIN_SLIDE_SECONDS = 3;

    public const int MAX_SLIDE_SECONDS = 60;

    /** How many of the latest photos the wall cycles through. */
    public const int WALL_PHOTOS = 60;

    /** Longest side of a stored photo, enough for a projector. */
    private const int PHOTO_SIZE = 2000;

    /** Longest side of a thumbnail, for the grids. */
    private const int THUMB_SIZE = 480;

    private const int JPEG_QUALITY = 82;

    /**
     * Give the invitation a new gallery link, which replaces the previous one (and the printed QR codes with it).
     */
    public function regenerateToken(Invitation $invitation): string
    {
        $invitation->forceFill(['gallery_token' => Str::random(self::TOKEN_LENGTH)])->save();

        return $invitation->gallery_token;
    }

    /**
     * Whether the given token is the invitation's current gallery token.
     */
    public function isGalleryToken(Invitation $invitation, string $token): bool
    {
        return $invitation->gallery_token !== null && hash_equals($invitation->gallery_token, $token);
    }

    /**
     * The link the QR code opens, for guests to share photos, or null while the invitation has none.
     */
    public function uploadUrl(Invitation $invitation): ?string
    {
        return $invitation->gallery_token === null
            ? null
            : route('invitations.gallery.show', [$invitation, $invitation->gallery_token]);
    }

    /**
     * The wall to project at the venue, or null while the invitation has no gallery link.
     */
    public function wallUrl(Invitation $invitation): ?string
    {
        return $invitation->gallery_token === null
            ? null
            : route('invitations.gallery.wall', [$invitation, $invitation->gallery_token]);
    }

    /**
     * Store a photo a guest shared: oriented as it was taken, scaled down to PHOTO_SIZE, with a thumbnail and without
     * its metadata (which may hold where it was taken). It shows on the wall right away unless the invitation
     * moderates its gallery.
     *
     * @throws ValidationException when the gallery is closed or full, or the file is not a readable image.
     */
    public function store(Invitation $invitation, UploadedFile $file, ?string $uploaderName, ?string $message): GalleryPhoto
    {
        if (! $invitation->galleryIsOpen()) {
            throw ValidationException::withMessages(['photo' => __('The gallery is not taking photos now.')]);
        }

        if ($invitation->galleryPhotos()->count() >= config('convite.live_gallery_max_photos')) {
            throw ValidationException::withMessages(['photo' => __('The gallery is full.')]);
        }

        try {
            $image = (new ImageManager(Driver::class))->decodePath($file->getRealPath());
        } catch (ImageException) {
            throw ValidationException::withMessages(['photo' => __('The photo could not be read. Try another one.')]);
        }

        $encoder = new JpegEncoder(quality: self::JPEG_QUALITY, strip: true);
        $name = Str::uuid()->toString();
        $directory = $this->directory($invitation);
        $disk = Storage::disk('public');

        $photo = $image->scaleDown(self::PHOTO_SIZE, self::PHOTO_SIZE);
        $path = "{$directory}/{$name}.jpg";
        $disk->put($path, $photo->encode($encoder)->toString());
        [$width, $height] = [$photo->width(), $photo->height()];

        $thumbPath = "{$directory}/thumbs/{$name}.jpg";
        $disk->put($thumbPath, $photo->scaleDown(self::THUMB_SIZE, self::THUMB_SIZE)->encode($encoder)->toString());

        return $invitation->galleryPhotos()->create([
            'path' => $path,
            'thumb_path' => $thumbPath,
            'width' => $width,
            'height' => $height,
            'uploader_name' => $uploaderName,
            'message' => $message,
            'status' => $invitation->gallery_moderated ? GalleryPhotoStatus::Pending : GalleryPhotoStatus::Approved,
        ]);
    }

    /**
     * Approve a photo (it shows on the wall) or hide it (it no longer does).
     */
    public function setStatus(GalleryPhoto $photo, GalleryPhotoStatus $status): GalleryPhoto
    {
        $photo->update(['status' => $status]);

        return $photo;
    }

    /**
     * Delete a photo and its files for good.
     */
    public function delete(GalleryPhoto $photo): void
    {
        Storage::disk('public')->delete([$photo->path, $photo->thumb_path]);

        $photo->delete();
    }

    /**
     * Save how the invitation's gallery works: whether the guests' photos wait for a panel user's approval, how many
     * days before the event it opens and after it closes, and how long the wall shows each photo.
     *
     * @param  array{moderated: bool, opens_days_before: int, closes_days_after: int, slide_seconds: int}  $settings
     */
    public function updateSettings(Invitation $invitation, array $settings): void
    {
        $invitation->forceFill([
            'gallery_moderated' => $settings['moderated'],
            'gallery_opens_days_before' => $settings['opens_days_before'],
            'gallery_closes_days_after' => $settings['closes_days_after'],
            'gallery_slide_seconds' => $settings['slide_seconds'],
        ])->save();
    }

    /**
     * The most days after the event the gallery may keep taking photos: never past the day its photos are purged.
     */
    public function maxClosesDaysAfter(): int
    {
        return min(self::MAX_CLOSES_DAYS_AFTER, (int) config('convite.guest_retention_days'));
    }

    /**
     * The latest photos the wall shows, newest first.
     *
     * @return Collection<int, GalleryPhoto>
     */
    public function wallPhotos(Invitation $invitation, int $limit = self::WALL_PHOTOS): Collection
    {
        return $invitation->galleryPhotos()->approved()->latest('id')->limit($limit)->get();
    }

    /**
     * Every photo of the invitation, newest first, as the panel lists them.
     *
     * @return Collection<int, GalleryPhoto>
     */
    public function list(Invitation $invitation): Collection
    {
        return $invitation->galleryPhotos()->latest('id')->get();
    }

    /**
     * How many photos the gallery has, by status.
     *
     * @return array{total: int, pending: int, approved: int, hidden: int}
     */
    public function summary(Invitation $invitation): array
    {
        $counts = $invitation->galleryPhotos()
            ->toBase()
            ->selectRaw('status, count(*) as photos')
            ->groupBy('status')
            ->pluck('photos', 'status');

        return [
            'total' => (int) $counts->sum(),
            'pending' => (int) ($counts[GalleryPhotoStatus::Pending->value] ?? 0),
            'approved' => (int) ($counts[GalleryPhotoStatus::Approved->value] ?? 0),
            'hidden' => (int) ($counts[GalleryPhotoStatus::Hidden->value] ?? 0),
        ];
    }

    /**
     * The gallery as the panel shows it, or null when the plan does not include it.
     *
     * @return array{upload_url: string|null, wall_url: string|null, moderated: bool, opens_days_before: int, closes_days_after: int, slide_seconds: int, max_opens_days_before: int, max_closes_days_after: int, min_slide_seconds: int, max_slide_seconds: int, opens_at: string|null, closes_at: string|null, is_open: bool, max_photos: int, summary: array{total: int, pending: int, approved: int, hidden: int}}|null
     */
    public function panelSettings(Invitation $invitation): ?array
    {
        if (! $invitation->hasFeature(PlanFeature::LiveGallery)) {
            return null;
        }

        return [
            'upload_url' => $this->uploadUrl($invitation),
            'wall_url' => $this->wallUrl($invitation),
            'moderated' => $invitation->gallery_moderated,
            'opens_days_before' => $invitation->gallery_opens_days_before,
            'closes_days_after' => $invitation->gallery_closes_days_after,
            'slide_seconds' => $invitation->gallery_slide_seconds,
            'max_opens_days_before' => self::MAX_OPENS_DAYS_BEFORE,
            'max_closes_days_after' => $this->maxClosesDaysAfter(),
            'min_slide_seconds' => self::MIN_SLIDE_SECONDS,
            'max_slide_seconds' => self::MAX_SLIDE_SECONDS,
            'opens_at' => $invitation->galleryOpensAt()?->toIso8601String(),
            'closes_at' => $invitation->galleryClosesAt()?->toIso8601String(),
            'is_open' => $invitation->galleryIsOpen(),
            'max_photos' => (int) config('convite.live_gallery_max_photos'),
            'summary' => $this->summary($invitation),
        ];
    }

    /**
     * The props the guests' upload page and the wall share: the gallery's window and links, how long the wall shows
     * each photo, and the page meta tags.
     *
     * @return array{gallery: array<string, mixed>, meta: array<string, string>}
     */
    public function pageProps(Invitation $invitation): array
    {
        return [
            'gallery' => [
                'title' => $invitation->title,
                'is_open' => $invitation->galleryIsOpen(),
                'opens_at' => $invitation->galleryOpensAt()?->toIso8601String(),
                'closes_at' => $invitation->galleryClosesAt()?->toIso8601String(),
                'moderated' => $invitation->gallery_moderated,
                'slide_seconds' => $invitation->gallery_slide_seconds,
                'upload_url' => $this->uploadUrl($invitation),
                'wall_url' => $this->wallUrl($invitation),
            ],
            'meta' => [
                'title' => "Fotos — {$invitation->title}",
                'robots' => 'noindex, nofollow',
            ],
        ];
    }

    /**
     * Pack the photos the client keeps (every photo but the hidden ones) into a ZIP file, oldest first and named by
     * the time they were shared. The caller deletes the file after sending it.
     *
     * @throws RuntimeException when the ZIP file cannot be written.
     */
    public function zip(Invitation $invitation): string
    {
        $file = tempnam(sys_get_temp_dir(), 'convite-gallery-');
        $zip = new ZipArchive;

        if ($file === false || $zip->open($file, ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('The gallery ZIP file could not be created.');
        }

        $disk = Storage::disk('public');

        $invitation->galleryPhotos()
            ->where('status', '!=', GalleryPhotoStatus::Hidden)
            ->orderBy('id')
            ->each(function (GalleryPhoto $photo) use ($zip, $disk): void {
                if (! $disk->exists($photo->path)) {
                    return;
                }

                $entry = $photo->created_at->timezone(config('app.timezone'))->format('Ymd-His')."-{$photo->id}.jpg";
                $zip->addFile($disk->path($photo->path), $entry);
                // JPEG files do not shrink any further
                $zip->setCompressionName($entry, ZipArchive::CM_STORE);
            });

        $zip->close();

        return $file;
    }

    /**
     * Delete every photo of the invitation with its files, and revoke its gallery link.
     */
    public function purge(Invitation $invitation): void
    {
        $invitation->galleryPhotos()->delete();
        Storage::disk('public')->deleteDirectory($this->directory($invitation));
        $invitation->forceFill(['gallery_token' => null])->save();
    }

    /**
     * The folder of the public disk the gallery's photos go to. It sits inside the invitation's media folder, whose
     * unused files InvitationContentService deletes, but that only looks at the files right in the folder.
     */
    private function directory(Invitation $invitation): string
    {
        return "{$invitation->mediaDirectory()}/live";
    }
}
