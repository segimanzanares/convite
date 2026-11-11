<?php

use App\Enums\PlanFeature;
use App\Jobs\SendGuestInvitation;
use App\Mail\GuestInvitationMail;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use App\Services\GuestDeliveryService;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

it('links each guest to WhatsApp with the invitation message', function (?string $phone, string $whatsappNumber) {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create(['title' => 'Ana & Luis — Nuestra Boda']);
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'phone' => $phone]);

    $message = "¡Hola, Familia Pérez! Con mucho cariño te compartimos tu invitación a Ana & Luis — Nuestra Boda. Ábrela para ver los detalles y confirmar tu asistencia:\n{$guest->url()}";

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('admin.invitations.guests.index', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->where('guests.0.whatsapp_url', "https://wa.me/{$whatsappNumber}?text=".rawurlencode($message)));
})->with([
    'local number' => ['55 1234-5678', '525512345678'],
    'international number' => ['+1 (415) 555-0100', '14155550100'],
    'no phone' => [null, ''],
]);

it('records that a guest was sent their invitation through WhatsApp', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $guest = Guest::factory()->for($invitation)->create();
    $this->freezeSecond();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.guests.mark-sent', [$invitation, $guest]))
        ->assertRedirect(route('admin.invitations.guests.index', $invitation));

    expect($guest->fresh()->sent_at->equalTo(now()))->toBeTrue();
});

it('does not let a client send the guests of another client', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $guest = Guest::factory()->for($invitation)->create(['email' => 'ana@example.com']);
    Mail::fake();

    $this->actingAs(User::factory()->client()->create())
        ->post(route('admin.invitations.guests.email', [$invitation, $guest]))
        ->assertForbidden();

    Mail::assertNothingSent();
});

it('does not send invitations when the plan has no guest list', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::OnlineRsvp))->create())
        ->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.guests.email-pending', $invitation))
        ->assertNotFound();
});

it('emails a guest their invitation and marks them as sent', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $guest = Guest::factory()->for($invitation)->create(['email' => 'ana@example.com']);
    Mail::fake();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.guests.email', [$invitation, $guest]))
        ->assertRedirect(route('admin.invitations.guests.index', $invitation))
        ->assertSessionHasNoErrors();

    Mail::assertSent(GuestInvitationMail::class, fn (GuestInvitationMail $mail) => $mail->hasTo('ana@example.com') && $mail->guest->is($guest));
    expect($guest->fresh()->sent_at)->not->toBeNull();
});

it('does not email a guest without an email address', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Ana', 'email' => null]);
    Mail::fake();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.guests.email', [$invitation, $guest]))
        ->assertSessionHasErrors(['email' => 'Ana no tiene correo electrónico.']);

    Mail::assertNothingSent();
});

it('does not send an invitation that is not published', function (string $route) {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->draft()->create();
    $guest = Guest::factory()->for($invitation)->create(['email' => 'ana@example.com']);
    Mail::fake();

    $parameters = $route === 'email-pending' ? $invitation : [$invitation, $guest];

    $this->actingAs(User::factory()->create())
        ->post(route("admin.invitations.guests.{$route}", $parameters))
        ->assertSessionHasErrors(['invitation' => 'La invitación debe estar publicada antes de enviarla a los invitados.']);

    Mail::assertNothingSent();
    expect($guest->fresh()->sent_at)->toBeNull();
})->with(['email', 'email-pending', 'mark-sent']);

it('drops a queued email when the invitation stopped being published', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $guest = Guest::factory()->for($invitation)->create(['email' => 'ana@example.com']);
    Mail::fake();
    $invitation->update(['status' => 'archived']);

    (new SendGuestInvitation($guest->fresh()))->handle(app(GuestDeliveryService::class));

    Mail::assertNothingSent();
    expect($guest->fresh()->sent_at)->toBeNull();
});

it('emails only the guests with an email address who were not sent their invitation', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $pending = Guest::factory()->for($invitation)->create(['email' => 'ana@example.com']);
    Guest::factory()->for($invitation)->create(['email' => 'luis@example.com'])->forceFill(['sent_at' => now()->subDay()])->save();
    Guest::factory()->for($invitation)->create(['email' => null]);
    Mail::fake();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.guests.email-pending', $invitation))
        ->assertRedirect(route('admin.invitations.guests.index', $invitation));

    Mail::assertSentCount(1);
    Mail::assertSent(GuestInvitationMail::class, fn (GuestInvitationMail $mail) => $mail->guest->is($pending));
});

it('writes the invitation email with the personal link and replies to the client', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->withPanel()->create())
        ->create(['title' => 'Ana & Luis — Nuestra Boda', 'rsvp_deadline' => '2026-12-05']);
    $invitation->client->update(['name' => 'Ana Ruiz', 'email' => 'ana.ruiz@example.com']);
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez']);

    (new GuestInvitationMail($guest))
        ->assertHasSubject('Tu invitación: Ana & Luis — Nuestra Boda')
        ->assertHasReplyTo('ana.ruiz@example.com', 'Ana Ruiz')
        ->assertSeeInHtml($guest->url(), escape: false)
        ->assertSeeInText('¡Hola, Familia Pérez!')
        ->assertSeeInText('antes del 5 de diciembre');
});
