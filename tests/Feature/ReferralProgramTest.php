<?php

use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use App\Services\ReferralService;
use Inertia\Testing\AssertableInertia as Assert;

it('gives every new client a referral code made from their first name', function () {
    $client = Client::factory()->create(['name' => 'María José Pérez']);

    expect($client->referral_code)->toMatch('/^MARIA[2-9A-HJKMNP-Z]{4}$/');
});

it('records the client who referred an order from their code, ignoring case', function () {
    $referrer = Client::factory()->create();
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', $client), [
            'plan_id' => Plan::factory()->create()->id,
            'price' => '900',
            'source' => 'referral',
            'referral_code' => ' '.strtolower($referrer->referral_code),
        ])
        ->assertSessionHasNoErrors();

    expect(Order::sole())
        ->source->toBe(OrderSource::Referral)
        ->referrer_client_id->toBe($referrer->id);
});

it('rejects a referral without a valid code of another client', function (?string $code, string $message) {
    $client = Client::factory()->create(['referral_code' => 'OWNCODE1']);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', $client), [
            'plan_id' => Plan::factory()->create()->id,
            'price' => '900',
            'source' => 'referral',
            'referral_code' => $code,
        ])
        ->assertSessionHasErrors(['referral_code' => $message]);

    expect(Order::count())->toBe(0);
})->with([
    'missing' => [null, 'El campo código de referido es obligatorio.'],
    'unknown' => ['NOEXISTE', 'Ningún cliente tiene ese código de referido.'],
    'the client\'s own' => ['OWNCODE1', 'Un cliente no puede recomendarse a sí mismo.'],
]);

it('keeps no referrer for sources other than a referral', function () {
    $referrer = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), [
            'plan_id' => Plan::factory()->create()->id,
            'price' => '900',
            'source' => 'instagram',
            'referral_code' => $referrer->referral_code,
        ])
        ->assertSessionHasNoErrors();

    expect(Order::sole())
        ->source->toBe(OrderSource::Instagram)
        ->referrer_client_id->toBeNull();
});

it('drops the referrer when an order\'s source is changed', function () {
    $order = Order::factory()->create([
        'source' => OrderSource::Referral,
        'referrer_client_id' => Client::factory()->create()->id,
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => $order->price,
            'status' => $order->status->value,
            'source' => 'tiktok',
        ])
        ->assertSessionHasNoErrors();

    expect($order->refresh())
        ->source->toBe(OrderSource::Tiktok)
        ->referrer_client_id->toBeNull();
});

it('counts on the client page the sales their code brought in, not the quotes', function () {
    $referrer = Client::factory()->create();
    Order::factory()->count(2)->create(['source' => OrderSource::Referral, 'referrer_client_id' => $referrer->id]);
    Order::factory()->create([
        'source' => OrderSource::Referral,
        'referrer_client_id' => $referrer->id,
        'status' => OrderStatus::Quoted,
    ]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.clients.show', $referrer))
        ->assertInertia(fn (Assert $page) => $page
            ->where('client.referral_code', $referrer->referral_code)
            ->where('client.referral_url', route('landing', ['ref' => $referrer->referral_code]))
            ->where('client.referred_orders_count', 2));
});

it('offers the discount on the landing page and remembers the referral code', function () {
    $referrer = Client::factory()->create(['name' => 'Ana López']);

    $this->get(route('landing', ['ref' => strtolower($referrer->referral_code)]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('referral', ['code' => $referrer->referral_code, 'discount_percent' => 10]))
        ->assertCookie(ReferralService::COOKIE, $referrer->referral_code)
        // The visitor gets the code, never who it belongs to
        ->assertDontSee('Ana López');
});

it('applies the remembered referral code on a later visit', function () {
    $referrer = Client::factory()->create();

    $this->withCookie(ReferralService::COOKIE, $referrer->referral_code)
        ->get(route('landing'))
        ->assertInertia(fn (Assert $page) => $page->where('referral.code', $referrer->referral_code));
});

it('ignores unknown referral codes', function () {
    $this->get(route('landing', ['ref' => 'NOEXISTE']))
        ->assertInertia(fn (Assert $page) => $page->where('referral', null))
        ->assertCookieMissing(ReferralService::COOKIE);
});

it('links the credit of a client\'s invitation to the landing page with the client\'s referral code', function () {
    $order = Order::factory()->create();
    $invitation = Invitation::factory()->forOrder($order)->create(['template' => 'boda-moderna']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('conviteUrl', route('landing', [
            'utm_source' => 'invitacion',
            'utm_medium' => 'credito',
            'utm_campaign' => 'boda-moderna',
            'ref' => $order->client->referral_code,
        ])));
});

it('links the credit of a demo to the landing page without a referral code', function () {
    $invitation = Invitation::factory()->create(['template' => 'boda-clasica']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('conviteUrl', route('landing', [
            'utm_source' => 'invitacion',
            'utm_medium' => 'credito',
            'utm_campaign' => 'boda-clasica',
        ])));
});

it('hides the program from the landing page while it is off', function () {
    config(['convite.referrals_enabled' => false]);
    $referrer = Client::factory()->create();

    $this->withCookie(ReferralService::COOKIE, $referrer->referral_code)
        ->get(route('landing', ['ref' => $referrer->referral_code]))
        ->assertInertia(fn (Assert $page) => $page->where('referral', null))
        ->assertCookieMissing(ReferralService::COOKIE);
});

it('leaves the referral code out of the invitation credit while the program is off', function () {
    config(['convite.referrals_enabled' => false]);
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create(['template' => 'boda-moderna']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('conviteUrl', route('landing', [
            'utm_source' => 'invitacion',
            'utm_medium' => 'credito',
            'utm_campaign' => 'boda-moderna',
        ])));
});

it('takes no new referrals while the program is off', function () {
    config(['convite.referrals_enabled' => false]);
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.clients.show', $client))
        ->assertInertia(fn (Assert $page) => $page->where('referralsEnabled', false));

    $this->post(route('admin.clients.orders.store', $client), [
        'plan_id' => Plan::factory()->create()->id,
        'price' => '900',
        'source' => 'referral',
        'referral_code' => Client::factory()->create()->referral_code,
    ])->assertSessionHasErrors(['source' => 'El valor seleccionado en origen no es válido.']);
});

it('keeps the referrer of a past order when it is edited while the program is off', function () {
    config(['convite.referrals_enabled' => false]);
    $referrer = Client::factory()->create();
    $order = Order::factory()->create(['source' => OrderSource::Referral, 'referrer_client_id' => $referrer->id]);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => '700',
            'status' => $order->status->value,
            'source' => 'referral',
            'referral_code' => $referrer->referral_code,
        ])
        ->assertSessionHasNoErrors();

    expect($order->refresh())
        ->price->toBe('700.00')
        ->referrer_client_id->toBe($referrer->id);
});
