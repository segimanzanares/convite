<?php

namespace App\Http\Resources;

use App\Models\Partner;
use App\Services\PartnerService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Partner
 */
class PartnerResource extends JsonResource
{
    /**
     * Transform the resource into an array. What their orders add up to is only sent when the orders were loaded.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'kind' => $this->kind,
            'phone' => $this->phone,
            'email' => $this->email,
            'code' => $this->code,
            'commission_percent' => $this->commission_percent,
            'discount_percent' => $this->discount_percent,
            'is_active' => $this->is_active,
            'notes' => $this->notes,
            'link' => $this->link(),
            'orders_count' => $this->whenCounted('orders'),
            'summary' => $this->whenLoaded('orders', fn () => app(PartnerService::class)->summarize($this->resource)),
            'created_at' => $this->created_at,
        ];
    }
}
