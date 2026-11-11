<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Guest>
 */
class GuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invitation_id' => Invitation::factory(),
            'name' => 'Familia '.fake()->lastName(),
            'seats' => fake()->numberBetween(1, 5),
            'phone' => null,
            'email' => null,
            'table_label' => null,
        ];
    }
}
