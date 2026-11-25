<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Partner;
use App\Services\PartnerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

/**
 * Records the commissions paid to partners. Convite pays them outside the system, once each order is paid in full.
 */
class PartnerCommissionController extends Controller
{
    public function __construct(private readonly PartnerService $partners) {}

    /**
     * Mark the commission of an order as paid to its partner.
     */
    public function store(Order $order): RedirectResponse
    {
        Gate::authorize('update', $this->partnerOf($order));

        Inertia::flash('toast', $this->partners->payCommission($order)
            ? ['type' => 'success', 'message' => __('Commission marked as paid.')]
            : ['type' => 'error', 'message' => __('The commission is owed once the order is paid in full.')]);

        return back();
    }

    /**
     * Undo marking the commission of an order as paid.
     */
    public function destroy(Order $order): RedirectResponse
    {
        Gate::authorize('update', $this->partnerOf($order));

        $this->partners->undoCommissionPayment($order);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Commission marked as unpaid.')]);

        return back();
    }

    /**
     * Mark every commission the partner earned and was not paid yet as paid.
     */
    public function payEarned(Partner $partner): RedirectResponse
    {
        Gate::authorize('update', $partner);

        $count = $this->partners->payEarnedCommissions($partner);

        Inertia::flash('toast', ['type' => 'success', 'message' => trans_choice('{0} No commissions were owed.|{1} :count commission marked as paid.|[2,*] :count commissions marked as paid.', $count)]);

        return back();
    }

    private function partnerOf(Order $order): Partner
    {
        abort_if($order->partner === null, 404);

        return $order->partner;
    }
}
