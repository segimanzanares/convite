<?php

use App\Models\Invitation;
use Database\Seeders\InvitationSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders an invitation with its template page and meta tags', function () {
    $invitation = Invitation::factory()->create([
        'slug' => 'ana-y-luis',
        'template' => 'demo',
        'title' => 'Ana & Luis — Nuestra Boda',
        'description' => 'Acompáñanos a celebrar.',
        'og_image' => '/invitations/demo/og-image.jpg',
    ]);

    $this->get("/i/{$invitation->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/demo/InvitationPage')
            ->where('meta.title', 'Ana & Luis — Nuestra Boda')
            ->where('meta.robots', 'noindex, nofollow'))
        ->assertSee('<title>Ana &amp; Luis — Nuestra Boda</title>', escape: false)
        ->assertSee('<meta property="og:image" content="'.url('/invitations/demo/og-image.jpg').'" />', escape: false)
        ->assertSee('<meta name="robots" content="noindex, nofollow" />', escape: false);
});

it('serves the printable pages a template provides', function (string $path, string $page, string $title) {
    $invitation = Invitation::factory()->create(['template' => 'demo', 'title' => 'Boda Demo']);

    $this->get("/i/{$invitation->slug}/{$path}")
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component("invitations/demo/{$page}")
            ->where('meta.title', $title));
})->with([
    'print card' => ['tarjeta', 'PrintCardPage', 'Tarjeta impresa — Boda Demo'],
    'guest passes' => ['pases', 'GuestPassesPage', 'Pases de invitados — Boda Demo'],
]);

it('returns 404 for printable pages a template does not provide', function (string $path) {
    $invitation = Invitation::factory()->create(['template' => 'flora']);

    $this->get("/i/{$invitation->slug}/{$path}")->assertNotFound();
})->with(['tarjeta', 'pases']);

it('returns 404 for an unknown invitation', function () {
    $this->get('/i/no-existe')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('pages/not-found/NotFoundPage'));
});

it('seeds an invitation for every template page that exists', function () {
    $this->seed(InvitationSeeder::class);

    expect(Invitation::count())->toBe(4)
        ->and(Invitation::all()->every->hasPage('InvitationPage'))->toBeTrue();
});
