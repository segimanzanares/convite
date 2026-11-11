<?php

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Rsvp;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function invitationWithOnlineRsvp(array $attributes = []): Invitation
{
    return Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create($attributes);
}

it('stores an answer from the open form', function () {
    $invitation = invitationWithOnlineRsvp();

    $this->postJson(route('invitations.rsvp.store', $invitation), [
        'name' => ' Lucía Castillo ',
        'attending' => true,
        'seats' => 2,
        'message' => '¡Felicidades!',
    ])->assertCreated()->assertJson(['name' => 'Lucía Castillo', 'attending' => true, 'seats_confirmed' => 2]);

    $rsvp = Rsvp::sole();

    expect($rsvp->invitation_id)->toBe($invitation->id)
        ->and($rsvp->guest_id)->toBeNull()
        ->and($rsvp->message)->toBe('¡Felicidades!');
});

it('confirms no seats for someone who will not attend', function () {
    $invitation = invitationWithOnlineRsvp();

    $this->postJson(route('invitations.rsvp.store', $invitation), ['name' => 'Ana', 'attending' => false, 'seats' => 3])
        ->assertCreated();

    expect(Rsvp::sole()->seats_confirmed)->toBe(0);
});

it('limits the open form to the configured seats', function () {
    config(['convite.open_rsvp_max_seats' => 5]);

    $this->postJson(route('invitations.rsvp.store', invitationWithOnlineRsvp()), ['attending' => true, 'seats' => 6])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name' => 'El campo nombre es obligatorio.',
            'seats' => 'El campo lugares no debe ser mayor que 5.',
        ]);
});

it('keeps a single answer per guest, which they may change', function () {
    $invitation = invitationWithOnlineRsvp();
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'seats' => 4]);

    $this->postJson(route('invitations.rsvp.store', $invitation), ['token' => $guest->token, 'attending' => true, 'seats' => 4])
        ->assertCreated();
    $this->postJson(route('invitations.rsvp.store', $invitation), ['token' => $guest->token, 'attending' => true, 'seats' => 3, 'name' => 'Otro nombre'])
        ->assertOk();

    $rsvp = Rsvp::sole();

    expect($rsvp->guest_id)->toBe($guest->id)
        ->and($rsvp->name)->toBe('Familia Pérez')
        ->and($rsvp->seats_confirmed)->toBe(3);
});

it('does not let a guest confirm more seats than they have', function () {
    $invitation = invitationWithOnlineRsvp();
    $guest = Guest::factory()->for($invitation)->create(['seats' => 2]);

    $this->postJson(route('invitations.rsvp.store', $invitation), ['token' => $guest->token, 'attending' => true, 'seats' => 3])
        ->assertJsonValidationErrors(['seats' => 'El campo lugares no debe ser mayor que 2.']);
});

it('closes the form at the end of the deadline day', function (string $now, bool $open) {
    $this->travelTo($now);
    $invitation = invitationWithOnlineRsvp(['rsvp_deadline' => '2026-12-01', 'event_date' => '2026-12-12']);

    $response = $this->postJson(route('invitations.rsvp.store', $invitation), ['name' => 'Ana', 'attending' => false]);

    $open
        ? $response->assertCreated()
        : $response->assertJsonValidationErrors(['rsvp' => 'El plazo para confirmar asistencia terminó.']);
})->with([
    'last minute of the deadline day' => ['2026-12-01 23:59:00', true],
    'the day after' => ['2026-12-02 00:00:00', false],
]);

it('does not take answers for a draft', function () {
    $invitation = invitationWithOnlineRsvp(['status' => 'draft']);

    $this->postJson(route('invitations.rsvp.store', $invitation), ['name' => 'Ana', 'attending' => false])
        ->assertNotFound();

    // A preview from the panel shows the form closed and does not store test answers
    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->postJson(route('invitations.rsvp.store', $invitation), ['name' => 'Ana', 'attending' => false])
        ->assertJsonValidationErrors('rsvp');

    $this->get("/i/{$invitation->slug}")->assertInertia(fn (Assert $page) => $page->where('rsvp.open', false));

    expect(Rsvp::count())->toBe(0);
});

it('has no online form when the plan does not include it', function (Closure $invitation) {
    $this->postJson(route('invitations.rsvp.store', $invitation()), ['name' => 'Ana', 'attending' => false])
        ->assertNotFound();

    expect(Rsvp::count())->toBe(0);
})->with([
    'plan without online RSVPs' => fn () => Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::GuestManagement))->create())
        ->create(),
    'demo without an order' => fn () => Invitation::factory()->create(),
]);

it('limits how many answers a visitor may send', function () {
    $invitation = invitationWithOnlineRsvp();

    foreach (range(1, 10) as $attempt) {
        $this->postJson(route('invitations.rsvp.store', $invitation), ['name' => "Ana {$attempt}", 'attending' => false]);
    }

    $this->postJson(route('invitations.rsvp.store', $invitation), ['name' => 'Ana', 'attending' => false])
        ->assertTooManyRequests();
});

it('greets the guest of a personalized link and records when they first opened it', function () {
    $this->freezeTime();
    $invitation = invitationWithOnlineRsvp();
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'seats' => 4]);
    Rsvp::factory()->forGuest($guest)->create(['seats_confirmed' => 3]);

    $this->get(route('invitations.guest', [$invitation, $guest->token]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/demo/InvitationPage')
            ->where('guest.name', 'Familia Pérez')
            ->where('guest.seats', 4)
            ->where('guest.rsvp.seats_confirmed', 3)
            ->where('rsvp.online', true)
            ->where('rsvp.open', true));

    expect($guest->fresh()->first_opened_at->toDateTimeString())->toBe(now()->toDateTimeString());
});

it('does not count a preview from the panel as the guest opening their link', function () {
    $invitation = invitationWithOnlineRsvp();
    $guest = Guest::factory()->for($invitation)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('invitations.guest', [$invitation, $guest->token]))
        ->assertOk();

    expect($guest->fresh()->first_opened_at)->toBeNull();
});

it('shows the open invitation for an unknown token', function () {
    $invitation = invitationWithOnlineRsvp();

    $this->get(route('invitations.guest', [$invitation, 'tokenquenoexiste']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/demo/InvitationPage')
            ->where('guest', null));
});

it('keeps the WhatsApp RSVP on invitations without online RSVPs', function () {
    $this->get(route('invitations.show', Invitation::factory()->create()))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('rsvp.online', false)->where('guest', null));
});
