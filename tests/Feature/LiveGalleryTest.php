<?php

use App\Enums\GalleryPhotoStatus;
use App\Enums\PlanFeature;
use App\Models\GalleryPhoto;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use App\Services\LiveGalleryService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * An invitation whose plan includes the live gallery, with the event today and a gallery link.
 */
function invitationWithGallery(array $attributes = []): Invitation
{
    $plan = Plan::factory()->withFeatures(PlanFeature::LiveGallery);
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for($plan)->create())
        ->create(['event_date' => today(), ...$attributes]);
    app(LiveGalleryService::class)->regenerateToken($invitation);

    return $invitation;
}

function galleryUrl(Invitation $invitation, string $route = 'invitations.gallery.show'): string
{
    return route($route, [$invitation, $invitation->gallery_token]);
}

it('stores a shared photo scaled down, with a thumbnail, and shows it on the wall', function () {
    Storage::fake('public');
    $invitation = invitationWithGallery();

    $response = $this->post(galleryUrl($invitation, 'invitations.gallery.store'), [
        'photo' => UploadedFile::fake()->image('boda.jpg', 3000, 2000),
        'uploader_name' => 'Tía Rosa',
        'message' => '¡Felicidades!',
    ]);

    $photo = GalleryPhoto::sole();
    $response->assertCreated()->assertJsonPath('id', $photo->id);
    expect($photo)
        ->invitation_id->toBe($invitation->id)
        ->width->toBe(2000)
        ->height->toBe(1333)
        ->uploader_name->toBe('Tía Rosa')
        ->status->toBe(GalleryPhotoStatus::Approved);
    Storage::disk('public')->assertExists([$photo->path, $photo->thumb_path]);
    [$thumbWidth, $thumbHeight] = getimagesize(Storage::disk('public')->path($photo->thumb_path));
    expect([$thumbWidth, $thumbHeight])->toBe([480, 320]);

    $this->get(galleryUrl($invitation, 'invitations.gallery.wall'))
        ->assertOk()
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page
            ->component('live-gallery/wall')
            ->where('gallery.upload_url', galleryUrl($invitation))
            ->has('photos', 1)
            ->where('photos.0.message', '¡Felicidades!')
            ->missing('photos.0.status'));
});

it('keeps photos off the wall until approved when the gallery is moderated', function () {
    Storage::fake('public');
    $invitation = invitationWithGallery(['gallery_moderated' => true]);

    $this->post(galleryUrl($invitation, 'invitations.gallery.store'), ['photo' => UploadedFile::fake()->image('a.jpg')])
        ->assertCreated();

    expect(GalleryPhoto::sole()->status)->toBe(GalleryPhotoStatus::Pending);
    $this->get(galleryUrl($invitation, 'invitations.gallery.wall'))
        ->assertInertia(fn (Assert $page) => $page->has('photos', 0));
});

it('does not open the gallery with a wrong token or a plan without it', function () {
    $invitation = invitationWithGallery();
    $withoutGallery = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::GuestManagement))->create())
        ->create(['event_date' => today(), 'gallery_token' => str_repeat('a', 32)]);

    $this->get(route('invitations.gallery.show', [$invitation, str_repeat('x', 32)]))->assertNotFound();
    $this->get(galleryUrl($withoutGallery))->assertNotFound();
    $this->post(galleryUrl($withoutGallery, 'invitations.gallery.store'), ['photo' => UploadedFile::fake()->image('a.jpg')])
        ->assertNotFound();
});

