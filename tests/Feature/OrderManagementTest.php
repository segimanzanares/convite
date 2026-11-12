<?php

use App\Enums\OrderStatus;
use App\Enums\PlanFeature;
use App\Models\Client;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('sells a plan with an adjusted price and keeps a copy of its conditions', function () {
    $client = Client::factory()->create();
    $plan = Plan::factory()->withPanel(120)->create(['name' => 'Estándar', 'price' => 2500]);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', $client), [
            'plan_id' => $plan->id,
            'price' => '2200',
            'notes' => 'Descuento de amigos',
        ])
        ->assertRedirect(route('admin.orders.show', Order::sole()))
        ->assertSessionHasNoErrors();

    $order = Order::sole();

    expect($order->client_id)->toBe($client->id)
        ->and($order->price)->toBe('2200.00')
        ->and($order->status)->toBe(OrderStatus::Quoted)
        ->and($order->plan_snapshot)->toBe([
            'name' => 'Estándar',
            'max_guests' => 120,
            'max_seats_per_guest' => null,
            'features' => ['guest_management', 'online_rsvp'],
        ]);
});

it('does not sell a plan that is no longer offered', function () {
    $plan = Plan::factory()->inactive()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), [
            'plan_id' => $plan->id,
            'price' => '1000',
        ])
        ->assertSessionHasErrors(['plan_id' => 'El valor seleccionado en plan no es válido.']);
});

it('keeps the conditions of an order when its plan is edited later', function () {
    $order = Order::factory()->withPanel(100)->create();

    $this->actingAs(User::factory()->create())
        ->put(route('admin.plans.update', $order->plan), [
            'name' => 'Renombrado',
            'slug' => $order->plan->slug,
            'price' => '9999',
            'max_guests' => '10',
            'features' => [],
            'sort_order' => '0',
        ])
        ->assertSessionHasNoErrors();

    $order->refresh();

    expect($order->plan_snapshot['max_guests'])->toBe(100)
        ->and($order->maxGuests())->toBe(100)
        ->and($order->hasFeature(PlanFeature::OnlineRsvp))->toBeTrue()
        ->and($order->grantsPanelAccess())->toBeTrue()
        ->and($order->client->canHavePanelAccess())->toBeTrue();
});

it('registers payments and shows the pending balance', function () {
    $order = Order::factory()->create(['price' => 3000]);
    Payment::factory()->for($order)->create(['amount' => 1000]);
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.orders.payments.store', $order), [
            'amount' => '500.50',
            'paid_at' => '2026-11-10',
            'method' => 'cash',
        ])
        ->assertRedirect(route('admin.orders.show', $order))
        ->assertSessionHasNoErrors();

    $this->actingAs($admin)
        ->get(route('admin.orders.show', $order))
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/show')
            ->has('order.payments', 2)
            ->where('order.amount_paid', '1500.50')
            ->where('order.balance', '1499.50'));
});

it('rejects a payment without a positive amount', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.orders.payments.store', Order::factory()->create()), [
            'amount' => '0',
            'paid_at' => '2026-11-10',
            'method' => 'cash',
        ])
        ->assertSessionHasErrors(['amount' => 'El campo monto debe ser mayor que 0.']);
});

it('updates the price and status of an order but never its plan', function () {
    $order = Order::factory()->create();
    $otherPlan = Plan::factory()->create();

    $this->actingAs(User::factory()->create())
        ->put(route('admin.orders.update', $order), [
            'price' => '100',
            'status' => 'delivered',
            'plan_id' => $otherPlan->id,
        ])
        ->assertSessionHasNoErrors();

    $order->refresh();

    expect($order->price)->toBe('100.00')
        ->and($order->status)->toBe(OrderStatus::Delivered)
        ->and($order->plan_id)->not->toBe($otherPlan->id);
});

it('deletes an order only while it has no payments', function () {
    $unpaid = Order::factory()->create();
    $paid = Payment::factory()->create()->order;
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.orders.destroy', $paid))
        ->assertInertiaFlash('toast.type', 'error');
    $this->actingAs($admin)
        ->delete(route('admin.orders.destroy', $unpaid))
        ->assertRedirect(route('admin.clients.show', $unpaid->client_id));

    $this->assertModelExists($paid);
    $this->assertModelMissing($unpaid);
});
