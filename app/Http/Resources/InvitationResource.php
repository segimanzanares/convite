<?php

namespace App\Http\Resources;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Invitation
 */
class InvitationResource extends JsonResource
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
            'slug' => $this->slug,
            'url' => route('invitations.show', $this->resource),
            'template' => $this->template,
            'template_label' => Invitation::templates()[$this->template]['label'] ?? $this->template,
            'kind' => $this->kind(),
            'client_id' => $this->client_id,
            'order_id' => $this->order_id,
            'event_date' => $this->event_date?->toDateString(),
            'event_time' => $this->event_time ? substr($this->event_time, 0, 5) : null,
            'rsvp_deadline' => $this->rsvp_deadline?->toDateString(),
            'status' => $this->status,
            'title' => $this->title,
            'description' => $this->description,
            'og_image' => $this->og_image,
            'guests_purged_at' => $this->guests_purged_at,
            'features' => $this->whenLoaded('order', fn () => $this->order?->plan_snapshot['features'] ?? []),
            'max_guests' => $this->whenLoaded('order', fn () => $this->guestLimit()),
            'guest_passes_url' => $this->whenLoaded('order', fn () => $this->offersPage(Invitation::GUEST_PASSES_PAGE)
                ? route('invitations.guest-passes', $this->resource)
                : null),
            'client' => ClientResource::make($this->whenLoaded('client')),
        ];
    }
}
