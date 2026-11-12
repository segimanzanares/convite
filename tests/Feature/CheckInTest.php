<?php

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Rsvp;
use App\Models\User;
use App\Services\CheckInService;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * An invitation whose plan includes check-in, with the event today and a door link.
 */
function invitationAtTheDoor(PlanFeature ...$features): Invitation
{
    $plan = Plan::factory()->withFeatures(PlanFeature::GuestManagement, PlanFeature::CheckIn, ...$features);
    $invitation = Invitation::factory()->forOrder(Order::factory()->for($plan)->create())->create(['event_date' => today()]);
    app(CheckInService::class)->regenerateDoorToken($invitation);

    return $invitation;
}

function doorCookie(Invitation $invitation): array
{
    return ["convite_door_{$invitation->id}" => $invitation->door_token];
}

it('gives a phone door access through the door link while check-in is open', function () {
    $invitation = invitationAtTheDoor();
    Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'seats' => 4]);

    $this->get(route('invitations.door.enter', [$invitation, $invitation->door_token]))
        ->assertRedirect(route('invitations.door.show', $invitation))
        ->assertCookie("convite_door_{$invitation->id}", $invitation->door_token);

    $this->withCookies(doorCookie($invitation))
        ->get(route('invitations.door.show', $invitation))
        ->assertOk()
        ->assertViewIs('admin')
        ->assertInertia(fn (Assert $page) => $page
            ->component('check-in/door')
            ->where('door.summary', ['guests' => 1, 'seats' => 4, 'arrived_guests' => 0, 'arrived_seats' => 0])
            ->where('guests.0.name', 'Familia Pérez'));
});

it('does not open the door with a wrong token or a plan without check-in', function () {
    $invitation = invitationAtTheDoor();
    $withoutCheckIn = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::GuestManagement))->create())
        ->create(['event_date' => today(), 'door_token' => str_repeat('a', 32)]);

    $this->get(route('invitations.door.enter', [$invitation, str_repeat('x', 32)]))
        ->assertNotFound()
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page->component('pages/not-found/NotFoundPage'));
    $this->get(route('invitations.door.enter', [$withoutCheckIn, $withoutCheckIn->door_token]))->assertNotFound();
    $this->get(route('invitations.door.show', $invitation))->assertNotFound();
});

it('says when the door opens outside the check-in window', function () {
    $invitation = invitationAtTheDoor();
    $invitation->update(['event_date' => today()->addDays(5)]);

    $this->get(route('invitations.door.enter', [$invitation, $invitation->door_token]))
        ->assertOk()
        ->assertCookieMissing("convite_door_{$invitation->id}")
        ->assertInertia(fn (Assert $page) => $page
            ->component('check-in/door')
            ->where('door.is_open', false)
            ->where('guests', null));
});

it('opens check-in from the day before the event until noon after it', function (string $now, bool $isOpen) {
    $invitation = invitationAtTheDoor();
    $invitation->update(['event_date' => '2026-12-05']);
    $this->travelTo($now);

    expect($invitation->fresh()->checkInIsOpen())->toBe($isOpen);
})->with([
    'two days before' => ['2026-12-03 23:59', false],
    'the day before' => ['2026-12-04 00:00', true],
    'after midnight' => ['2026-12-06 02:00', true],
    'the next noon' => ['2026-12-06 12:01', false],
]);

it('shows the check-in screen when the door scans a pass, and the invitation to anyone else', function () {
    $invitation = invitationAtTheDoor(PlanFeature::OnlineRsvp);
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'seats' => 4, 'table_label' => '7']);
    Rsvp::factory()->forGuest($guest)->create(['attending' => true, 'seats_confirmed' => 3]);

    $this->get($guest->url())
        ->assertViewIs('app')
        ->assertInertia(fn (Assert $page) => $page->component('templates/boda-clasica/InvitationPage'));

    $guest->forceFill(['first_opened_at' => null])->save();

    $this->withCookies(doorCookie($invitation))
        ->get($guest->url())
        ->assertViewIs('admin')
        ->assertInertia(fn (Assert $page) => $page
            ->component('check-in/guest')
            ->where('guest.name', 'Familia Pérez')
            ->where('guest.table_label', '7')
            ->where('guest.rsvp', ['attending' => true, 'seats_confirmed' => 3])
            ->where('guest.check_in_url', route('invitations.check-in.store', [$invitation, $guest])));

    expect($guest->fresh()->first_opened_at)->toBeNull();
});

it('keeps the door in the same app when it opens a pass from the door page', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create();
    // The door pages share the landing page's root view, and so its asset version
    $doorVersion = $this->get(route('landing'))->viewData('page')['version'];

    // Without door access the link is the guest's invitation, from the public site
    $this->get($guest->url(), ['X-Inertia' => 'true', 'X-Inertia-Version' => $doorVersion])
        ->assertStatus(409);

    $this->withCookies(doorCookie($invitation))
        ->get($guest->url(), ['X-Inertia' => 'true', 'X-Inertia-Version' => $doorVersion])
        ->assertOk()
        ->assertJsonPath('component', 'check-in/guest');
});

