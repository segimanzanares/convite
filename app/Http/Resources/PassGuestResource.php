<?php

namespace App\Http\Resources;

use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A guest as their printed pass shows them, with the personalized link its QR code points to.
 *
 * @mixin Guest
 */
class PassGuestResource extends JsonResource
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
            'table' => $this->table_label,
            'url' => $this->url(),
        ];
    }
}
