<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the terms and the privacy notice from the main app with their own meta tags', function (string $route, string $component, string $title) {
    $this->get(route($route))
        ->assertOk()
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page->component($component))
        ->assertSee("<title>{$title}</title>", escape: false)
        ->assertSee('<meta name="robots" content="index, follow" />', escape: false);
})->with([
    'terms' => ['legal.terms', 'landing/terms', 'Términos y condiciones - Convite'],
    'privacy' => ['legal.privacy', 'landing/privacy', 'Aviso de privacidad - Convite'],
]);

it('names who is responsible and the retention periods the purges apply', function () {
    config([
        'convite.legal' => ['name' => 'Ana Pérez', 'email' => 'privacidad@example.com', 'address' => null, 'city' => 'Puebla'],
        'convite.guest_retention_days' => 45,
        'backup.keep_days' => 10,
    ]);

    $this->get(route('legal.privacy'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('legal', ['name' => 'Ana Pérez', 'email' => 'privacidad@example.com', 'address' => null, 'city' => 'Puebla'])
            ->where('retention.guests_days', 45)
            ->where('retention.backups_days', 10));
});
