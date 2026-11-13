<?php

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\InvitationSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders an invitation with its template page and meta tags', function () {
    $invitation = Invitation::factory()->create([
        'slug' => 'ana-y-luis',
        'template' => 'boda-clasica',
        'title' => 'Ana & Luis — Nuestra Boda',
        'description' => 'Acompáñanos a celebrar.',
        'og_image' => '/invitations/boda-clasica/og-image.jpg',
    ]);

    $this->get("/i/{$invitation->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('templates/boda-clasica/InvitationPage')
            ->where('meta.title', 'Ana & Luis — Nuestra Boda')
            ->where('meta.robots', 'noindex, nofollow'))
        ->assertSee('<title>Ana &amp; Luis — Nuestra Boda</title>', escape: false)
        ->assertSee('<meta property="og:image" content="'.url('/invitations/boda-clasica/og-image.jpg').'" />', escape: false)
        ->assertSee('<meta name="robots" content="noindex, nofollow" />', escape: false);
});

it('serves the printable pages a template provides', function (string $template, string $path, string $page, string $title) {
    $invitation = Invitation::factory()->create(['template' => $template, 'title' => 'Boda Demo']);

    $this->get("/i/{$invitation->slug}/{$path}")
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component("templates/{$template}/{$page}")
            ->where('meta.title', $title));
})->with(['boda-clasica', 'boda-floral', 'boda-moderna', 'boda-serena'])->with([
    'print card' => ['tarjeta', 'PrintCardPage', 'Tarjeta impresa — Boda Demo'],
    'guest passes' => ['pases', 'GuestPassesPage', 'Pases de invitados — Boda Demo'],
]);

it('loads only the fonts its template declares', function () {
    $invitation = Invitation::factory()->create(['template' => 'infantil-dino']);

    $this->get("/i/{$invitation->slug}")
        ->assertOk()
        ->assertSee('<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&amp;family=Cinzel:wght@300;400;500&amp;family=Jost:wght@300;400;500&amp;display=swap" rel="stylesheet" />', escape: false);
});

it('adds the fonts of the printable pages to them only', function () {
    $invitation = Invitation::factory()->create(['template' => 'boda-moderna']);

    $this->get("/i/{$invitation->slug}")->assertOk()->assertDontSee('family=Great+Vibes', escape: false);
    $this->get("/i/{$invitation->slug}/tarjeta")
        ->assertOk()
        ->assertSee('family=Geist:wght@300;400;500;600;700', escape: false)
        ->assertSee('family=Great+Vibes', escape: false);
});

it('loads the shared components\' fonts on the pages that are not a template\'s', function () {
    $this->get('/i/no-existe')
        ->assertNotFound()
        ->assertSee('<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&amp;family=Cinzel:wght@300;400;500&amp;family=Great+Vibes&amp;family=Jost:wght@300;400;500&amp;display=swap" rel="stylesheet" />', escape: false);
});

it('returns 404 for printable pages a template does not provide', function (string $path) {
    $invitation = Invitation::factory()->create(['template' => 'cumpleanos-floral']);

    $this->get("/i/{$invitation->slug}/{$path}")->assertNotFound();
})->with(['tarjeta', 'pases']);

it('returns 404 for an unknown invitation', function () {
    $this->get('/i/no-existe')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('pages/not-found/NotFoundPage'));
});

it('hides drafts from the public', function (string $path) {
    $invitation = Invitation::factory()->draft()->create(['slug' => 'borrador', 'template' => 'boda-clasica']);
    Guest::factory()->for($invitation)->create(['token' => 'abc123']);

    $this->get("/i/borrador{$path}")
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('pages/not-found/NotFoundPage'));
})->with([
    'invitation' => [''],
    'personalized link' => ['/abc123'],
    'print card' => ['/tarjeta'],
    'guest passes' => ['/pases'],
]);

it('tells guests that an archived invitation is no longer available', function () {
    $invitation = Invitation::factory()->archived()->create();

    $this->get("/i/{$invitation->slug}")
        ->assertGone()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pages/unavailable/UnavailablePage')
            ->where('meta.robots', 'noindex, nofollow'));
});

it('shows unpublished invitations to their panel users as a preview', function (string $status, bool $isOwnerClient) {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create(['status' => $status]);
    $user = $isOwnerClient ? User::factory()->client($invitation->client)->create() : User::factory()->create();

    $this->actingAs($user)
        ->get("/i/{$invitation->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('templates/boda-clasica/InvitationPage')
            ->where('preview', $status));
})->with(['draft', 'archived'])->with([
    'admin' => [false],
    'owner client' => [true],
]);

it('does not show a draft to the users of another client', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->draft()->create();

    $this->actingAs(User::factory()->client()->create())
        ->get("/i/{$invitation->slug}")
        ->assertNotFound();
});

it('does not mark published invitations as a preview', function () {
    $invitation = Invitation::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('preview', null));
});

it('seeds a demo of every shared template at the template\'s slug', function () {
    $this->seed(InvitationSeeder::class);
    $templates = array_keys(array_filter(Invitation::templates(), fn (array $template) => ! $template['exclusive']));

    expect(Invitation::pluck('slug', 'template')->all())->toEqualCanonicalizing(array_combine($templates, $templates))
        ->and(Invitation::all()->every->hasPage('InvitationPage'))->toBeTrue()
        ->and(Invitation::whereNotNull('order_id')->exists())->toBeFalse();
});