it('says when the gallery opens and takes no photos outside the event', function () {
    Storage::fake('public');
    $invitation = invitationWithGallery(['event_date' => today()->addDays(3)]);

    $this->get(galleryUrl($invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('live-gallery/upload')
            ->where('gallery.is_open', false)
            ->where('gallery.opens_at', $invitation->galleryOpensAt()->toIso8601String()));

    $this->postJson(galleryUrl($invitation, 'invitations.gallery.store'), ['photo' => UploadedFile::fake()->image('a.jpg')])
        ->assertJsonValidationErrors(['photo' => 'La galería no está recibiendo fotos en este momento.']);
    expect(GalleryPhoto::count())->toBe(0);
});

it('takes photos from the start of the event day until noon after it', function (string $now, bool $isOpen) {
    $invitation = invitationWithGallery(['event_date' => '2026-12-05']);
    $this->travelTo($now);

    expect($invitation->fresh()->galleryIsOpen())->toBe($isOpen);
})->with([
    'the day before' => ['2026-12-04 23:59', false],
    'the event day' => ['2026-12-05 00:00', true],
    'after midnight' => ['2026-12-06 02:00', true],
    'the next noon' => ['2026-12-06 12:01', false],
]);

it('takes photos within the days the invitation chose around the event', function (string $now, bool $isOpen) {
    $invitation = invitationWithGallery([
        'event_date' => '2026-12-05',
        'gallery_opens_days_before' => 1,
        'gallery_closes_days_after' => 3,
    ]);
    $this->travelTo($now);

    expect($invitation->fresh()->galleryIsOpen())->toBe($isOpen);
})->with([
    'two days before' => ['2026-12-03 23:59', false],
    'the day before' => ['2026-12-04 00:00', true],
    'three days after, in the morning' => ['2026-12-08 11:59', true],
    'three days after, past noon' => ['2026-12-08 12:01', false],
]);

it('takes no photos once the gallery is full', function () {
    Storage::fake('public');
    config(['convite.live_gallery_max_photos' => 1]);
    $invitation = invitationWithGallery();
    GalleryPhoto::factory()->for($invitation)->create();

    $this->postJson(galleryUrl($invitation, 'invitations.gallery.store'), ['photo' => UploadedFile::fake()->image('a.jpg')])
        ->assertJsonValidationErrors(['photo' => 'La galería ya está llena.']);
});

it('only takes images', function () {
    Storage::fake('public');
    $invitation = invitationWithGallery();

    $this->postJson(galleryUrl($invitation, 'invitations.gallery.store'), [
        'photo' => UploadedFile::fake()->create('video.mp4', 500, 'video/mp4'),
    ])->assertJsonValidationErrorFor('photo');
    expect(GalleryPhoto::count())->toBe(0);
});

it('lets the client hide a photo from the wall and approve it again', function () {
    $invitation = invitationWithGallery();
    $photo = GalleryPhoto::factory()->for($invitation)->create();
    $client = User::factory()->client($invitation->client)->create();

    $this->actingAs($client)
        ->patch(route('admin.invitations.gallery.photos.update', [$invitation, $photo]), ['status' => 'hidden'])
        ->assertRedirect(route('admin.invitations.gallery.index', $invitation));
    expect($photo->fresh()->status)->toBe(GalleryPhotoStatus::Hidden);
    $this->get(galleryUrl($invitation, 'invitations.gallery.wall'))
        ->assertInertia(fn (Assert $page) => $page->has('photos', 0));

    $this->actingAs($client)
        ->patch(route('admin.invitations.gallery.photos.update', [$invitation, $photo]), ['status' => 'approved']);
    expect($photo->fresh()->status)->toBe(GalleryPhotoStatus::Approved);
});

it('saves the moderation, the window and the time of each photo on the wall', function () {
    $invitation = invitationWithGallery();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->put(route('admin.invitations.gallery.settings', $invitation), [
            'moderated' => true,
            'opens_days_before' => 2,
            'closes_days_after' => 7,
            'slide_seconds' => 15,
        ])
        ->assertRedirect(route('admin.invitations.gallery.index', $invitation));

    expect($invitation->fresh())
        ->gallery_moderated->toBeTrue()
        ->gallery_opens_days_before->toBe(2)
        ->gallery_closes_days_after->toBe(7)
        ->gallery_slide_seconds->toBe(15);
    $this->get(galleryUrl($invitation, 'invitations.gallery.wall'))
        ->assertInertia(fn (Assert $page) => $page->where('gallery.slide_seconds', 15));
});

it('does not keep the gallery open past the purge of the guest data', function () {
    config(['convite.guest_retention_days' => 10]);
    $invitation = invitationWithGallery();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->put(route('admin.invitations.gallery.settings', $invitation), [
            'moderated' => false,
            'opens_days_before' => 8,
            'closes_days_after' => 11,
            'slide_seconds' => 2,
        ])
        ->assertSessionHasErrors([
            'opens_days_before' => 'El campo días antes del evento no debe ser mayor que 7.',
            'closes_days_after' => 'El campo días después del evento no debe ser mayor que 10.',
            'slide_seconds' => 'El campo segundos por foto debe ser al menos 3.',
        ]);

    expect($invitation->fresh()->gallery_closes_days_after)->toBe(1);
});

it('deletes a photo with its files', function () {
    Storage::fake('public');
    $invitation = invitationWithGallery();
    $photo = GalleryPhoto::factory()->for($invitation)->create();
    Storage::disk('public')->put($photo->path, 'jpeg');
    Storage::disk('public')->put($photo->thumb_path, 'jpeg');

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.invitations.gallery.photos.destroy', [$invitation, $photo]))
        ->assertRedirect(route('admin.invitations.gallery.index', $invitation));

    $this->assertModelMissing($photo);
    Storage::disk('public')->assertMissing([$photo->path, $photo->thumb_path]);
});

it('does not let a client manage the gallery of another client', function () {
    $invitation = invitationWithGallery();
    $photo = GalleryPhoto::factory()->for($invitation)->create();
    $otherClient = User::factory()->client()->create();

    $this->actingAs($otherClient)->get(route('admin.invitations.gallery.index', $invitation))->assertForbidden();
    $this->actingAs($otherClient)
        ->patch(route('admin.invitations.gallery.photos.update', [$invitation, $photo]), ['status' => 'hidden'])
        ->assertForbidden();
    expect($photo->fresh()->status)->toBe(GalleryPhotoStatus::Approved);
});

it('does not reach a photo through another invitation', function () {
    $invitation = invitationWithGallery();
    $otherPhoto = GalleryPhoto::factory()->for(invitationWithGallery())->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.invitations.gallery.photos.update', [$invitation, $otherPhoto]), ['status' => 'hidden'])
        ->assertNotFound();
});

it('shows the gallery in the panel only when the plan includes it', function () {
    $invitation = invitationWithGallery();
    GalleryPhoto::factory()->for($invitation)->pending()->create();
    $withoutGallery = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.invitations.gallery.index', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('gallery/index')
            ->where('gallery.upload_url', galleryUrl($invitation))
            ->where('gallery.summary', ['total' => 1, 'pending' => 1, 'approved' => 0, 'hidden' => 0])
            ->where('photos.0.status', 'pending'));

    $this->actingAs($admin)->get(route('admin.invitations.gallery.index', $withoutGallery))->assertNotFound();
});

