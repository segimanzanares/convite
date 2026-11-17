<?php

namespace App\Models;

use App\Enums\GalleryPhotoStatus;
use Database\Factories\GalleryPhotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A photo a guest shared in the invitation's live gallery, by scanning its QR code at the event. The file and its
 * thumbnail live on the public disk, under the invitation's media folder (see LiveGalleryService).
 *
 * @property int $id
 * @property int $invitation_id
 * @property string $path
 * @property string $thumb_path
 * @property int $width
 * @property int $height
 * @property string|null $uploader_name
 * @property string|null $message
 * @property GalleryPhotoStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['path', 'thumb_path', 'width', 'height', 'uploader_name', 'message', 'status'])]
class GalleryPhoto extends Model
{
    /** @use HasFactory<GalleryPhotoFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => GalleryPhotoStatus::class,
        ];
    }

    /** @return BelongsTo<Invitation, $this> */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /**
     * Limit the query to the photos the wall shows.
     *
     * @param  Builder<GalleryPhoto>  $query
     */
    #[Scope]
    protected function approved(Builder $query): void
    {
        $query->where('status', GalleryPhotoStatus::Approved);
    }
}
