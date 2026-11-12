<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PlanFeature;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A plan sold to a client. Its limits and features come from $plan_snapshot, never from the current plan.
 *
 * @property int $id
 * @property int $client_id
 * @property int $plan_id
 * @property string $price
 * @property array{name: string, max_guests: int|null, max_seats_per_guest?: int|null, features: list<string>} $plan_snapshot
 * @property OrderStatus $status
 * @property string|null $notes
 * @property string|null $payments_sum_amount
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['client_id', 'plan_id', 'price', 'plan_snapshot', 'status', 'notes'])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'plan_snapshot' => 'array',
            'status' => OrderStatus::class,
        ];
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Plan, $this> */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /** @return HasMany<Invitation, $this> */
    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    public function hasFeature(PlanFeature $feature): bool
    {
        return in_array($feature->value, $this->plan_snapshot['features'] ?? [], true);
    }

    /**
     * Whether the order includes a feature that is used from the panel, which entitles the client to users.
     */
    public function grantsPanelAccess(): bool
    {
        return collect(PlanFeature::cases())
            ->contains(fn (PlanFeature $feature) => $feature->grantsPanelAccess() && $this->hasFeature($feature));
    }

    public function maxGuests(): ?int
    {
        return $this->plan_snapshot['max_guests'] ?? null;
    }

    /**
     * The most seats each guest (a family or group) may have, or null when the plan sets no limit. Orders sold
     * before plans had this limit have no such key in their snapshot.
     */
    public function maxSeatsPerGuest(): ?int
    {
        return $this->plan_snapshot['max_seats_per_guest'] ?? null;
    }

    /**
     * The amount paid so far. Uses the `payments_sum_amount` aggregate when it was loaded with withSum().
     */
    public function amountPaid(): string
    {
        $paid = $this->payments_sum_amount ?? $this->payments()->sum('amount');

        return number_format((float) $paid, 2, '.', '');
    }

    /**
     * The price minus the payments registered so far.
     */
    public function balance(): string
    {
        return number_format((float) $this->price - (float) $this->amountPaid(), 2, '.', '');
    }
}
