<?php

namespace App\Http\Resources;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Plan
 */
class PlanResource extends JsonResource
{
    /**
     * Transform the resource into an array. Its admin fields are left out on the public landing page.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAdmin = (bool) $request->user()?->isAdmin();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->price,
            'description' => $this->description,
            'max_guests' => $this->max_guests,
            'max_seats_per_guest' => $this->max_seats_per_guest,
            'features' => $this->features,
            'is_active' => $this->when($isAdmin, $this->is_active),
            'sort_order' => $this->when($isAdmin, $this->sort_order),
            'orders_count' => $this->whenCounted('orders'),
        ];
    }
}
