<?php

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Rsvp;
use App\Models\User;
use App\Notifications\RsvpDigest;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Notification;

function invitationWithOnlineRsvps(): Invitation
{
    return Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create(['title' => 'Ana & Luis — Nuestra Boda']);
}

it('emails the client users the answers their invitation got the day before', function () {
    $this->travelTo('2026-11-11 08:00');
    $invitation = invitationWithOnlineRsvps();
    Rsvp::factory()->for($invitation)->create(['responded_at' => '2026-11-10 21:30']);
    $subscribed = User::factory()->client($invitation->client)->create();
    $optedOut = User::factory()->client($invitation->client)->create(['receives_rsvp_digest' => false]);
    $unverified = User::factory()->client($invitation->client)->unverified()->create();
    $otherClient = User::factory()->client()->create();
    $admin = User::factory()->create();
    Notification::fake();

    $this->artisan('rsvps:digest')
        ->expectsOutputToContain('Resúmenes enviados: 1')
        ->assertSuccessful();

    Notification::assertSentTo($subscribed, RsvpDigest::class, fn (RsvpDigest $digest) => $digest->invitation->is($invitation)
        && $digest->day->toDateString() === '2026-11-10');
    Notification::assertNotSentTo([$optedOut, $unverified, $otherClient, $admin], RsvpDigest::class);
});

it('does not email anyone when no one answered the day before', function () {
    $this->travelTo('2026-11-11 08:00');
    $invitation = invitationWithOnlineRsvps();
    Rsvp::factory()->for($invitation)->create(['responded_at' => '2026-11-09 23:59']);
    Rsvp::factory()->for($invitation)->create(['responded_at' => '2026-11-11 00:00']);
    User::factory()->client($invitation->client)->create();
    Notification::fake();

    $this->artisan('rsvps:digest')
        ->expectsOutputToContain('Resúmenes enviados: 0')
        ->assertSuccessful();

    Notification::assertNothingSent();
});

it('lists the answers of the day with the running totals', function () {
    $invitation = invitationWithOnlineRsvps();
    $user = User::factory()->client($invitation->client)->create(['name' => 'Ana Ruiz']);
    $attending = Guest::factory()->for($invitation)->create(['seats' => 4]);
    $declined = Guest::factory()->for($invitation)->create();
    Guest::factory()->for($invitation)->create();
    Rsvp::factory()->forGuest($attending)->create(['name' => 'Familia Pérez', 'seats_confirmed' => 3, 'responded_at' => '2026-11-10 10:00']);
    Rsvp::factory()->forGuest($declined)->declined()->create(['name' => 'Carlos Gómez', 'responded_at' => '2026-11-10 12:00']);
    Rsvp::factory()->for($invitation)->create(['name' => 'Lucía', 'seats_confirmed' => 2, 'responded_at' => '2026-11-08 12:00']);

    $mail = (new RsvpDigest($invitation, CarbonImmutable::parse('2026-11-10')))->toMail($user);
    $html = (string) $mail->render();

    expect($mail->subject)->toBe('Confirmaciones del 10 de noviembre: Ana & Luis — Nuestra Boda')
        ->and($html)->toContain('¡Hola, Ana Ruiz!')
        ->toContain('respondieron 2 personas')
        ->toContain('Familia Pérez')
        ->toContain('Asistirá (3 personas)')
        ->toContain('Carlos Gómez')
        ->toContain('No asistirá')
        ->not->toContain('Lucía')
        ->toContain('2 asistirán (5 personas), 1 no asistirán y 1 están pendientes.')
        ->toContain(route('admin.invitations.rsvps.index', $invitation));
});

it('sends the summary every morning', function () {
    $this->artisan('schedule:list')->expectsOutputToContain('rsvps:digest');
});

it('lets a client user turn the daily summary off', function () {
    $user = User::factory()->client()->create();

    $this->actingAs($user)
        ->patch(route('profile.notifications.update'))
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh()->receives_rsvp_digest)->toBeFalse();
});

it('does not let admins choose the summary they never get', function () {
    $this->actingAs(User::factory()->create())
        ->patch(route('profile.notifications.update'), ['receives_rsvp_digest' => '1'])
        ->assertForbidden();
});
