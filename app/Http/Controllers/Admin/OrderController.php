<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\RendersClientPage;
use App\Http\Controllers\Admin\Concerns\RendersOrderPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Models\Client;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    use RendersClientPage, RendersOrderPage;

    public function __construct(private readonly OrderService $orders) {}

    /**
     * Display the client page with the form to sell a plan open in a modal.
     */
    public function create(Client $client): Response
    {
        Gate::authorize('create', Order::class);

        return $this->renderClientPage($client, 'order');
    }

    /**
     * Sell a plan to a client.
     */
    public function store(StoreOrderRequest $request, Client $client): RedirectResponse
    {
        $order = $this->orders->create($client, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order created.')]);

        return to_route('admin.orders.show', $order);
    }

    /**
     * Display an order with its payments and balance.
     */
    public function show(Order $order): Response
    {
        Gate::authorize('view', $order);

        return $this->renderOrderPage($order);
    }

    /**
     * Display the order page with the edit form open in a modal.
     */
    public function edit(Order $order): Response
    {
        Gate::authorize('update', $order);

        return $this->renderOrderPage($order, 'edit');
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $this->orders->update($order, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order updated.')]);

        return to_route('admin.orders.show', $order);
    }

    /**
     * Delete an order without payments, e.g. one registered by mistake.
     */
    public function destroy(Order $order): RedirectResponse
    {
        Gate::authorize('delete', $order);

        if (! $this->orders->delete($order)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The order has payments, so it cannot be deleted.')]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Order deleted.')]);

        return to_route('admin.clients.show', $order->client_id);
    }
}
