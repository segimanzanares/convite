<?php

namespace App\Http\Resources;

use App\Models\Guest;
use App\Services\GuestDeliveryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A guest as the panel shows it, with their personalized link and a WhatsApp link to send it.
 *
 * @mixin Guest
 */
class GuestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'seats' => $this->seats,
            'phone' => $this->phone,
            'email' => $this->email,
            'table_label' => $this->table_label,
            'url' => $this->url(),
            'whatsapp_url' => app(GuestDeliveryService::class)->whatsappUrl($this->resource),
            'sent_at' => $this->sent_at,
            'first_opened_at' => $this->first_opened_at,
            'checked_in_at' => $this->checked_in_at,
            'checked_in_seats' => $this->checked_in_seats,
            'rsvp' => RsvpResource::make($this->whenLoaded('rsvp')),
        ];
    }
}
