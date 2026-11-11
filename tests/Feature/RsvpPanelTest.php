<?php

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Rsvp;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('shows the headcounts of an invitation to its client', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $attending = Guest::factory()->for($invitation)->create(['seats' => 4]);
    $declined = Guest::factory()->for($invitation)->create();
    Guest::factory()->for($invitation)->create();
    Rsvp::factory()->forGuest($attending)->create(['seats_confirmed' => 3]);
    Rsvp::factory()->forGuest($declined)->declined()->create();
    Rsvp::factory()->for($invitation)->create(['seats_confirmed' => 2]);

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('admin.invitations.rsvps.index', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('rsvps/index')
            ->where('summary', ['guests' => 3, 'attending' => 2, 'declined' => 1, 'pending' => 1, 'people' => 5])
            ->has('guests', 3)
            ->has('openAnswers', 1));
});

it('shows only the open answers when the plan has no guest list', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::OnlineRsvp))->create())
        ->create();
    Rsvp::factory()->for($invitation)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.rsvps.index', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('guests', 0)->has('openAnswers', 1));
});

it('exports every guest and answer as CSV', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create(['slug' => 'ana-y-luis']);
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'seats' => 4, 'table_label' => '3']);
    Guest::factory()->for($invitation)->create(['name' => 'Carlos', 'seats' => 1]);
    Rsvp::factory()->forGuest($guest)->create(['seats_confirmed' => 3, 'responded_at' => '2026-11-20 18:30:00']);
    Rsvp::factory()->for($invitation)->declined()->create(['name' => 'Lucía', 'message' => 'Lo siento', 'responded_at' => '2026-11-21 02:00:00']);

    $response = $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.rsvps.export', $invitation))
        ->assertOk()
        ->assertDownload('confirmaciones-ana-y-luis.csv');

    expect($response->streamedContent())->toBe(
        "\u{FEFF}Nombre,Origen,Lugares,Mesa,Respuesta,Personas,Mensaje,\"Fecha de respuesta\"\n"
        ."Carlos,Invitado,1,,Pendiente,,,\n"
        ."\"Familia Pérez\",Invitado,4,3,Asistirá,3,,\"2026-11-20 18:30\"\n"
        ."Lucía,\"Formulario abierto\",,,\"No asistirá\",0,\"Lo siento\",\"2026-11-21 02:00\"\n"
    );
});

it('deletes an answer, leaving its guest pending again', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $rsvp = Rsvp::factory()->forGuest(Guest::factory()->for($invitation)->create())->create();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->delete(route('admin.invitations.rsvps.destroy', [$invitation, $rsvp]))
        ->assertRedirect(route('admin.invitations.rsvps.index', $invitation));

    expect(Rsvp::count())->toBe(0)->and(Guest::count())->toBe(1);
});

it('keeps client users out of the answers of another client', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();

    $this->actingAs(User::factory()->client()->create())
        ->get(route('admin.invitations.rsvps.export', $invitation))
        ->assertForbidden();
});

it('has no answers page when the plan does not include online RSVPs', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::GuestManagement))->create())
        ->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.rsvps.index', $invitation))
        ->assertNotFound();
});
