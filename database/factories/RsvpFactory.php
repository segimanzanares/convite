<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Rsvp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rsvp>
 */
class RsvpFactory extends Factory
{
    /**
     * Define the model's default state: an attending answer through the open form.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invitation_id' => Invitation::factory(),
            'guest_id' => null,
            'name' => fake()->name(),
            'attending' => true,
            'seats_confirmed' => fake()->numberBetween(1, 4),
            'message' => null,
            'responded_at' => now(),
        ];
    }

    /**
     * Indicate that the answer came through the given guest's personalized link.
     */
    public function forGuest(Guest $guest): static
    {
        return $this->state(fn (array $attributes) => [
            'invitation_id' => $guest->invitation_id,
            'guest_id' => $guest->id,
            'name' => $guest->name,
            'seats_confirmed' => $guest->seats,
        ]);
    }

    /**
     * Indicate that the guest will not attend.
     */
    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'attending' => false,
            'seats_confirmed' => 0,
        ]);
    }
}
