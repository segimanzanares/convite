<?php

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use Database\Seeders\InvitationSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the landing page from the main app with its default meta tags', function () {
    $this->get('/')
        ->assertOk()
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page->component('landing/index'))
        ->assertSee('<meta name="robots" content="index, follow" />', escape: false)
        ->assertSee('"@type":"Organization"', escape: false)
        ->assertSee('<link rel="canonical" href="'.url('/').'" />', escape: false)
        ->assertSee('<meta property="og:image" content="'.asset('og-image.jpg').'" />', escape: false)
        ->assertSee('<meta property="og:image:width" content="1200" />', escape: false);
});

it('describes the offered plans and their lowest price to search engines', function () {
    Plan::factory()->create(['name' => 'Básico', 'price' => 499]);
    Plan::factory()->create(['name' => 'Premium', 'price' => 1599]);
    Plan::factory()->inactive()->create(['name' => 'Retirado', 'price' => 99]);

    $response = $this->get('/')
        ->assertSee('Desde $499 MXN.', escape: false);

    $graph = collect($response->viewData('structuredData')['@graph']);
    $offers = $graph->firstWhere('@type', 'Service')['offers'];

    expect($offers)
        ->lowPrice->toBe('499.00')
        ->highPrice->toBe('1599.00')
        ->offerCount->toBe(2)
        ->and(collect($offers['offers'])->pluck('name')->all())->toBe(['Plan Básico', 'Plan Premium']);
});

it('keeps the default description when no plan is offered', function () {
    $this->get('/')
        ->assertSee('Listas en días.', escape: false)
        ->assertDontSee('"offers"', escape: false);
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
            ->where('demos', fn ($demos) => collect($demos)->pluck('slug')->all() === ['baby-shower-lluvia', 'baby-shower-patito', 'baby-shower-safari', 'baby-shower-tendedero', 'bautizo-celeste', 'bautizo-luz', 'bautizo-nube', 'bautizo-olivo', 'boda-clasica', 'boda-floral', 'boda-moderna', 'boda-serena', 'cumpleanos-confeti', 'cumpleanos-floral', 'cumpleanos-grafito', 'cumpleanos-reserva', 'infantil-dino', 'infantil-dulce', 'infantil-espacial', 'infantil-unicornio', 'revelacion-dulce', 'revelacion-estrellas', 'revelacion-globos', 'revelacion-osito', 'xv-aurora', 'xv-celestial', 'xv-disco'])
            ->where('demos.0.kind', 'baby_shower')
            ->where('demos.0.template_label', 'Baby shower lluvia de amor')
            ->where('demos.4.url', route('invitations.show', 'bautizo-celeste'))
            ->where('demos.4.image', '/invitations/bautizo-celeste/og-image.jpg')
            ->where('demos.4.kind', 'baptism')
            ->where('demos.13.kind', 'birthday')
            ->where('demos.13.template_label', 'Cumpleaños floral')
            ->where('demos.20.kind', 'gender_reveal'));
});
