<?php

use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Partner;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Rsvp;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->travelTo('2026-11-15 12:00:00');
});

it('shows admins the sales and payments of the last six months', function () {
    $november = Order::factory()->for(Plan::factory()->create(['price' => 3000]))->create(['created_at' => '2026-11-02']);
    $september = Order::factory()->for(Plan::factory()->create(['price' => 1500]))->create(['created_at' => '2026-09-10']);
    Order::factory()->for(Plan::factory()->create(['price' => 9999]))->create(['status' => OrderStatus::Quoted]);
    Order::factory()->for(Plan::factory()->create(['price' => 800]))->create(['created_at' => '2026-05-31']);
    Payment::factory()->for($november)->create(['amount' => 1000, 'paid_at' => '2026-11-03']);
    Payment::factory()->for($september)->create(['amount' => 500, 'paid_at' => '2026-10-20']);

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/admin')
            ->where('totals.sales_this_month', '3000.00')
            ->where('totals.collected_this_month', '1000.00')
            ->where('revenue', fn ($revenue) => collect($revenue)->pluck('month')->all() === [
                '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11',
            ])
            ->where('revenue.3', ['month' => '2026-09', 'sales' => '1500.00', 'collected' => '0.00'])
            ->where('revenue.4.collected', '500.00'));
});

it('shows admins the sales of the last six months by how the clients found Convite', function () {
    Order::factory()->for(Plan::factory()->create(['price' => 1000]))->count(2)->create(['source' => OrderSource::Instagram]);
    Order::factory()->for(Plan::factory()->create(['price' => 3000]))->create(['source' => OrderSource::Referral]);
    Order::factory()->for(Plan::factory()->create(['price' => 500]))->create();
    Order::factory()->for(Plan::factory()->create(['price' => 9999]))->create(['source' => OrderSource::Tiktok, 'status' => OrderStatus::Quoted]);
    Order::factory()->for(Plan::factory()->create(['price' => 800]))->create(['source' => OrderSource::Tiktok, 'created_at' => '2026-05-31']);

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('salesBySource', [
            ['source' => 'referral', 'orders' => 1, 'sales' => '3000.00'],
            ['source' => 'instagram', 'orders' => 2, 'sales' => '2000.00'],
            ['source' => null, 'orders' => 1, 'sales' => '500.00'],
        ]));
});

it('lists the orders that still owe part of their price', function () {
    $owing = Order::factory()->for(Plan::factory()->create(['price' => 3000]))->create();
    Payment::factory()->for($owing)->create(['amount' => 1000]);
    $paid = Order::factory()->for(Plan::factory()->create(['price' => 1500]))->create();
    Payment::factory()->for($paid)->create(['amount' => 1500]);
    Order::factory()->for(Plan::factory()->create(['price' => 2000]))->create(['status' => OrderStatus::Quoted]);
    Order::factory()->for(Plan::factory()->create(['price' => 500]))->create(['status' => OrderStatus::Delivered]);

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('totals.balance_due', '2500.00')
            ->has('ordersWithBalance', 2)
            ->where('ordersWithBalance.0.id', $owing->id)
            ->where('ordersWithBalance.0.balance', '2000.00'));
});

it('lists the commissions owed to each partner, for orders paid in full', function () {
    $ana = Partner::factory()->create(['name' => 'Ana', 'code' => 'ANA']);
    $luis = Partner::factory()->create(['name' => 'Luis', 'code' => 'LUIS']);
    $partnerOrder = function (Partner $partner, string $paid, array $attributes = []): Order {
        $order = Order::factory()->for(Plan::factory()->create(['price' => 1000]))->create([
            'source' => OrderSource::Partner,
            'partner_id' => $partner->id,
            'commission_percent' => '10.00',
            ...$attributes,
        ]);
        Payment::factory()->for($order)->create(['amount' => $paid]);

        return $order;
    };
    $partnerOrder($ana, '1000');
    $partnerOrder($ana, '1000', ['commission_percent' => '20.00']);
    $partnerOrder($luis, '1000');
    // Not owed: not paid in full, already paid to the partner, or a quote
    $partnerOrder($luis, '999');
    $partnerOrder($luis, '1000', ['commission_paid_at' => now()]);
    $partnerOrder($luis, '1000', ['status' => OrderStatus::Quoted]);

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('commissionsOwed', [
            ['partner' => ['id' => $ana->id, 'name' => 'Ana', 'code' => 'ANA'], 'orders' => 2, 'amount' => '300.00'],
            ['partner' => ['id' => $luis->id, 'name' => 'Luis', 'code' => 'LUIS'], 'orders' => 1, 'amount' => '100.00'],
        ]));
});

it('lists the events of the coming days, without the demos', function () {
    $soon = Invitation::factory()->forOrder(Order::factory()->create())->create(['event_date' => '2026-11-20']);
    $later = Invitation::factory()->forOrder(Order::factory()->create())->create(['event_date' => '2026-12-30']);
    Invitation::factory()->forOrder(Order::factory()->create())->create(['event_date' => '2027-03-01']);
    Invitation::factory()->forOrder(Order::factory()->create())->create(['event_date' => '2026-11-14']);
    Invitation::factory()->create(['event_date' => '2026-11-18']);

    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('totals.upcoming_events', 2)
            ->where('upcomingEvents.0.id', $soon->id)
            ->where('upcomingEvents.1.id', $later->id));
});

it('shows client users the progress of their own invitations', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->withPanel(maxGuests: 50)->create())
        ->create(['event_date' => '2026-12-05']);
    $attending = Guest::factory()->for($invitation)->create(['seats' => 4, 'sent_at' => now(), 'first_opened_at' => now()]);
    Guest::factory()->for($invitation)->create(['sent_at' => now()]);
    Guest::factory()->for($invitation)->create();
    Rsvp::factory()->forGuest($attending)->create(['seats_confirmed' => 3, 'responded_at' => '2026-11-14 18:00']);
    Rsvp::factory()->for($invitation)->declined()->create(['responded_at' => '2026-11-15 09:00']);
    $other = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    Rsvp::factory()->for($other)->create();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/client')
            ->has('invitations', 1)
            ->where('invitations.0.invitation.id', $invitation->id)
            ->where('invitations.0.days_until_event', 20)
            ->where('invitations.0.guests', ['total' => 3, 'sent' => 2, 'opened' => 1, 'limit' => 50])
            ->where('invitations.0.rsvps', ['guests' => 3, 'attending' => 1, 'declined' => 1, 'pending' => 2, 'people' => 3])
            ->has('recentAnswers', 2)
            ->where('recentAnswers.0.attending', false)
            ->where('recentAnswers.0.invitation.id', $invitation->id)
            ->has('answersByDay', 14)
            ->where('answersByDay.12', ['day' => '2026-11-14', 'attending' => 1, 'declined' => 0])
            ->where('answersByDay.13', ['day' => '2026-11-15', 'attending' => 0, 'declined' => 1]));
});

it('leaves out the sections the client plan does not include', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::OnlineRsvp))->create())
        ->create();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitations.0.guests', null)
            ->where('invitations.0.days_until_event', null)
            ->where('invitations.0.rsvps.attending', 0));
});
