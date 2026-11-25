<?php

namespace App\Models;

use App\Enums\PartnerKind;
use Database\Factories\PartnerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * An "aliado": a wedding planner, influencer, venue... who sends clients to Convite through their link and earns a
 * commission on each order they bring (see Order::commissionStatus()).
 *
 * @property int $id
 * @property string $name
 * @property PartnerKind $kind
 * @property string|null $phone
 * @property string|null $email
 * @property string $code
 * @property string $commission_percent
 * @property int $discount_percent
 * @property bool $is_active
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'kind', 'phone', 'email', 'code', 'commission_percent', 'discount_percent', 'is_active', 'notes'])]
class Partner extends Model
{
    /** @use HasFactory<PartnerFactory> */
    use HasFactory;

    /** The longest code a partner may have, so their link stays easy to dictate. */
    public const int CODE_MAX_LENGTH = 20;

    /** The query string key of the landing page that carries a partner's code. */
    public const string QUERY_KEY = 'aliado';

    /**
     * Give a partner created without a code one made from their name.
     */
    protected static function booted(): void
    {
        static::creating(function (Partner $partner): void {
            $partner->code ??= self::generateCode($partner->name);
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => PartnerKind::class,
            'commission_percent' => 'decimal:2',
            'discount_percent' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Codes are kept in upper case, as typed by people in any case.
     */
    protected function code(): Attribute
    {
        return Attribute::make(set: fn (?string $value): ?string => $value === null ? null : self::normalizeCode($value));
    }

    public static function normalizeCode(?string $code): string
    {
        return Str::upper(trim((string) $code));
    }

    /**
     * A unique code made from the partner's name, e.g. "ANAPLANNER", with a number added when it is taken.
     */
    public static function generateCode(string $name): string
    {
        $base = Str::substr(Str::upper(preg_replace('/[^a-z0-9]/', '', Str::slug($name))), 0, self::CODE_MAX_LENGTH - 2) ?: 'ALIADO';
        $code = $base;

        for ($suffix = 2; self::query()->where('code', $code)->exists(); $suffix++) {
            $code = $base.$suffix;
        }

        return $code;
    }

    /**
     * The active partner a code belongs to, ignoring case and surrounding spaces. Links of inactive partners no
     * longer count.
     */
    public static function findActiveByCode(?string $code): ?self
    {
        $code = self::normalizeCode($code);

        return $code === '' ? null : self::query()->where('code', $code)->where('is_active', true)->first();
    }

    /**
     * The short link the partner shares (e.g. convite.mx/a/ANAPLANNER), which redirects to landingUrl().
     */
    public function link(): string
    {
        return route('partners.link', ['code' => $this->code]);
    }

    /**
     * The landing page with the partner's code, plus UTM parameters so Google Analytics counts their visits as the
     * "aliado" medium, with the partner's code as the source and their kind as the campaign.
     */
    public function landingUrl(): string
    {
        return route('landing', [
            self::QUERY_KEY => $this->code,
            'utm_source' => Str::lower($this->code),
            'utm_medium' => 'aliado',
            'utm_campaign' => $this->kind->value,
        ]);
    }

    /**
     * The orders of the clients the partner brought.
     *
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
