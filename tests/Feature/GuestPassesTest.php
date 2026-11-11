<?php

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function invitationWithPrintedGuestList(): Invitation
{
    $plan = Plan::factory()->withFeatures(PlanFeature::GuestManagement, PlanFeature::GuestPasses);

    return Invitation::factory()->forOrder(Order::factory()->for($plan)->create())->create();
}

it('prints the passes from the guest list with each personal link', function () {
    $invitation = invitationWithPrintedGuestList();
    $guest = Guest::factory()->for($invitation)->create(['name' => 'Familia Pérez', 'seats' => 4, 'table_label' => '3']);

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('invitations.guest-passes', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('templates/boda-clasica/GuestPassesPage')
            ->where('guests', [['name' => 'Familia Pérez', 'seats' => 4, 'table' => '3', 'url' => $guest->url()]]));
});

it('asks visitors to sign in before showing passes printed from the guest list', function () {
    $invitation = invitationWithPrintedGuestList();

    $this->get(route('invitations.guest-passes', $invitation))->assertRedirect(route('login'));
});

it('does not show the guest list passes to another client', function () {
    $invitation = invitationWithPrintedGuestList();

    $this->actingAs(User::factory()->client()->create())
        ->get(route('invitations.guest-passes', $invitation))
        ->assertForbidden();
});

it('lets anyone type the passes when the plan has no guest list', function () {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::GuestPasses))->create())
        ->create();

    $this->get(route('invitations.guest-passes', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('guests', null));
});

it('links the guest list to the passes when the plan includes them', function (array $features, bool $linksPasses) {
    $invitation = Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(...$features))->create())
        ->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.guests.index', $invitation))
        ->assertInertia(fn (Assert $page) => $page->where(
            'invitation.guest_passes_url',
            $linksPasses ? route('invitations.guest-passes', $invitation) : null,
        ));
})->with([
    'with passes' => [[PlanFeature::GuestManagement, PlanFeature::GuestPasses], true],
    'without passes' => [[PlanFeature::GuestManagement], false],
]);
