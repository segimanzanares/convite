<?php

namespace App\Models;

use Database\Factories\GuestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * A guest of an invitation: a person, couple or family that gets one personalized link, /i/{slug}/{token}. The plan
 * limits how many guests an invitation has; $seats is only used for passes and headcounts.
 *
 * @property int $id
 * @property int $invitation_id
 * @property string $name
 * @property int $seats
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $table_label
 * @property string $token
 * @property Carbon|null $sent_at
 * @property Carbon|null $first_opened_at
 * @property Carbon|null $checked_in_at
 * @property int $checked_in_seats
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'seats', 'phone', 'email', 'table_label'])]
class Guest extends Model
{
    /** @use HasFactory<GuestFactory> */
    use HasFactory;

    /** Length of the token in the guest's personalized link. */
    public const int TOKEN_LENGTH = 16;

    /** The most seats a single guest (a family or group) may have, whatever the plan. */
    public const int MAX_SEATS = 50;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'seats' => 'integer',
            'sent_at' => 'datetime',
            'first_opened_at' => 'datetime',
            'checked_in_at' => 'datetime',
            'checked_in_seats' => 'integer',
        ];
    }

    /**
     * Give every new guest a token for their personalized link.
     */
    protected static function booted(): void
    {
        static::creating(function (Guest $guest): void {
            $guest->token ??= Str::random(self::TOKEN_LENGTH);
        });
    }

    /** @return BelongsTo<Invitation, $this> */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /** @return HasOne<Rsvp, $this> */
    public function rsvp(): HasOne
    {
        return $this->hasOne(Rsvp::class);
    }

    /**
     * The guest's personalized link to the invitation.
     */
    public function url(): string
    {
        return route('invitations.guest', [$this->invitation, $this->token]);
    }
}
