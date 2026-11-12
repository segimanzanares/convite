<?php

namespace App\Http\Resources;

use App\Enums\PlanFeature;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A guest as the staff at the door sees them: their group, table, answer and how many have arrived. No contact data.
 *
 * @mixin Guest
 */
class CheckInGuestResource extends JsonResource
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
            'table_label' => $this->table_label,
            'checked_in_at' => $this->checked_in_at,
            'checked_in_seats' => $this->checked_in_seats,
            // Without online RSVPs the answers went through WhatsApp, so there is nothing to show
            'rsvp' => $this->when(
                $this->relationLoaded('rsvp') && $this->invitation->hasFeature(PlanFeature::OnlineRsvp),
                fn () => $this->rsvp ? [
                    'attending' => $this->rsvp->attending,
                    'seats_confirmed' => $this->rsvp->seats_confirmed,
                ] : null,
            ),
            'check_in_url' => route('invitations.check-in.store', [$this->invitation, $this->resource]),
        ];
    }
}
