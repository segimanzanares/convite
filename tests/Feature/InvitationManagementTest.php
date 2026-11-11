<?php

use App\Enums\InvitationStatus;
use App\Enums\PlanFeature;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * @return array<string, string>
 */
function invitationFields(array $overrides = []): array
{
    return [
        'slug' => 'ana-y-luis',
        'template' => 'boda-clasica',
        'status' => 'draft',
        'title' => 'Ana & Luis — Nuestra Boda',
        'description' => 'Acompáñanos a celebrar.',
        ...$overrides,
    ];
}

it('creates an invitation that belongs to the client of its order', function () {
    $order = Order::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.store'), invitationFields([
            'order_id' => $order->id,
            'event_date' => '2027-03-20',
            'rsvp_deadline' => '2027-03-01',
        ]))
        ->assertRedirect(route('admin.invitations.index'))
        ->assertSessionHasNoErrors();

    $invitation = Invitation::sole();

    expect($invitation->order_id)->toBe($order->id)
        ->and($invitation->client_id)->toBe($order->client_id)
        ->and($invitation->event_date->toDateString())->toBe('2027-03-20')
        ->and($invitation->status)->toBe(InvitationStatus::Draft);
});

it('leaves an invitation without a client when it is unlinked from its order', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.update', $invitation), invitationFields([
            'slug' => $invitation->slug,
            'order_id' => '',
        ]))
        ->assertSessionHasNoErrors();

    expect($invitation->fresh()->order_id)->toBeNull()
        ->and($invitation->fresh()->client_id)->toBeNull();
});

it('only accepts templates that exist and a deadline before the event', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.store'), invitationFields([
            'template' => 'no-existe',
            'event_date' => '2027-03-20',
            'rsvp_deadline' => '2027-03-21',
        ]))
        ->assertSessionHasErrors([
            'template' => 'El valor seleccionado en plantilla no es válido.',
            'rsvp_deadline' => 'El campo fecha límite para confirmar debe ser una fecha anterior o igual a fecha del evento.',
        ]);
});

it('opens the edit form with the orders an invitation can be linked to', function () {
    $invitation = Invitation::factory()->create();
    Order::factory()->count(2)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.edit', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/index')
            ->where('modal', 'edit')
            ->where('invitation.id', $invitation->id)
            ->where('invitation.template_label', 'Boda clásica')
            ->has('orders', 2)
            ->where('templates.0.name', 'boda-clasica')
            ->where('templates.0.kind', 'wedding'));
});

it('serves the printable pages only when the plan of the order includes them', function (array $features, int $cardStatus, int $passesStatus) {
    $order = Order::factory()->for(Plan::factory()->withFeatures(...$features))->create();
    $invitation = Invitation::factory()->forOrder($order)->create(['template' => 'boda-clasica']);

    $this->get("/i/{$invitation->slug}/tarjeta")->assertStatus($cardStatus);
    $this->get("/i/{$invitation->slug}/pases")->assertStatus($passesStatus);
    $this->get("/i/{$invitation->slug}")->assertOk();
})->with([
    'no printable pages' => [[], 404, 404],
    'print card only' => [[PlanFeature::PrintCard], 200, 404],
    'guest passes only' => [[PlanFeature::GuestPasses], 404, 200],
]);