it('tells the door when a scanned code is not a pass of the invitation', function () {
    $invitation = invitationAtTheDoor();

    $this->withCookies(doorCookie($invitation))
        ->get(route('invitations.guest', [$invitation, 'desconocido123']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('check-in/guest')
            ->where('guest', null));
});

it('revokes the door access of the previous link when a new one is made', function () {
    $invitation = invitationAtTheDoor();
    $oldCookie = doorCookie($invitation);

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.door-link', $invitation))
        ->assertRedirect(route('admin.invitations.guests.index', $invitation));

    auth()->logout();

    expect($invitation->fresh()->door_token)->not->toBe($oldCookie["convite_door_{$invitation->id}"]);

    $this->withCookies($oldCookie)->get(route('invitations.door.show', $invitation))->assertNotFound();
});

it('checks a guest in and corrects the number when the rest of the group arrives', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create(['seats' => 4]);
    $this->freezeSecond();

    $this->withCookies(doorCookie($invitation))
        ->from($guest->url())
        ->post(route('invitations.check-in.store', [$invitation, $guest]), ['seats' => 2])
        ->assertRedirect($guest->url());

    $arrivedAt = $guest->fresh()->checked_in_at;
    expect($arrivedAt->equalTo(now()))->toBeTrue()
        ->and($guest->fresh()->checked_in_seats)->toBe(2);

    $this->travel(30)->minutes();

    $this->withCookies(doorCookie($invitation))
        ->post(route('invitations.check-in.store', [$invitation, $guest]), ['seats' => 4]);

    expect($guest->fresh())
        ->checked_in_seats->toBe(4)
        ->checked_in_at->equalTo($arrivedAt)->toBeTrue();
});

it('does not check in more people than the pass has', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create(['seats' => 2]);

    $this->withCookies(doorCookie($invitation))
        ->post(route('invitations.check-in.store', [$invitation, $guest]), ['seats' => 3])
        ->assertSessionHasErrors('seats');

    expect($guest->fresh()->checked_in_at)->toBeNull();
});

it('undoes a check-in made by mistake', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create(['seats' => 2]);
    $guest->forceFill(['checked_in_at' => now(), 'checked_in_seats' => 2])->save();

    $this->withCookies(doorCookie($invitation))
        ->delete(route('invitations.check-in.destroy', [$invitation, $guest]));

    expect($guest->fresh())->checked_in_at->toBeNull()->checked_in_seats->toBe(0);
});

it('does not check guests in without door access', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create();

    $this->post(route('invitations.check-in.store', [$invitation, $guest]), ['seats' => 1])->assertNotFound();

    expect($guest->fresh()->checked_in_at)->toBeNull();
});

it('lets the panel mark arrivals while check-in is open', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create(['seats' => 3]);
    $client = User::factory()->client($invitation->client)->create();

    $this->actingAs($client)
        ->post(route('admin.invitations.guests.check-in.store', [$invitation, $guest]), ['seats' => 3])
        ->assertRedirect(route('admin.invitations.guests.index', $invitation));

    expect($guest->fresh()->checked_in_seats)->toBe(3);

    $invitation->update(['event_date' => today()->addDays(5)]);

    $this->actingAs($client)
        ->delete(route('admin.invitations.guests.check-in.destroy', [$invitation, $guest]))
        ->assertSessionHasErrors(['seats' => 'El registro de llegadas está cerrado.']);
});

it('does not let a client check in or make the door link of another client', function () {
    $invitation = invitationAtTheDoor();
    $guest = Guest::factory()->for($invitation)->create();
    $otherClient = User::factory()->client()->create();

    $this->actingAs($otherClient)
        ->post(route('admin.invitations.guests.check-in.store', [$invitation, $guest]), ['seats' => 1])
        ->assertForbidden();
    $this->actingAs($otherClient)
        ->post(route('admin.invitations.door-link', $invitation))
        ->assertForbidden();
});

it('shows the door link and the arrivals on the guest list only when the plan includes check-in', function () {
    $invitation = invitationAtTheDoor();
    $withoutCheckIn = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.invitations.guests.index', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->where('check_in.door_url', route('invitations.door.enter', [$invitation, $invitation->door_token]))
            ->where('check_in.is_open', true));

    $this->actingAs($admin)
        ->get(route('admin.invitations.guests.index', $withoutCheckIn))
        ->assertInertia(fn (Assert $page) => $page->where('check_in', null));
});

it('requires the guest list to include check-in in a plan', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.plans.store'), [
            'name' => 'Puerta',
            'slug' => 'puerta',
            'price' => '1000',
            'features' => ['check_in'],
            'sort_order' => '0',
        ])
        ->assertSessionHasErrors(['features' => 'El registro de llegadas requiere la lista de invitados.']);
});

it('revokes the door link when the guest data is purged', function () {
    config(['convite.guest_retention_days' => 30]);
    $invitation = invitationAtTheDoor();
    $invitation->update(['event_date' => today()->subDays(31)]);

    $this->artisan('guests:purge')->assertSuccessful();

    expect($invitation->fresh()->door_token)->toBeNull();
});
