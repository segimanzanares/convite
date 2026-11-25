<?php

use App\Enums\CommissionStatus;
use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use App\Models\Client;
use App\Models\Order;
use App\Models\Partner;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use App\Services\PartnerService;
use App\Services\ReferralService;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * An order brought by the partner, for $1,000 at their 15% commission, with the given amount paid.
 */
function partnerOrder(Partner $partner, string $paid = '0', array $attributes = []): Order
{
    $order = Order::factory()->create([
        'price' => '1000.00',
        'source' => OrderSource::Partner,
        'partner_id' => $partner->id,
        'commission_percent' => '15.00',
        ...$attributes,
    ]);

    if ((float) $paid > 0) {
        Payment::factory()->for($order)->create(['amount' => $paid]);
    }

    return $order;
}

it('creates a partner with a code made from their name when none is typed', function () {
    Partner::factory()->create(['code' => 'ANAPLANNER']);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.partners.store'), [
            'name' => 'Ana Planner',
            'kind' => 'wedding_planner',
            'commission_percent' => '12.5',
            'discount_percent' => '5',
            'is_active' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect(Partner::latest('id')->first())
        ->code->toBe('ANAPLANNER2')
        ->commission_percent->toBe('12.50')
        ->discount_percent->toBe(5)
        ->is_active->toBeTrue();
});

it('keeps partner codes unique regardless of case', function () {
    $partner = Partner::factory()->create(['code' => 'ANA10']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.partners.update', Partner::factory()->create()), [
            'name' => 'Otra',
            'kind' => 'influencer',
            'code' => ' ana10 ',
            'commission_percent' => '10',
            'discount_percent' => '0',
        ])
        ->assertSessionHasErrors(['code' => 'El valor de código ya está en uso.']);

    expect($partner->refresh()->code)->toBe('ANA10');
});

it('refuses partner codes with characters other than letters and numbers', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.partners.store'), [
            'name' => 'Ana',
            'kind' => 'influencer',
            'code' => 'ANA-10',
            'commission_percent' => '10',
            'discount_percent' => '0',
        ])
        ->assertSessionHasErrors('code');

    expect(Partner::count())->toBe(0);
});

it('keeps partners with orders for the commissions history', function () {
    $partner = Partner::factory()->create();
    partnerOrder($partner, attributes: ['status' => OrderStatus::Quoted]);

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.partners.destroy', $partner));

    expect($partner->fresh())->not->toBeNull();
});

it('deletes partners without orders', function () {
    $partner = Partner::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.partners.destroy', $partner))
        ->assertRedirect(route('admin.partners.index'));

    expect($partner->fresh())->toBeNull();
});

it('keeps client users out of the partners section', function () {
    $partner = Partner::factory()->create();
    $order = partnerOrder($partner, '1000');

    $this->actingAs(User::factory()->client()->create());

    $this->get(route('admin.partners.index'))->assertForbidden();
    $this->post(route('admin.orders.commission.store', $order))->assertForbidden();
    expect($order->refresh()->commission_paid_at)->toBeNull();
});

it('assigns the partner to an order with their current commission percent', function () {
    $partner = Partner::factory()->create(['commission_percent' => '20']);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), [
            'plan_id' => Plan::factory()->create()->id,
            'price' => '1500',
            'source' => 'partner',
            'partner_id' => $partner->id,
        ])
        ->assertSessionHasNoErrors();

    $order = Order::sole();
    expect($order)
        ->partner_id->toBe($partner->id)
        ->commission_percent->toBe('20.00')
        ->commissionAmount()->toBe('300.00');
});

it('keeps the commission percent of an order when the partner\'s percent changes later', function () {
    $partner = Partner::factory()->create(['commission_percent' => '20']);
    $order = partnerOrder($partner);
    $partner->update(['commission_percent' => '30']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => '1200',
            'status' => $order->status->value,
            'source' => 'partner',
            'partner_id' => $partner->id,
        ])
        ->assertSessionHasNoErrors();

    expect($order->refresh())
        ->commission_percent->toBe('15.00')
        ->commissionAmount()->toBe('180.00');
});

it('lets a vendor recommendation go without a partner, owing no commission', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), [
            'plan_id' => Plan::factory()->create()->id,
            'price' => '900',
            'source' => 'partner',
            'partner_id' => '',
        ])
        ->assertSessionHasNoErrors();

    expect(Order::sole())
        ->partner_id->toBeNull()
        ->commissionStatus()->toBeNull();
});

it('drops the partner when an order\'s source is changed', function () {
    $order = partnerOrder(Partner::factory()->create());

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => $order->price,
            'status' => $order->status->value,
            'source' => 'instagram',
            'partner_id' => $order->partner_id,
        ])
        ->assertSessionHasNoErrors();

    expect($order->refresh())
        ->partner_id->toBeNull()
        ->commission_percent->toBeNull();
});

it('does not assign an inactive partner to a new order', function () {
    $partner = Partner::factory()->inactive()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), [
            'plan_id' => Plan::factory()->create()->id,
            'price' => '900',
            'source' => 'partner',
            'partner_id' => $partner->id,
        ])
        ->assertSessionHasErrors(['partner_id' => 'El aliado ya no está activo.']);

    expect(Order::count())->toBe(0);
});

it('keeps an inactive partner on an order that already had them', function () {
    $partner = Partner::factory()->inactive()->create();
    $order = partnerOrder($partner);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => '1000',
            'status' => $order->status->value,
            'source' => 'partner',
            'partner_id' => $partner->id,
        ])
        ->assertSessionHasNoErrors();

    expect($order->refresh()->partner_id)->toBe($partner->id);
});

