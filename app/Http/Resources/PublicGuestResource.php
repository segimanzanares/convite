<?php

namespace App\Http\Resources;

use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The guest a personalized link belongs to, as the public invitation page sees them: no contact data.
 *
 * @mixin Guest
 */
class PublicGuestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'seats' => $this->seats,
            'token' => $this->token,
            'rsvp' => $this->whenLoaded('rsvp', fn () => $this->rsvp ? [
                'attending' => $this->rsvp->attending,
                'seats_confirmed' => $this->rsvp->seats_confirmed,
                'message' => $this->rsvp->message,
            ] : null),
        ];
    }
}
