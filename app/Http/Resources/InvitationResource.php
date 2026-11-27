<?php

namespace App\Http\Resources;

use App\Enums\InvitationKind;
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
            'uploads_purged_at' => $this->uploads_purged_at,
            // Never the result itself: the parents-to-be may not know it yet
            'reveal' => $this->kind() === InvitationKind::GenderReveal ? [
                'captured' => filled($this->content['reveal'] ?? null),
                'shown_at' => $this->reveal_shown_at,
            ] : null,
            'features' => $this->whenLoaded('order', fn () => $this->order?->plan_snapshot['features'] ?? []),
            // What its order sold (null for the demos); a video invitation has no page at its url
            'plan_type' => $this->whenLoaded('order', fn () => $this->order?->type()),
            'offers_web' => $this->whenLoaded('order', fn () => $this->offersWebInvitation()),
            'max_guests' => $this->whenLoaded('order', fn () => $this->guestLimit()),
            'max_seats_per_guest' => $this->whenLoaded('order', fn () => $this->seatLimit()),
            'guest_passes_url' => $this->whenLoaded('order', fn () => $this->offersPage(Invitation::GUEST_PASSES_PAGE)
                ? route('invitations.guest-passes', $this->resource)
                : null),
            'client' => ClientResource::make($this->whenLoaded('client')),
        ];
    }
}
