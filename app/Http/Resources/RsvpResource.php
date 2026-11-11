<?php

namespace App\Http\Resources;

use App\Models\Rsvp;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Rsvp
 */
class RsvpResource extends JsonResource
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
            'guest_id' => $this->guest_id,
            'name' => $this->name,
            'attending' => $this->attending,
            'seats_confirmed' => $this->seats_confirmed,
            'message' => $this->message,
            'responded_at' => $this->responded_at,
            'invitation' => InvitationResource::make($this->whenLoaded('invitation')),
        ];
    }
}
