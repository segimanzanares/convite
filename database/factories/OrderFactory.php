<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Client;
use App\Models\Order;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state. The price and snapshot are copied from the plan, as OrderService does.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'plan_id' => Plan::factory(),
            'price' => fn (array $attributes) => Plan::findOrFail($attributes['plan_id'])->price,
            'plan_snapshot' => fn (array $attributes) => Plan::findOrFail($attributes['plan_id'])->snapshot(),
            'status' => OrderStatus::Active,
            'notes' => null,
        ];
    }

    /**
     * Indicate that the order is for a plan that includes panel features.
     */
    public function withPanel(int $maxGuests = 100): static
    {
        return $this->for(Plan::factory()->withPanel($maxGuests));
    }
}
