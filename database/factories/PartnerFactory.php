<?php

namespace Database\Factories;

use App\Enums\PartnerKind;
use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Partner>
 */
class PartnerFactory extends Factory
{
    /**
     * Define the model's default state. The code is made from the name when the partner is created.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'kind' => PartnerKind::WeddingPlanner,
            'phone' => fake()->numerify('55########'),
            'email' => fake()->unique()->safeEmail(),
            'commission_percent' => '15.00',
            'discount_percent' => 10,
            'is_active' => true,
            'notes' => null,
        ];
    }

    /**
     * Indicate that the partner no longer takes part in the program.
     */
    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
