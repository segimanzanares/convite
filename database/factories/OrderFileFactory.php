<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderFile>
 */
class OrderFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'name' => 'pases.pdf',
            'path' => fn (array $attributes) => "orders/{$attributes['order_id']}/".fake()->uuid().'.pdf',
            'size' => 2048,
            'mime_type' => 'application/pdf',
        ];
    }
}
