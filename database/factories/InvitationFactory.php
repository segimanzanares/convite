<?php

namespace Database\Factories;

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\Order;
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

    /**
     * Indicate that the invitation was sold through the given order, so it belongs to the order's client.
     */
    public function forOrder(Order $order): static
    {
        return $this->state(fn (array $attributes) => [
            'order_id' => $order->id,
            'client_id' => $order->client_id,
        ]);
    }

    /**
     * Indicate that the wedding content was captured (the default "demo" template is a wedding).
     *
     * @param  array<string, mixed>  $content
     */
    public function withContent(array $content = []): static
    {
        return $this->state(fn (array $attributes) => [
            'event_date' => '2027-03-20',
            'event_time' => '17:00:00',
            'content' => [
                'names' => ['Ana', 'Luis'],
                'families' => 'Familia Pérez & Familia López',
                'rsvp_whatsapp' => '5512345678',
                ...$content,
            ],
        ]);
    }

    /**
     * Indicate that the invitation is a draft, only shown to its panel users.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => ['status' => InvitationStatus::Draft]);
    }

    /**
     * Indicate that the invitation was archived, so its guests can no longer open it.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => ['status' => InvitationStatus::Archived]);
    }
}
