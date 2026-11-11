<?php

namespace App\Http\Resources;

use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A guest as the panel shows it, with their personalized link.
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
            'sent_at' => $this->sent_at,
            'first_opened_at' => $this->first_opened_at,
            'rsvp' => RsvpResource::make($this->whenLoaded('rsvp')),
        ];
    }
}
