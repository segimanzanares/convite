<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('serves the admin panel under /admin with its own root view', function () {
    expect(route('login', absolute: false))->toBe('/admin/login')
        ->and(route('dashboard', absolute: false))->toBe('/admin');

    $this->get(route('login'))
        ->assertOk()
        ->assertViewIs('admin')
        ->assertInertia(fn (Assert $page) => $page->component('auth/login'));

    $this->get(route('landing'))->assertViewIs('app');
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

it('reloads the full page when an Inertia visit crosses between the admin panel and the public site', function () {
    $adminVersion = $this->get(route('login'))->viewData('page')['version'];

    $this->get(route('landing'), [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $adminVersion,
    ])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', route('landing'));
});

it('shares the signed in user with the admin panel', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->has('auth.user'));
});

it('does not share the signed in user with the public site', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('landing'))
        ->assertInertia(fn (Assert $page) => $page->missing('auth'));
});

it('keeps the default 404 page for unknown admin urls', function () {
    $this->get('/admin/no-existe')
        ->assertNotFound()
        ->assertDontSee('data-page="app"', escape: false);
});
