<?php

use App\Models\Invitation;
use App\Models\Order;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function genderReveal(array $content = ['names' => ['Ana', 'Luis'], 'reveal' => 'boy']): Invitation
{
    return Invitation::factory()->forOrder(Order::factory()->create())->create([
        'template' => 'revelacion-dulce',
        'content' => $content,
    ]);
}

it('lets the client show the result at the moment of the reveal, and hide it again', function () {
    $this->travelTo('2027-03-20 18:30:00');
    $invitation = genderReveal();
    $clientUser = User::factory()->client($invitation->client)->create();

    $this->actingAs($clientUser)
        ->from(route('admin.invitations.mine'))
        ->put(route('admin.invitations.reveal.update', $invitation), ['shown' => true])
        ->assertRedirect(route('admin.invitations.mine'))
        ->assertSessionHasNoErrors();

    expect($invitation->fresh()->reveal_shown_at->toDateTimeString())->toBe('2027-03-20 18:30:00');

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('invitation.reveal', 'boy'));

    $this->actingAs($clientUser)
        ->put(route('admin.invitations.reveal.update', $invitation), ['shown' => false])
        ->assertSessionHasNoErrors();

    expect($invitation->fresh()->reveal_shown_at)->toBeNull();
});

it('does not show a result that was not captured', function () {
    $invitation = genderReveal(['names' => ['Ana']]);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.reveal.update', $invitation), ['shown' => true])
        ->assertSessionHasErrors('shown');

    expect($invitation->fresh()->reveal_shown_at)->toBeNull();
});

it("only lets the invitation's own client show its result", function () {
    $invitation = genderReveal();

    $this->actingAs(User::factory()->client()->create())
        ->put(route('admin.invitations.reveal.update', $invitation), ['shown' => true])
        ->assertForbidden();
});

it('has no result to show for other kinds of events', function () {
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.reveal.update', $invitation), ['shown' => true])
        ->assertNotFound();
});

it('never sends the result to the panel, only whether it was captured', function () {
    $invitation = genderReveal();
    $clientUser = User::factory()->client($invitation->client)->create();

    $this->actingAs($clientUser)
        ->get(route('admin.invitations.mine'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitations.0.reveal', ['captured' => true, 'shown_at' => null]));
});