it('revokes the previous gallery link when a new one is made', function () {
    $invitation = invitationWithGallery();
    $oldUrl = galleryUrl($invitation);

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.gallery.link', $invitation))
        ->assertRedirect(route('admin.invitations.gallery.index', $invitation));

    $this->get($oldUrl)->assertNotFound();
    $this->get(galleryUrl($invitation->fresh()))->assertOk();
});

it('downloads every photo but the hidden ones in a ZIP file', function () {
    Storage::fake('public');
    $invitation = invitationWithGallery();
    $kept = collect([
        GalleryPhoto::factory()->for($invitation)->create(),
        GalleryPhoto::factory()->for($invitation)->pending()->create(),
    ]);
    $hidden = GalleryPhoto::factory()->for($invitation)->hidden()->create();
    $kept->push($hidden)->each(fn (GalleryPhoto $photo) => Storage::disk('public')->put($photo->path, 'jpeg'));

    $response = $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.gallery.download', $invitation))
        ->assertOk()
        ->assertDownload("fotos-{$invitation->slug}.zip");

    $zip = new ZipArchive;
    $zip->open($response->baseResponse->getFile()->getPathname());
    $entries = collect(range(0, $zip->numFiles - 1))->map(fn (int $index) => $zip->getNameIndex($index));
    $zip->close();

    expect($entries)->toHaveCount(2)
        ->and($entries->every(fn (string $entry) => ! str_ends_with($entry, "-{$hidden->id}.jpg")))->toBeTrue();
});

it('deletes the photos and revokes the gallery link when the guest data is purged', function () {
    Storage::fake('public');
    config(['convite.guest_retention_days' => 30]);
    $invitation = invitationWithGallery(['event_date' => today()->subDays(31)]);
    $photo = GalleryPhoto::factory()->for($invitation)->create(['path' => "{$invitation->mediaDirectory()}/live/a.jpg"]);
    Storage::disk('public')->put($photo->path, 'jpeg');

    $this->artisan('guests:purge')->assertSuccessful();

    $this->assertModelMissing($photo);
    Storage::disk('public')->assertMissing($photo->path);
    expect($invitation->fresh()->gallery_token)->toBeNull();
});
