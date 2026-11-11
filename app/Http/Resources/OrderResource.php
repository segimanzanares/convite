<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array. The paid amount and balance are only sent when the payments sum was
     * loaded, so listings do not query the payments of each order.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hasPaymentsSum = array_key_exists('payments_sum_amount', $this->resource->getAttributes());

        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'plan_id' => $this->plan_id,
            'price' => $this->price,
            'plan' => $this->plan_snapshot,
            'grants_panel_access' => $this->grantsPanelAccess(),
            'status' => $this->status,
            'notes' => $this->notes,
            'amount_paid' => $this->when($hasPaymentsSum, fn () => $this->amountPaid()),
            'balance' => $this->when($hasPaymentsSum, fn () => $this->balance()),
            'client' => ClientResource::make($this->whenLoaded('client')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'invitations' => InvitationResource::collection($this->whenLoaded('invitations')),
            'created_at' => $this->created_at,
        ];
    }
}
