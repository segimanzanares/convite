<?php

use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('keeps client users out of the sections only admins manage', function (Closure $request) {
    $clientUser = User::factory()->client()->create();

    $request($this->actingAs($clientUser))->assertForbidden();
})->with([
    'plans' => fn ($test) => $test->get(route('admin.plans.index')),
    'create a plan' => fn ($test) => $test->post(route('admin.plans.store'), ['name' => 'Gratis']),
    'clients' => fn ($test) => $test->get(route('admin.clients.index')),
    'another client' => fn ($test) => $test->get(route('admin.clients.show', Client::factory()->create())),
    'their own client record' => fn ($test) => $test->get(route('admin.clients.show', auth()->user()->client_id)),
    'an order' => fn ($test) => $test->get(route('admin.orders.show', Order::factory()->create())),
    'sell a plan' => fn ($test) => $test->post(route('admin.clients.orders.store', Client::factory()->create()), ['plan_id' => Plan::factory()->create()->id, 'price' => 1]),
    'register a payment' => fn ($test) => $test->post(route('admin.orders.payments.store', Order::factory()->create()), ['amount' => 1, 'paid_at' => '2026-11-11', 'method' => 'cash']),
    'delete a payment' => fn ($test) => $test->delete(route('admin.payments.destroy', Payment::factory()->create())),
    'every invitation' => fn ($test) => $test->get(route('admin.invitations.index')),
    'edit an invitation' => fn ($test) => $test->put(route('admin.invitations.update', Invitation::factory()->create()), []),
]);

it('lets a client user see only the invitations of their own client', function () {
    $order = Order::factory()->withPanel()->create();
    $own = Invitation::factory()->forOrder($order)->create(['title' => 'Nuestra boda']);
    Invitation::factory()->forOrder(Order::factory()->create())->create();
    Invitation::factory()->create();
    $clientUser = User::factory()->client($order->client)->create();

    $this->actingAs($clientUser)
        ->get(route('admin.invitations.mine'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/mine')
            ->has('invitations', 1)
            ->where('invitations.0.id', $own->id)
            ->where('invitations.0.title', 'Nuestra boda'));
});

it('allows a client user to view their own invitation only', function () {
    $order = Order::factory()->create();
    $clientUser = User::factory()->client($order->client)->create();
    $own = Invitation::factory()->forOrder($order)->create();
    $foreign = Invitation::factory()->forOrder(Order::factory()->create())->create();
    $demo = Invitation::factory()->create();

    expect($clientUser->can('view', $own))->toBeTrue()
        ->and($clientUser->can('view', $foreign))->toBeFalse()
        ->and($clientUser->can('view', $demo))->toBeFalse()
        ->and($clientUser->can('update', $own))->toBeFalse();
});

it('only shows "my invitations" to client users', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.mine'))
        ->assertForbidden();
});

it('shares the role of the signed in user with the panel', function () {
    $this->actingAs(User::factory()->client()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('auth.user.role', 'client'));
});
