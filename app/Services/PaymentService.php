<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;

class PaymentService
{
    /**
     * Register a payment the client made outside the system.
     *
     * @param  array<string, mixed>  $data
     */
    public function register(Order $order, array $data): Payment
    {
        return $order->payments()->create($data);
    }

    public function delete(Payment $payment): void
    {
        $payment->delete();
    }
}
