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

it('links the bar of a demo to the printable pages its template has and the plan includes', function () {
    Plan::factory()->withFeatures(PlanFeature::PrintCard, PlanFeature::GuestPasses)->create(['slug' => 'estandar']);
    Plan::factory()->create(['slug' => 'basico']);
    $withPages = Invitation::factory()->create(['template' => 'boda-clasica']);
    $withoutPages = Invitation::factory()->create(['template' => 'xv-aurora']);

    $this->get(route('invitations.show', ['invitation' => $withPages, 'plan' => 'estandar']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('showcase.print_card_url', route('invitations.print-card', $withPages))
            ->where('showcase.guest_passes_url', route('invitations.guest-passes', $withPages))
        );

    $this->get(route('invitations.show', ['invitation' => $withPages, 'plan' => 'basico']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('showcase.print_card_url', null)
            ->where('showcase.guest_passes_url', null)
        );

    $this->get(route('invitations.show', ['invitation' => $withoutPages, 'plan' => 'estandar']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('showcase.print_card_url', null)
            ->where('showcase.guest_passes_url', null)
        );
});

it('links the bar of a demo to the door and the live gallery when the plan includes them', function () {
    Plan::factory()->withFeatures(PlanFeature::OnlineRsvp, PlanFeature::Wishes)->create(['slug' => 'premium', 'name' => 'Premium']);
    Plan::factory()->withFeatures(PlanFeature::GuestManagement, PlanFeature::CheckIn, PlanFeature::LiveGallery)->create(['slug' => 'exclusivo', 'name' => 'Exclusivo']);
    $demo = Invitation::factory()->create();

    $this->get(route('invitations.show', ['invitation' => $demo, 'plan' => 'exclusivo']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('showcase.plan', 'Exclusivo')
            ->where('showcase.door_url', route('invitations.demo.door', $demo))
            ->where('showcase.gallery_url', route('invitations.demo.gallery', $demo))
            ->where('showcase.wall_url', route('invitations.demo.wall', $demo))
        );

    $this->get(route('invitations.show', ['invitation' => $demo, 'plan' => 'premium']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('showcase.plan', 'Premium')
            ->where('showcase.door_url', null)
            ->where('showcase.gallery_url', null)
        );

    $this->get(route('invitations.show', $demo))
        ->assertInertia(fn (Assert $page) => $page->where('showcase', null));
});

it('opens the demo door with sample guests', function () {
    $demo = Invitation::factory()->create();

    $this->get(route('invitations.demo.door', $demo))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('check-in/door')
            ->where('door.is_open', true)
            ->where('door.demo', true)
            ->where('door.summary.guests', 16)
            ->has('guests', 16)
        );
});

it('shows the photos of the demo gallery on its upload page and wall', function (string $route, string $component) {
    $demo = Invitation::factory()->withContent([
        'gallery' => [['image' => '/invitations/boda-clasica/images/01.jpeg'], ['image' => '/invitations/boda-clasica/images/03.jpeg']],
    ])->create();

    $this->get(route($route, $demo))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component($component)
            ->where('gallery.is_open', true)
            ->where('gallery.demo', true)
            ->where('gallery.upload_url', route('invitations.demo.gallery', $demo))
            ->where('photos.0.url', '/invitations/boda-clasica/images/01.jpeg')
            ->has('photos', 2)
        );
})->with([
    'upload page' => ['invitations.demo.gallery', 'live-gallery/upload'],
    'wall' => ['invitations.demo.wall', 'live-gallery/wall'],
]);

it('has no demo door or gallery for a client invitation', function (string $route) {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create();

    $this->get(route($route, $invitation))->assertNotFound();
})->with(['invitations.demo.door', 'invitations.demo.gallery', 'invitations.demo.wall']);
