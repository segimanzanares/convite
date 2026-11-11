<?php

use App\Models\Invitation;

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

it('runs the purge every day', function () {
    $this->artisan('schedule:list')->expectsOutputToContain('guests:purge');
});
