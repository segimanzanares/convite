<?php

use App\Models\Client;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the services page from the main app with its own meta tags', function () {
    $this->get(route('services'))
        ->assertOk()
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page
            ->component('landing/services')
            ->where('referral', null))
        ->assertSee('<title>Video semblanza, invitación en video e imprimibles - Convite</title>', escape: false)
        ->assertSee('<meta name="robots" content="index, follow" />', escape: false)
        ->assertSee('<link rel="canonical" href="'.route('services').'" />', escape: false);
});

it('keeps the referral discount of visitors who came with a client\'s link', function () {
    config(['convite.referrals_enabled' => true]);
    $client = Client::factory()->create();

    $this->get(route('services', ['ref' => $client->referral_code]))
        ->assertInertia(fn (Assert $page) => $page->where('referral.code', $client->referral_code))
        ->assertCookie('convite_ref');
});
