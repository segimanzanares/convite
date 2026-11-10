<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the landing page with its default meta tags', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('pages/landing/LandingPage'))
        ->assertSee('<meta name="robots" content="index, follow" />', escape: false)
        ->assertSee('"@type":"Organization"', escape: false);
});

it('renders the not found page for unknown urls', function () {
    $this->get('/no-existe')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('pages/not-found/NotFoundPage'))
        ->assertSee('<title>Página no encontrada</title>', escape: false);
});
