<?php

use App\Models\Invitation;
use App\Models\Order;

it('moves the demos to their template\'s slug and leaves client invitations alone', function () {
    $migration = require database_path('migrations/2026_11_12_113653_rename_demo_invitation_slugs.php');
    $demo = Invitation::factory()->create(['slug' => 'demo']);
    $flora = Invitation::factory()->create(['slug' => 'flora']);
    $clientInvitation = Invitation::factory()->forOrder(Order::factory()->create())->create(['slug' => 'demo-xv']);

    $migration->up();

    expect($demo->refresh()->slug)->toBe('boda-clasica')
        ->and($flora->refresh()->slug)->toBe('cumpleanos-floral')
        ->and($clientInvitation->refresh()->slug)->toBe('demo-xv');

    $migration->down();

    expect($demo->refresh()->slug)->toBe('demo')
        ->and($flora->refresh()->slug)->toBe('flora');
});

it('does not rename a demo onto a slug that is taken', function () {
    $migration = require database_path('migrations/2026_11_12_113653_rename_demo_invitation_slugs.php');
    $demo = Invitation::factory()->create(['slug' => 'demo']);
    Invitation::factory()->create(['slug' => 'boda-clasica']);

    $migration->up();

    expect($demo->refresh()->slug)->toBe('demo');
});
