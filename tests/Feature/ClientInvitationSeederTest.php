<?php

use App\Models\Client;
use App\Models\Invitation;
use Database\Seeders\ClientInvitationSeeder;
use Database\Seeders\PlanSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(PlanSeeder::class);
});

it('creates the client invitations with their client and order', function () {
    $this->seed(ClientInvitationSeeder::class);

    $invitation = Invitation::where('slug', 'mati-nayith')->firstOrFail();

    expect($invitation->template)->toBe('boda-clasica')
        ->and($invitation->order->plan->slug)->toBe('basico')
        ->and($invitation->client_id)->toBe($invitation->order->client_id);

    // With an order, the page shows the real date instead of moving it ahead like a demo's
    $this->get('/i/mati-nayith')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('invitation.eventAt', '2026-11-21T15:00:00'));
});

it('leaves an invitation that already exists untouched', function () {
    $this->seed(ClientInvitationSeeder::class);
    Invitation::where('slug', 'mati-nayith')->firstOrFail()->update(['title' => 'Editado en el panel']);

    $this->seed(ClientInvitationSeeder::class);

    expect(Invitation::where('slug', 'mati-nayith')->sole()->title)->toBe('Editado en el panel')
        ->and(Client::count())->toBe(1);
});
