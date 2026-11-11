<?php

namespace App\Models;

use Database\Factories\RsvpFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * An answer to an invitation. Answers through a personalized link belong to the guest (one per guest, which they may
 * change until the deadline); answers through the open form have no guest.
 *
 * @property int $id
 * @property int $invitation_id
 * @property int|null $guest_id
 * @property string $name
 * @property bool $attending
 * @property int $seats_confirmed
 * @property string|null $message
 * @property Carbon $responded_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['guest_id', 'name', 'attending', 'seats_confirmed', 'message', 'responded_at'])]
class Rsvp extends Model
{
    /** @use HasFactory<RsvpFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attending' => 'boolean',
            'seats_confirmed' => 'integer',
            'responded_at' => 'datetime',
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
}
