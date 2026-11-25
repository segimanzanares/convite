<?php

namespace App\Services;

use App\Enums\CommissionStatus;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Partner;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cookie;

/**
 * The partners ("aliados") who bring clients for a commission. A visitor who opens their link (/a/CODE, which lands on
 * ?aliado=CODE) is offered the partner's discount, and the code goes in their WhatsApp messages so the admin can
 * assign the partner on the order. The commission is owed once the order is paid in full.
 */
class PartnerService
{
    /** Remembers the code of the visitor's last partner link, so it still applies when they come back later. */
    public const string COOKIE = 'convite_partner';

    public function __construct(private readonly ReferralService $referrals) {}

    /**
     * List partners ordered by name, optionally filtered by name, code, email or phone, with what their orders
     * add up to (see summarize()).
     */
    public function paginate(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        return Partner::query()
            ->with(['orders' => fn ($query) => $query->withSum('payments', 'amount')])
            ->withCount('orders')
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('code', "%{$search}%")
                        ->orWhereLike('email', "%{$search}%")
                        ->orWhereLike('phone', "%{$search}%");
                });
            })
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * The partners the order forms offer: the active ones, plus the order's own partner if it was deactivated.
     *
     * @return Collection<int, Partner>
     */
    public function options(?Order $order = null): Collection
    {
        return Partner::query()
            ->where('is_active', true)
            ->when($order?->partner_id, fn ($query, int $partnerId) => $query->orWhere('id', $partnerId))
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'is_active']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Partner
    {
        return Partner::create($data);
    }

    /**
     * Update a partner. Orders already assigned keep the commission percent they were assigned with.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Partner $partner, array $data): Partner
    {
        $partner->update($data);

        return $partner;
    }

    /**
     * Delete a partner without orders. A partner with orders is kept for the sales and commissions history (they can
     * be deactivated instead), so this returns false for it.
     */
    public function delete(Partner $partner): bool
    {
        if ($partner->orders()->exists()) {
            return false;
        }

        return (bool) $partner->delete();
    }

    /**
     * Load what the partner page shows: their orders, newest first, with the client and the payments sum.
     */
    public function loadDetails(Partner $partner): Partner
    {
        return $partner->load(['orders' => fn ($query) => $query->with('client')->withSum('payments', 'amount')->latest('id')]);
    }

    /**
     * What the partner's orders add up to. Quotes are not sales yet, so they are left out. Expects the orders loaded
     * with their payments sum.
     *
     * @return array{sales_count: int, sales_total: string, commission_pending: string, commission_earned: string, commission_paid: string}
     */
    public function summarize(Partner $partner): array
    {
        $sales = $partner->orders->reject(fn (Order $order) => $order->status === OrderStatus::Quoted);
        $commissionsIn = fn (CommissionStatus $status): string => $this->money(
            $sales->filter(fn (Order $order) => $order->commissionStatus() === $status)->sum(fn (Order $order) => (float) $order->commissionAmount()),
        );

        return [
            'sales_count' => $sales->count(),
            'sales_total' => $this->money($sales->sum(fn (Order $order) => (float) $order->price)),
            'commission_pending' => $commissionsIn(CommissionStatus::Pending),
            'commission_earned' => $commissionsIn(CommissionStatus::Earned),
            'commission_paid' => $commissionsIn(CommissionStatus::Paid),
        ];
    }

    /**
     * Record that the partner was paid their commission on an order. Only an earned commission (the order is paid in
     * full) can be paid, so this returns false otherwise.
     */
    public function payCommission(Order $order): bool
    {
        if ($order->commissionStatus() !== CommissionStatus::Earned) {
            return false;
        }

        return $order->update(['commission_paid_at' => now()]);
    }

    /**
     * Undo payCommission(), e.g. one marked by mistake.
     */
    public function undoCommissionPayment(Order $order): void
    {
        $order->update(['commission_paid_at' => null]);
    }

    /**
     * Record that the partner was paid every commission they earned and were not paid yet, returning how many.
     */
    public function payEarnedCommissions(Partner $partner): int
    {
        $earned = $partner->orders()
            ->whereNull('commission_paid_at')
            ->withSum('payments', 'amount')
            ->get()
            ->filter(fn (Order $order) => $order->commissionStatus() === CommissionStatus::Earned);

        Order::query()->whereKey($earned->modelKeys())->update(['commission_paid_at' => now()]);

        return $earned->count();
    }

    /**
     * The partner that applies to the visitor of the landing pages: the one in the link, or else the one remembered
     * from an earlier visit. Only the latest link counts: a partner's link forgets an earlier client referral, and a
     * client's referral link forgets an earlier partner. Unknown codes and inactive partners are ignored. The page
     * only gets the code and the discount, never who the partner is.
     *
     * @return array{code: string, discount_percent: int}|null
     */
    public function landingProps(Request $request): ?array
    {
        $partner = Partner::findActiveByCode($request->query(Partner::QUERY_KEY));

        if ($partner !== null) {
            Cookie::queue(self::COOKIE, $partner->code, config('convite.partner_cookie_days') * 24 * 60);
            Cookie::expire(ReferralService::COOKIE);
        } elseif ($this->referrals->isReferralLink($request)) {
            Cookie::expire(self::COOKIE);

            return null;
        } else {
            $partner = Partner::findActiveByCode($request->cookie(self::COOKIE));
        }

        return $partner === null ? null : [
            'code' => $partner->code,
            'discount_percent' => $partner->discount_percent,
        ];
    }

    private function money(float $amount): string
    {
        return number_format($amount, 2, '.', '');
    }
}
