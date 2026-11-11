<?php

namespace Database\Factories;

use App\Enums\PlanFeature;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state: a basic plan without panel features.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'price' => fake()->randomFloat(2, 500, 5000),
            'description' => fake()->sentence(),
            'max_guests' => null,
            'features' => [],
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    /**
     * Indicate that the plan includes a guest list and online RSVPs, which give the client panel access.
     */
    public function withPanel(int $maxGuests = 100): static
    {
        return $this->state(fn (array $attributes) => [
            'max_guests' => $maxGuests,
            'features' => [PlanFeature::GuestManagement, PlanFeature::OnlineRsvp],
        ]);
    }

    /**
     * Indicate that the plan includes the given features.
     */
    public function withFeatures(PlanFeature ...$features): static
    {
        return $this->state(fn (array $attributes) => [
            'features' => $features,
        ]);
    }

    /**
     * Indicate that the plan is no longer offered.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
