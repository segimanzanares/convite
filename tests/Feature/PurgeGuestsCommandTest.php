<?php

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Rsvp;

it('purges only the invitations whose event ended more than the retention period ago', function () {
    config(['convite.guest_retention_days' => 30]);
    $this->freezeTime();
    $expired = Invitation::factory()->create(['event_date' => today()->subDays(31)]);
    $withinRetention = Invitation::factory()->create(['event_date' => today()->subDays(30)]);
    $upcoming = Invitation::factory()->create(['event_date' => today()->addDays(10)]);
    $undated = Invitation::factory()->create(['event_date' => null]);
    $alreadyPurged = Invitation::factory()->create([
        'event_date' => today()->subDays(90),
        'guests_purged_at' => now()->subDays(50),
    ]);

    $this->artisan('guests:purge')
        ->expectsOutputToContain('Invitaciones depuradas: 1')
        ->assertSuccessful();

    expect($expired->fresh()->guests_purged_at?->toDateTimeString())->toBe(now()->toDateTimeString())
        ->and($withinRetention->fresh()->guests_purged_at)->toBeNull()
        ->and($upcoming->fresh()->guests_purged_at)->toBeNull()
        ->and($undated->fresh()->guests_purged_at)->toBeNull()
        ->and($alreadyPurged->fresh()->guests_purged_at->toDateTimeString())->toBe(now()->subDays(50)->toDateTimeString());
});

it('deletes the guests and answers of a purged invitation and keeps those of the others', function () {
    config(['convite.guest_retention_days' => 30]);
    $expired = Invitation::factory()->create(['event_date' => today()->subDays(31)]);
    $upcoming = Invitation::factory()->create(['event_date' => today()->addDays(10)]);
    Rsvp::factory()->forGuest(Guest::factory()->for($expired)->create())->create();
    Rsvp::factory()->for($expired)->create();
    $keptGuest = Guest::factory()->for($upcoming)->create();
    $keptAnswer = Rsvp::factory()->for($upcoming)->create();

    $this->artisan('guests:purge')->assertSuccessful();

    expect(Guest::pluck('id')->all())->toBe([$keptGuest->id])
        ->and(Rsvp::pluck('id')->all())->toBe([$keptAnswer->id]);
});

it('runs the purge every day', function () {
    $this->artisan('schedule:list')->expectsOutputToContain('guests:purge');
});
