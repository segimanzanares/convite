<?php

use App\Models\Invitation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('serves the admin panel under /admin with its own root view', function () {
    expect(route('login', absolute: false))->toBe('/admin/login')
        ->and(route('dashboard', absolute: false))->toBe('/admin');

    $this->get(route('login'))
        ->assertOk()
        ->assertViewIs('admin')
        ->assertInertia(fn (Assert $page) => $page->component('auth/login'));

    $this->get(route('landing'))->assertViewIs('admin');
});

it('does not allow public registration', function () {
    $this->get('/admin/register')->assertNotFound();

    $this->post('/admin/register', [
        'name' => 'Intruso',
        'email' => 'intruso@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();

    expect(User::count())->toBe(0);
});

it('navigates between the panel and the landing page within the same app', function () {
    $adminVersion = $this->get(route('login'))->viewData('page')['version'];

    $this->get(route('landing'), [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $adminVersion,
    ])
        ->assertOk()
        ->assertJsonPath('component', 'landing/index');
});

it('reloads the full page when an Inertia visit crosses from the admin app to the public site', function () {
    $adminVersion = $this->get(route('landing'))->viewData('page')['version'];
    $invitation = Invitation::factory()->create();

    $this->get(route('invitations.show', $invitation), [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $adminVersion,
    ])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', route('invitations.show', $invitation));
});

it('shares the signed in user with the admin app, the landing page included', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->has('auth.user'));

    $this->get(route('landing'))
        ->assertInertia(fn (Assert $page) => $page->has('auth.user'));
});

it('does not share the signed in user with the public site', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('invitations.show', Invitation::factory()->create()))
        ->assertInertia(fn (Assert $page) => $page->missing('auth'));
});

it('keeps the default 404 page for unknown admin urls', function () {
    $this->get('/admin/no-existe')
        ->assertNotFound()
        ->assertDontSee('data-page="app"', escape: false);
});
