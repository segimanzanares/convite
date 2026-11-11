<?php

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Rsvp;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('lets a client user add a guest with a personalized link to their invitation', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel(10)->create())->create();
    $clientUser = User::factory()->client($invitation->client)->create();

    $this->actingAs($clientUser)
        ->post(route('admin.invitations.guests.store', $invitation), [
            'name' => 'Familia Pérez',
            'seats' => '4',
            'table_label' => '3',
        ])
        ->assertRedirect(route('admin.invitations.guests.index', $invitation))
        ->assertSessionHasNoErrors();

    $guest = Guest::sole();

    expect($guest->invitation_id)->toBe($invitation->id)
        ->and($guest->name)->toBe('Familia Pérez')
        ->and($guest->seats)->toBe(4)
        ->and($guest->table_label)->toBe('3')
        ->and($guest->token)->toHaveLength(Guest::TOKEN_LENGTH);
});

it('lists the guests with their links and the slots left in the plan', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel(10)->create())->create();
    $guest = Guest::factory()->for($invitation)->create();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('admin.invitations.guests.index', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('guests/index')
            ->where('remaining', 9)
            ->where('guests.0.url', route('invitations.guest', [$invitation, $guest->token])));
});

it('does not add guests beyond the limit of the plan', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel(1)->create())->create();
    Guest::factory()->for($invitation)->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.guests.store', $invitation), ['name' => 'Ana', 'seats' => '1'])
        ->assertSessionHasErrors(['guests' => 'El plan permite 1 invitados y la lista está completa.']);

    expect($invitation->guests()->count())->toBe(1);
});

it('validates the guest', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.guests.store', $invitation), ['email' => 'no-es-correo', 'seats' => '0'])
        ->assertSessionHasErrors([
            'name' => 'El campo nombre es obligatorio.',
            'seats' => 'El campo lugares debe ser al menos 1.',
            'email' => 'El campo correo electrónico debe ser un correo electrónico válido.',
        ]);
});

it('updates and deletes a guest along with their answer', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $guest = Guest::factory()->for($invitation)->create();
    Rsvp::factory()->forGuest($guest)->create();
    $user = User::factory()->client($invitation->client)->create();

    $this->actingAs($user)
        ->put(route('admin.invitations.guests.update', [$invitation, $guest]), ['name' => 'Familia Ruiz', 'seats' => '2'])
        ->assertSessionHasNoErrors();

    expect($guest->fresh()->name)->toBe('Familia Ruiz');

    $this->actingAs($user)
        ->delete(route('admin.invitations.guests.destroy', [$invitation, $guest]))
        ->assertRedirect(route('admin.invitations.guests.index', $invitation));

    expect(Guest::count())->toBe(0)->and(Rsvp::count())->toBe(0);
});

it('keeps client users out of the guests of another client', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();

    $this->actingAs(User::factory()->client()->create())
        ->post(route('admin.invitations.guests.store', $invitation), ['name' => 'Intruso', 'seats' => '1'])
        ->assertForbidden();

    expect(Guest::count())->toBe(0);
});

it('does not reach a guest through another invitation', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $otherGuest = Guest::factory()->for(Invitation::factory()->forOrder(Order::factory()->withPanel()->create()))->create();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->delete(route('admin.invitations.guests.destroy', [$invitation, $otherGuest]))
        ->assertNotFound();

    expect($otherGuest->fresh())->not->toBeNull();
});

it('has no guest list when the plan does not include it, even for admins', function (Closure $invitation) {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.guests.index', $invitation()))
        ->assertNotFound();
})->with([
    'plan without guest management' => fn () => Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::OnlineRsvp))->create())
        ->create(),
    'demo without an order' => fn () => Invitation::factory()->create(),
]);
