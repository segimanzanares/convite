<?php

namespace Database\Factories;

use App\Enums\WishStatus;
use App\Models\Invitation;
use App\Models\Wish;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Wish>
 */
class WishFactory extends Factory
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
            'guest_id' => null,
            'author_name' => fake()->name(),
            'message' => fake()->sentence(16),
            'status' => WishStatus::Approved,
        ];
    }

    /**
     * A message waiting for a panel user to approve it.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => WishStatus::Pending]);
    }

    /**
     * A message a panel user hid.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => ['status' => WishStatus::Hidden]);
    }
}
