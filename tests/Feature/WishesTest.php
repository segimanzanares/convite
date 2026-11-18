<?php

use App\Enums\PlanFeature;
use App\Enums\WishStatus;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use App\Models\Wish;
use App\Services\WishService;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * A published invitation whose plan includes the wishes book, turned on, with the event in two weeks.
 */
function invitationWithWishes(array $attributes = []): Invitation
{
    return Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::Wishes, PlanFeature::GuestManagement))->create())
        ->create(['event_date' => today()->addDays(14), 'wishes_enabled' => true, ...$attributes]);
}

function sendWish(Invitation $invitation, array $data = []): TestResponse
{
    return test()->postJson(route('invitations.wishes.store', $invitation), [
        'author_name' => 'Tía Rosa',
        'message' => '¡Muchas felicidades!',
        ...$data,
    ]);
}

it('stores a message and shows it on the invitation when the messages are public', function () {
    $invitation = invitationWithWishes(['wishes_public' => true]);

    sendWish($invitation, ['author_name' => '  Tía Rosa ', 'message' => " Que sean muy felices \n"])
        ->assertCreated()
        ->assertJsonPath('status', 'approved')
        ->assertJsonPath('author_name', 'Tía Rosa');

    expect(Wish::sole())
        ->invitation_id->toBe($invitation->id)
        ->message->toBe('Que sean muy felices')
        ->status->toBe(WishStatus::Approved);

    $this->get(route('invitations.show', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->where('wishes.open', true)
            ->where('wishes.public', true)
            ->has('wishes.wishes', 1)
            ->where('wishes.wishes.0.author_name', 'Tía Rosa')
            ->missing('wishes.wishes.0.status'));
});

it('keeps the messages off the invitation unless they are public', function () {
    $invitation = invitationWithWishes();
    Wish::factory()->for($invitation)->create();

    $this->get(route('invitations.show', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->where('wishes.public', false)
            ->has('wishes.wishes', 0));
});

it('shows only approved messages on the invitation', function () {
    $invitation = invitationWithWishes(['wishes_public' => true, 'wishes_moderated' => true]);

    sendWish($invitation)->assertCreated()->assertJsonPath('status', 'pending');
    Wish::factory()->for($invitation)->hidden()->create();

    expect(Wish::first()->status)->toBe(WishStatus::Pending);
    $this->get(route('invitations.show', $invitation))
        ->assertInertia(fn (Assert $page) => $page->has('wishes.wishes', 0));
});

it('ties a message from a personalized link to its guest', function () {
    $invitation = invitationWithWishes();
    $guest = Guest::factory()->for($invitation)->create();

    sendWish($invitation, ['token' => $guest->token])->assertCreated();

    expect(Wish::sole()->guest_id)->toBe($guest->id);
});

it('offers no wishes book unless the plan includes it and it is turned on', function (Closure $makeInvitation) {
    $invitation = $makeInvitation();

    $this->get(route('invitations.show', $invitation))
        ->assertInertia(fn (Assert $page) => $page->where('wishes', null));
    sendWish($invitation)->assertNotFound();
    expect(Wish::count())->toBe(0);
})->with([
    'turned off' => [fn () => invitationWithWishes(['wishes_enabled' => false])],
    'plan without it' => [fn () => Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create(['wishes_enabled' => true])],
    'demo without an order' => [fn () => Invitation::factory()->create(['wishes_enabled' => true])],
]);

it('takes messages until the end of the days after the event', function (string $now, bool $isOpen) {
    config(['convite.wishes_days_after_event' => 7]);
    $invitation = invitationWithWishes(['event_date' => '2026-12-05']);
    $this->travelTo($now);

    expect($invitation->fresh()->acceptsWishes())->toBe($isOpen);
})->with([
    'before the event' => ['2026-11-20 10:00', true],
    'the last day' => ['2026-12-12 23:59', true],
    'the day after' => ['2026-12-13 00:00', false],
]);

it('takes no messages once closed, full or in a preview', function (Closure $makeInvitation, string $error) {
    $invitation = $makeInvitation();

    sendWish($invitation)->assertJsonValidationErrors(['wish' => $error]);
    expect(Wish::where('author_name', 'Tía Rosa')->count())->toBe(0);
})->with([
    'closed' => [fn () => invitationWithWishes(['event_date' => today()->subDays(30)]), 'El libro de buenos deseos ya no recibe mensajes.'],
    'full' => [function () {
        config(['convite.wishes_max_messages' => 1]);
        $invitation = invitationWithWishes();
        Wish::factory()->for($invitation)->create();

        return $invitation;
    }, 'El libro de buenos deseos ya está lleno.'],
    'preview of a draft' => [function () {
        test()->actingAs(User::factory()->create());

        return invitationWithWishes(['status' => 'draft']);
    }, 'El libro de buenos deseos ya no recibe mensajes.'],
]);

it('requires a name and a message and rejects bots', function () {
    $invitation = invitationWithWishes();

    sendWish($invitation, ['author_name' => '', 'message' => str_repeat('a', 501)])
        ->assertJsonValidationErrors(['author_name', 'message']);
    sendWish($invitation, ['website' => 'https://spam.example'])->assertJsonValidationErrorFor('website');
    expect(Wish::count())->toBe(0);
});

it('lets the client set up the book', function () {
    $invitation = invitationWithWishes(['wishes_enabled' => false]);

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->put(route('admin.invitations.wishes.settings', $invitation), ['enabled' => true, 'public' => true, 'moderated' => true])
        ->assertRedirect(route('admin.invitations.wishes.index', $invitation));

    expect($invitation->fresh())
        ->wishes_enabled->toBeTrue()
        ->wishes_public->toBeTrue()
        ->wishes_moderated->toBeTrue();
});

it('lets the client hide, approve and delete messages', function () {
    $invitation = invitationWithWishes();
    $wish = Wish::factory()->for($invitation)->pending()->create();
    $client = User::factory()->client($invitation->client)->create();

    $this->actingAs($client)
        ->patch(route('admin.invitations.wishes.update', [$invitation, $wish]), ['status' => 'approved'])
        ->assertRedirect(route('admin.invitations.wishes.index', $invitation));
    expect($wish->fresh()->status)->toBe(WishStatus::Approved);

    $this->actingAs($client)
        ->patch(route('admin.invitations.wishes.update', [$invitation, $wish]), ['status' => 'pending'])
        ->assertSessionHasErrors('status');

    $this->actingAs($client)->delete(route('admin.invitations.wishes.destroy', [$invitation, $wish]));
    $this->assertModelMissing($wish);
});

it('does not let a client manage the book of another client', function () {
    $invitation = invitationWithWishes();
    $wish = Wish::factory()->for($invitation)->create();
    $otherClient = User::factory()->client()->create();

    $this->actingAs($otherClient)->get(route('admin.invitations.wishes.index', $invitation))->assertForbidden();
    $this->actingAs($otherClient)->get(route('admin.invitations.wishes.download', $invitation))->assertForbidden();
    $this->actingAs($otherClient)
        ->patch(route('admin.invitations.wishes.update', [$invitation, $wish]), ['status' => 'hidden'])
        ->assertForbidden();
    expect($wish->fresh()->status)->toBe(WishStatus::Approved);
});

it('does not reach a message through another invitation', function () {
    $invitation = invitationWithWishes();
    $otherWish = Wish::factory()->for(invitationWithWishes())->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.invitations.wishes.destroy', [$invitation, $otherWish]))
        ->assertNotFound();
    $this->assertModelExists($otherWish);
});

it('shows the book in the panel only when the plan includes it', function () {
    $invitation = invitationWithWishes();
    Wish::factory()->for($invitation)->pending()->create();
    $withoutWishes = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.invitations.wishes.index', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('wishes/index')
            ->where('book.enabled', true)
            ->where('book.summary', ['total' => 1, 'pending' => 1, 'approved' => 0, 'hidden' => 0])
            ->where('wishes.0.status', 'pending'));

    $this->actingAs($admin)->get(route('admin.invitations.wishes.index', $withoutWishes))->assertNotFound();
});

it('downloads every message but the hidden ones in a PDF', function () {
    $invitation = invitationWithWishes(['title' => 'Boda de Ana y Luis']);
    Wish::factory()->for($invitation)->create(['author_name' => 'Tía Rosa']);
    Wish::factory()->for($invitation)->pending()->create(['author_name' => 'Primo Juan']);
    Wish::factory()->for($invitation)->hidden()->create(['author_name' => 'Spam']);

    $kept = app(WishService::class)->keptWishes($invitation)->pluck('author_name')->all();
    expect($kept)->toBe(['Tía Rosa', 'Primo Juan']);

    $response = $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.wishes.download', $invitation))
        ->assertOk()
        ->assertDownload("deseos-{$invitation->slug}.pdf")
        ->assertHeader('Content-Type', 'application/pdf');

    expect($response->getContent())->toStartWith('%PDF');
});

it('deletes the messages when the guest data is purged', function () {
    config(['convite.guest_retention_days' => 30]);
    $invitation = invitationWithWishes(['event_date' => today()->subDays(31)]);
    $wish = Wish::factory()->for($invitation)->create();

    $this->artisan('guests:purge')->assertSuccessful();

    $this->assertModelMissing($wish);
    expect($invitation->fresh()->offersWishes())->toBeFalse();
});
