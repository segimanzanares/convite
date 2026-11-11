<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\RendersOrderPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    use RendersOrderPage;

    public function __construct(private readonly PaymentService $payments) {}

    /**
     * Display the order page with the form to register a payment open in a modal.
     */
    public function create(Order $order): Response
    {
        Gate::authorize('create', Payment::class);

        return $this->renderOrderPage($order, 'payment');
    }

    public function store(StorePaymentRequest $request, Order $order): RedirectResponse
    {
        $this->payments->register($order, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment registered.')]);

        return to_route('admin.orders.show', $order);
    }

    /**
     * Remove a payment, e.g. one registered by mistake.
     */
    public function destroy(Payment $payment): RedirectResponse
    {
        Gate::authorize('delete', $payment);

        $this->payments->delete($payment);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment deleted.')]);

        return to_route('admin.orders.show', $payment->order_id);
    }
}
