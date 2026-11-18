<?php

namespace App\Models;

use App\Enums\WishStatus;
use Database\Factories\WishFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A message (congratulations, good wishes...) a guest left in the invitation's wishes book. The panel downloads them
 * all in a PDF (see WishService).
 *
 * @property int $id
 * @property int $invitation_id
 * @property int|null $guest_id
 * @property string $author_name
 * @property string $message
 * @property WishStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['guest_id', 'author_name', 'message', 'status'])]
class Wish extends Model
{
    /** @use HasFactory<WishFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => WishStatus::class,
        ];
    }

    /** @return BelongsTo<Invitation, $this> */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /** @return BelongsTo<Guest, $this> */
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    /**
     * Limit the query to the messages the invitation shows.
     *
     * @param  Builder<Wish>  $query
     */
    #[Scope]
    protected function approved(Builder $query): void
    {
        $query->where('status', WishStatus::Approved);
    }
}
