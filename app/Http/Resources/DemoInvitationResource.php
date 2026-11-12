<?php

namespace App\Http\Resources;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A template's demo invitation, as the landing page shows it.
 *
 * @mixin Invitation
 */
class DemoInvitationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'kind' => $this->kind(),
            'template_label' => Invitation::templates()[$this->template]['label'] ?? $this->template,
            'image' => Invitation::mediaUrl($this->og_image),
            'url' => route('invitations.show', $this->resource),
        ];
    }
}
