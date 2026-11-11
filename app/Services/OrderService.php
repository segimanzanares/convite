<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Client;
use App\Models\Order;
use App\Models\Plan;

class OrderService
{
    /**
     * Sell a plan to a client. The order keeps a copy of the plan's limits and features, so later changes to the plan
     * do not affect it.
     *
     * @param  array{plan_id: int|string, price: string|float, status?: string|null, notes?: string|null}  $data
     */
    public function create(Client $client, array $data): Order
    {
        $plan = Plan::findOrFail($data['plan_id']);

        return $client->orders()->create([
            ...$data,
            'plan_snapshot' => $plan->snapshot(),
            'status' => $data['status'] ?? OrderStatus::Quoted,
        ]);
    }

    /**
     * Update the price, status or notes of an order. Its plan and snapshot never change.
     *
     * @param  array{price: string|float, status: string, notes?: string|null}  $data
     */
    public function update(Order $order, array $data): Order
    {
        $order->update($data);

        return $order;
    }

    /**
     * Delete an order without payments, e.g. one registered by mistake. An order with payments is kept for the
     * sales history, so this returns false for it.
     */
    public function delete(Order $order): bool
    {
        if ($order->payments()->exists()) {
            return false;
        }

        return (bool) $order->delete();
    }

    /**
     * Load what the order page shows: the client, the payments and the invitations.
     */
    public function loadDetails(Order $order): Order
    {
        return $order
            ->load(['client', 'invitations', 'payments' => fn ($query) => $query->latest('paid_at')->latest('id')])
            ->loadSum('payments', 'amount');
    }
}
