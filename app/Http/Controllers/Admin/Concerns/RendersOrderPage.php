<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Enums\PaymentMethod;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The order page shows its payments and balance. Its forms open in modals whose state comes from the URL, so several
 * controllers render it.
 */
trait RendersOrderPage
{
    /**
     * @param  'edit'|'payment'|null  $modal
     */
    protected function renderOrderPage(Order $order, ?string $modal = null): Response
    {
        return Inertia::render('orders/show', [
            'order' => OrderResource::make(app(OrderService::class)->loadDetails($order)),
            'paymentMethods' => array_column(PaymentMethod::cases(), 'value'),
            'modal' => $modal,
        ]);
    }
}
