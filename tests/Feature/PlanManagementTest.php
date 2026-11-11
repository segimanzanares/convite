<?php

use App\Enums\PlanFeature;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('lists every plan for an admin', function () {
    Plan::factory()->count(2)->create();
    Plan::factory()->inactive()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.plans.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('plans/index')
            ->has('plans', 3)
            ->where('modal', null)
            ->has('features', count(PlanFeature::cases())));
});

it('creates a plan with its features', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.plans.store'), [
            'name' => 'Estándar',
            'slug' => 'estandar',
            'price' => '2500.50',
            'max_guests' => '100',
            'features' => ['guest_management', 'online_rsvp'],
            'is_active' => '1',
            'sort_order' => '2',
        ])
        ->assertRedirect(route('admin.plans.index'))
        ->assertSessionHasNoErrors();

    $plan = Plan::sole();

    expect($plan->name)->toBe('Estándar')
        ->and($plan->price)->toBe('2500.50')
        ->and($plan->max_guests)->toBe(100)
        ->and($plan->features->all())->toBe([PlanFeature::GuestManagement, PlanFeature::OnlineRsvp])
        ->and($plan->is_active)->toBeTrue();
});

it('saves a plan without features and inactive when its checkboxes are unchecked', function () {
    $plan = Plan::factory()->withPanel()->create();

    $this->actingAs(User::factory()->create())
        ->put(route('admin.plans.update', $plan), [
            'name' => $plan->name,
            'slug' => $plan->slug,
            'price' => '900',
            'sort_order' => '0',
        ])
        ->assertSessionHasNoErrors();

    expect($plan->fresh()->features)->toBeEmpty()
        ->and($plan->fresh()->is_active)->toBeFalse();
});

it('rejects an unknown feature and a slug already in use', function () {
    Plan::factory()->create(['slug' => 'premium']);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.plans.store'), [
            'name' => 'Premium',
            'slug' => 'premium',
            'price' => '3500',
            'features' => ['confeti'],
            'sort_order' => '0',
        ])
        ->assertSessionHasErrors([
            'slug' => 'El valor de identificador ya está en uso.',
            'features.0' => 'El valor seleccionado en función no es válido.',
        ]);
});

it('deletes a plan that was never sold', function () {
    $plan = Plan::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.plans.destroy', $plan))
        ->assertRedirect(route('admin.plans.index'));

    $this->assertModelMissing($plan);
});

it('keeps a plan that has orders', function () {
    $order = Order::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.plans.destroy', $order->plan))
        ->assertRedirect(route('admin.plans.index'))
        ->assertInertiaFlash('toast.type', 'error');

    $this->assertModelExists($order->plan);
});

it('sends only the active plans to the landing page, in their order', function () {
    Plan::factory()->create(['name' => 'Premium', 'sort_order' => 3]);
    Plan::factory()->create(['name' => 'Básico', 'sort_order' => 1]);
    Plan::factory()->inactive()->create(['name' => 'Retirado', 'sort_order' => 2]);

    $this->get(route('landing'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pages/landing/LandingPage')
            ->has('plans', 2)
            ->where('plans.0.name', 'Básico')
            ->where('plans.1.name', 'Premium')
            ->missing('plans.0.is_active'));
});
