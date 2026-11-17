<?php

namespace App\Http\Resources;

use App\Models\GalleryPhoto;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A photo of the live gallery. The public pages only get approved photos; the panel also gets their status.
 *
 * @mixin GalleryPhoto
 */
class GalleryPhotoResource extends JsonResource
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
            'url' => Invitation::mediaUrl($this->path),
            'thumb_url' => Invitation::mediaUrl($this->thumb_path),
            'width' => $this->width,
            'height' => $this->height,
            'uploader_name' => $this->uploader_name,
            'message' => $this->message,
            'created_at' => $this->created_at?->toIso8601String(),
            'status' => $this->when($request->routeIs('admin.*'), $this->status),
        ];
    }
}
