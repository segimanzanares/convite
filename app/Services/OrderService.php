<?php

namespace App\Services;

use App\Enums\InvitationKind;
use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use App\Enums\PlanType;
use App\Models\Client;
use App\Models\Order;
use App\Models\Partner;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(private readonly InvitationService $invitations) {}

    /**
     * Sell a plan to a client. The order keeps a copy of the plan's type, limits and features, so later changes to the
     * plan do not affect it. A video invitation's order gets its invitation right away, for the event the form names.
     *
     * @param  array{plan_id: int|string, price: string|float, status?: string|null, notes?: string|null, source?: string|null, referral_code?: string|null, partner_id?: int|string|null, event_kind?: string|null, event_date?: string|null, event_time?: string|null}  $data
     */
    public function create(Client $client, array $data): Order
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $event = array_intersect_key($data, array_flip(['event_kind', 'event_date', 'event_time']));
        $data = array_diff_key($data, $event);

        return DB::transaction(function () use ($client, $plan, $data, $event): Order {
            $order = $client->orders()->create([
                ...$this->withPartner($this->withReferrer($data)),
                'plan_snapshot' => $plan->snapshot(),
                'status' => $data['status'] ?? OrderStatus::Quoted,
            ]);

            if ($plan->type === PlanType::VideoInvitation) {
                $this->invitations->createForVideoOrder(
                    $order,
                    InvitationKind::from($event['event_kind']),
                    $event['event_date'] ?? null,
                    $event['event_time'] ?? null,
                );
            }

            return $order;
        });
    }

    /**
     * Update the price, status, notes or source of an order. Its plan and snapshot never change.
     *
     * @param  array{price: string|float, status: string, notes?: string|null, source?: string|null, referral_code?: string|null, partner_id?: int|string|null}  $data
     */
    public function update(Order $order, array $data): Order
    {
        $order->update($this->withPartner($this->withReferrer($data), $order));

        return $order;
    }

    /**
     * Swap the referral code typed in the form for the client it belongs to. Only referrals keep a referrer.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withReferrer(array $data): array
    {
        $code = $data['referral_code'] ?? null;
        unset($data['referral_code']);

        if (! array_key_exists('source', $data)) {
            return $data;
        }

        $isReferral = $data['source'] === OrderSource::Referral->value;

        return [
            ...$data,
            'referrer_client_id' => $isReferral ? Client::findByReferralCode($code)?->id : null,
        ];
    }

    /**
     * Only orders from a partner keep one. Assigning a partner, or another one, copies their current commission percent
     * to the order; keeping the same partner keeps the percent and payment it already had.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withPartner(array $data, ?Order $order = null): array
    {
        if (! array_key_exists('source', $data)) {
            unset($data['partner_id']);

            return $data;
        }

        $partnerId = $data['source'] === OrderSource::Partner->value && filled($data['partner_id'] ?? null)
            ? (int) $data['partner_id']
            : null;

        if ($partnerId !== null && $partnerId === $order?->partner_id) {
            return [...$data, 'partner_id' => $partnerId];
        }

        return [
            ...$data,
            'partner_id' => $partnerId,
            'commission_percent' => $partnerId === null ? null : Partner::findOrFail($partnerId)->commission_percent,
            'commission_paid_at' => null,
        ];
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
     * Load what the order page shows: the client, who referred them or the partner who brought them, the payments and
     * the invitations.
     */
    public function loadDetails(Order $order): Order
    {
        return $order
            ->load(['client', 'referrer', 'partner', 'invitations.order', 'payments' => fn ($query) => $query->latest('paid_at')->latest('id')])
            ->loadSum('payments', 'amount');
    }
}
