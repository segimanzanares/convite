<?php

use App\Models\GalleryPhoto;
use App\Models\Invitation;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    config(['convite.uploads_retention_days' => 7]);
    $this->freezeTime();
});

it('purges only the archived invitations whose event was at least a week ago', function () {
    $expired = Invitation::factory()->archived()->create(['event_date' => today()->subDays(7)]);
    $recent = Invitation::factory()->archived()->create(['event_date' => today()->subDays(6)]);
    $published = Invitation::factory()->create(['event_date' => today()->subDays(30)]);
    $undated = Invitation::factory()->archived()->create(['event_date' => null]);
    $alreadyPurged = Invitation::factory()->archived()->create([
        'event_date' => today()->subDays(90),
        'uploads_purged_at' => now()->subDays(50),
    ]);

    $this->artisan('invitations:purge-uploads')
        ->expectsOutputToContain('Invitaciones depuradas: 1')
        ->assertSuccessful();

    expect($expired->fresh()->uploads_purged_at?->toDateTimeString())->toBe(now()->toDateTimeString())
        ->and($recent->fresh()->uploads_purged_at)->toBeNull()
        ->and($published->fresh()->uploads_purged_at)->toBeNull()
        ->and($undated->fresh()->uploads_purged_at)->toBeNull()
        ->and($alreadyPurged->fresh()->uploads_purged_at->toDateTimeString())->toBe(now()->subDays(50)->toDateTimeString());
});

it('deletes the uploads and gallery photos of a purged invitation and keeps those of the others', function () {
    $expired = Invitation::factory()->archived()->create(['event_date' => today()->subDays(10)]);
    $published = Invitation::factory()->create(['event_date' => today()->subDays(10)]);

    foreach ([$expired, $published] as $invitation) {
        Storage::disk('public')->put("{$invitation->mediaDirectory()}/hero.jpg", 'photo');
        Storage::disk('public')->put("{$invitation->mediaDirectory()}/live/guest.jpg", 'photo');
    }

    GalleryPhoto::factory()->for($expired)->create();
    $keptPhoto = GalleryPhoto::factory()->for($published)->create();

    $this->artisan('invitations:purge-uploads')->assertSuccessful();

    Storage::disk('public')->assertMissing($expired->mediaDirectory());
    Storage::disk('public')->assertExists([
        "{$published->mediaDirectory()}/hero.jpg",
        "{$published->mediaDirectory()}/live/guest.jpg",
    ]);
    expect(GalleryPhoto::pluck('id')->all())->toBe([$keptPhoto->id]);
});

it('runs the purge every day', function () {
    $this->artisan('schedule:list')->expectsOutputToContain('invitations:purge-uploads');
});
