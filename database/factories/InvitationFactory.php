<?php

namespace Database\Factories;

use App\Models\Invitation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invitation>
 */
class InvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $slug = fake()->unique()->slug(2);

        return [
            'slug' => $slug,
            // An existing template, so the Inertia page resolves in tests
            'template' => 'demo',
            'title' => fake()->name().' — Nuestra Boda',
            'description' => fake()->sentence(),
            'og_image' => "/invitations/{$slug}/og-image.jpg",
        ];
    }
}
