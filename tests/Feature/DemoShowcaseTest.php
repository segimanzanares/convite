<?php

use App\Enums\PlanFeature;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Rsvp;
use App\Models\Wish;
use Inertia\Testing\AssertableInertia as Assert;

it('shows the online RSVP and the wishes book of the plan a demo is asked to show', function () {
    Plan::factory()->withFeatures(PlanFeature::OnlineRsvp, PlanFeature::Wishes)->create(['slug' => 'premium']);
    $demo = Invitation::factory()->create();

    $this->get(route('invitations.show', ['invitation' => $demo, 'plan' => 'premium']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('rsvp.online', true)
            ->where('rsvp.open', true)
            ->where('rsvp.demo', true)
            ->where('wishes.open', true)
            ->where('wishes.public', true)
            ->where('wishes.demo', true)
            ->has('wishes.wishes', 3)
        );
});

it('shows only what the plan includes', function () {
    Plan::factory()->withFeatures(PlanFeature::PrintCard)->create(['slug' => 'estandar']);
    $demo = Invitation::factory()->create();

    $this->get(route('invitations.show', ['invitation' => $demo, 'plan' => 'estandar']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('rsvp.online', false)
            ->missing('rsvp.demo')
            ->where('wishes', null)
        );
});

it('ignores the plan unless it is active and the invitation is a demo', function (Closure $makeInvitation, string $slug) {
    Plan::factory()->withFeatures(PlanFeature::OnlineRsvp, PlanFeature::Wishes)->create(['slug' => 'premium']);
    Plan::factory()->withFeatures(PlanFeature::OnlineRsvp, PlanFeature::Wishes)->inactive()->create(['slug' => 'retirado']);

    $this->get(route('invitations.show', ['invitation' => $makeInvitation(), 'plan' => $slug]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('rsvp.online', false)
            ->missing('rsvp.demo')
            ->where('wishes', null)
        );
})->with([
    'unknown plan' => [fn () => Invitation::factory()->create(), 'platino'],
    'inactive plan' => [fn () => Invitation::factory()->create(), 'retirado'],
    'client invitation' => [fn () => Invitation::factory()->forOrder(Order::factory()->create())->create(), 'premium'],
]);

it('stores nothing a visitor sends from a demo showing a plan', function () {
    Plan::factory()->withFeatures(PlanFeature::OnlineRsvp, PlanFeature::Wishes)->create(['slug' => 'premium']);
    $demo = Invitation::factory()->create(['event_date' => today()->addDays(14)]);

    $this->postJson(route('invitations.rsvp.store', ['invitation' => $demo, 'plan' => 'premium']), [
        'name' => 'Tía Rosa',
        'attending' => true,
        'seats' => 2,
    ])->assertNotFound();

    $this->postJson(route('invitations.wishes.store', ['invitation' => $demo, 'plan' => 'premium']), [
        'author_name' => 'Tía Rosa',
        'message' => '¡Muchas felicidades!',
    ])->assertNotFound();

    expect(Rsvp::count())->toBe(0)
        ->and(Wish::count())->toBe(0);
});
