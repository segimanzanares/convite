<?php

namespace App\Http\Resources;

use App\Models\Wish;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A message of the wishes book as the panel lists it.
 *
 * @mixin Wish
 */
class WishResource extends JsonResource
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
            'author_name' => $this->author_name,
            'message' => $this->message,
            'status' => $this->status,
            'guest_name' => $this->whenLoaded('guest', fn () => $this->guest?->name),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