it('keeps the partner on an order whose commission was already paid', function () {
    $order = partnerOrder(Partner::factory()->create(), '1000', ['commission_paid_at' => now()]);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => '1000',
            'status' => $order->status->value,
            'source' => 'partner',
            'partner_id' => Partner::factory()->create()->id,
        ])
        ->assertSessionHasErrors(['partner_id' => 'Al aliado ya se le pagó su comisión de esta contratación, así que no se puede cambiar.']);

    expect($order->refresh()->commission_paid_at)->not->toBeNull();
});

it('owes the commission once the order is paid in full', function (string $paid, CommissionStatus $status) {
    $order = partnerOrder(Partner::factory()->create(), $paid);

    expect($order->commissionStatus())->toBe($status);
})->with([
    'nothing paid' => ['0', CommissionStatus::Pending],
    'a deposit' => ['500', CommissionStatus::Pending],
    'paid in full' => ['1000', CommissionStatus::Earned],
]);

it('marks an earned commission as paid, and undoes it', function () {
    $order = partnerOrder(Partner::factory()->create(), '1000');
    $this->actingAs(User::factory()->create());

    $this->post(route('admin.orders.commission.store', $order))->assertRedirect();
    expect($order->refresh()->commissionStatus())->toBe(CommissionStatus::Paid);

    $this->delete(route('admin.orders.commission.destroy', $order))->assertRedirect();
    expect($order->refresh()->commissionStatus())->toBe(CommissionStatus::Earned);
});

it('does not mark a commission as paid before the order is paid in full', function () {
    $order = partnerOrder(Partner::factory()->create(), '500');

    $this->actingAs(User::factory()->create())
        ->post(route('admin.orders.commission.store', $order))
        ->assertInertiaFlash('toast.type', 'error');

    expect($order->refresh()->commission_paid_at)->toBeNull();
});

it('pays every earned commission of a partner at once', function () {
    $partner = Partner::factory()->create();
    $earned = partnerOrder($partner, '1000');
    $pending = partnerOrder($partner, '200');

    $this->actingAs(User::factory()->create())
        ->post(route('admin.partners.commissions.pay', $partner))
        ->assertRedirect();

    expect($earned->refresh()->commissionStatus())->toBe(CommissionStatus::Paid)
        ->and($pending->refresh()->commissionStatus())->toBe(CommissionStatus::Pending);
});

it('sums up the partner\'s sales and commissions, leaving quotes out', function () {
    $partner = Partner::factory()->create();
    partnerOrder($partner, '300');
    partnerOrder($partner, '1000');
    partnerOrder($partner, '1000', ['commission_paid_at' => now()]);
    partnerOrder($partner, attributes: ['status' => OrderStatus::Quoted]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.partners.show', $partner))
        ->assertInertia(fn (Assert $page) => $page
            ->component('partners/show')
            ->where('partner.link', url('/a/'.$partner->code))
            ->where('partner.summary', [
                'sales_count' => 3,
                'sales_total' => '3000.00',
                'commission_pending' => '150.00',
                'commission_earned' => '150.00',
                'commission_paid' => '150.00',
            ])
            ->has('orders', 4));
});

it('sends the short link to the landing page with the partner\'s code and UTM parameters', function () {
    $partner = Partner::factory()->create(['code' => 'ANA10', 'kind' => 'influencer']);

    $this->get('/a/ana10')->assertRedirect(route('landing', [
        'aliado' => 'ANA10',
        'utm_source' => 'ana10',
        'utm_medium' => 'aliado',
        'utm_campaign' => 'influencer',
    ]));
});

it('sends the short link of an inactive partner to the plain landing page', function () {
    Partner::factory()->inactive()->create(['code' => 'ANA10']);

    $this->get('/a/ANA10')->assertRedirect(route('landing'));
});

it('offers the partner\'s discount on the landing page and remembers their code', function () {
    $partner = Partner::factory()->create(['name' => 'Ana López', 'code' => 'ANA10', 'discount_percent' => 15]);

    $this->get(route('landing', ['aliado' => 'ana10']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('partner', ['code' => 'ANA10', 'discount_percent' => 15])
            ->where('referral', null))
        ->assertCookie(PartnerService::COOKIE, 'ANA10')
        // The visitor gets the code, never who it belongs to
        ->assertDontSee('Ana López');
});

it('applies the remembered partner on a later visit to the services page', function () {
    Partner::factory()->create(['code' => 'ANA10']);

    $this->withCookie(PartnerService::COOKIE, 'ANA10')
        ->get(route('services'))
        ->assertInertia(fn (Assert $page) => $page->where('partner.code', 'ANA10'));
});

it('ignores the links of inactive partners', function () {
    Partner::factory()->inactive()->create(['code' => 'ANA10']);

    $this->get(route('landing', ['aliado' => 'ANA10']))
        ->assertInertia(fn (Assert $page) => $page->where('partner', null))
        ->assertCookieMissing(PartnerService::COOKIE);
});

it('replaces a remembered client referral with a partner\'s link', function () {
    $referrer = Client::factory()->create();
    Partner::factory()->create(['code' => 'ANA10']);

    $this->withCookie(ReferralService::COOKIE, $referrer->referral_code)
        ->get(route('landing', ['aliado' => 'ANA10']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('partner.code', 'ANA10')
            ->where('referral', null))
        ->assertCookieExpired(ReferralService::COOKIE);
});

it('replaces a remembered partner with a client\'s referral link', function () {
    $referrer = Client::factory()->create();
    Partner::factory()->create(['code' => 'ANA10']);

    $this->withCookie(PartnerService::COOKIE, 'ANA10')
        ->get(route('landing', ['ref' => $referrer->referral_code]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('partner', null)
            ->where('referral.code', $referrer->referral_code))
        ->assertCookieExpired(PartnerService::COOKIE);
});
