<?php

namespace App\Models;

use App\Enums\PlanFeature;
use Database\Factories\PlanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * A package sold to clients. Orders keep a copy of its limits and features (see Order::$plan_snapshot), so editing a
 * plan does not change what was already sold.
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $price
 * @property string|null $description
 * @property int|null $max_guests
 * @property int|null $max_seats_per_guest
 * @property Collection<int, PlanFeature> $features
 * @property bool $is_active
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'slug', 'price', 'description', 'max_guests', 'max_seats_per_guest', 'features', 'is_active', 'sort_order'])]
class Plan extends Model
{
    /** @use HasFactory<PlanFactory> */
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
            'max_guests' => 'integer',
            'max_seats_per_guest' => 'integer',
            'features' => AsEnumCollection::of(PlanFeature::class),
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Limit the query to the plans offered to new clients, in the order they are shown.
     *
     * @param  Builder<Plan>  $query
     */
    #[Scope]
    protected function offered(Builder $query): void
    {
        $query->where('is_active', true)->orderBy('sort_order')->orderBy('price');
    }

    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * The limits and features an order of this plan keeps.
     *
     * @return array{name: string, max_guests: int|null, max_seats_per_guest: int|null, features: list<string>}
     */
    public function snapshot(): array
    {
        return [
            'name' => $this->name,
            'max_guests' => $this->max_guests,
            'max_seats_per_guest' => $this->max_seats_per_guest,
            'features' => $this->features->map(fn (PlanFeature $feature) => $feature->value)->values()->all(),
        ];
    }
}
