<?php

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\Order;
use Database\Seeders\InvitationSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the landing page from the main app with its default meta tags', function () {
    $this->get('/')
        ->assertOk()
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page->component('landing/index'))
        ->assertSee('<meta name="robots" content="index, follow" />', escape: false)
        ->assertSee('"@type":"Organization"', escape: false);
});

it('renders the not found page for unknown urls', function () {
    $this->get('/no-existe')
        ->assertNotFound()
        ->assertViewIs('invitations')
        ->assertInertia(fn (Assert $page) => $page->component('pages/not-found/NotFoundPage'))
        ->assertSee('<title>Página no encontrada</title>', escape: false);
});

it('shows the published demo of each template', function () {
    $this->seed(InvitationSeeder::class);
    Invitation::where('slug', 'xv-jardin')->update(['status' => InvitationStatus::Draft]);
    // Neither a client's invitation nor one without an order at a slug of its own is a template's demo
    Invitation::factory()->forOrder(Order::factory()->create())->create(['slug' => 'mati-nayith', 'template' => 'boda-floral']);
    Invitation::factory()->create(['slug' => 'maria-y-pedro', 'template' => 'boda-floral']);

    $this->get('/')
        ->assertInertia(fn (Assert $page) => $page
            ->where('demos', fn ($demos) => collect($demos)->pluck('slug')->all() === ['boda-clasica', 'boda-floral', 'boda-moderna', 'boda-serena', 'cumpleanos-floral', 'cumpleanos-reserva'])
            ->where('demos.0.url', route('invitations.show', 'boda-clasica'))
            ->where('demos.0.image', '/invitations/boda-clasica/og-image.jpg')
            ->where('demos.4.kind', 'birthday')
            ->where('demos.4.template_label', 'Cumpleaños floral'));
});
