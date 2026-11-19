<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * A customer account. It can have several users (e.g. both members of a couple) when one of its orders includes
 * panel access.
 *
 * @property int $id
 * @property string $name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $notes
 * @property string $referral_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'phone', 'email', 'notes'])]
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    /** Characters of the random part of a referral code, without the ones easy to mistake for each other (0/O, 1/I/L). */
    private const string REFERRAL_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

    /**
     * Give every new client a referral code to share with friends.
     */
    protected static function booted(): void
    {
        static::creating(function (Client $client): void {
            $client->referral_code ??= self::generateReferralCode($client->name);
        });
    }

    /**
     * A unique, easy to dictate code: up to five letters of the client's first name plus four random characters,
     * e.g. "MARIA7K2Q".
     */
    public static function generateReferralCode(string $name): string
    {
        $prefix = Str::upper(Str::substr(preg_replace('/[^a-z]/', '', Str::slug(Str::before(trim($name), ' '))), 0, 5));

        do {
            $suffix = collect(range(1, 4))
                ->map(fn () => self::REFERRAL_CODE_ALPHABET[random_int(0, strlen(self::REFERRAL_CODE_ALPHABET) - 1)])
                ->implode('');
            $code = ($prefix ?: 'CV').$suffix;
        } while (self::query()->where('referral_code', $code)->exists());

        return $code;
    }

    /**
     * The client a referral code belongs to, ignoring case and surrounding spaces as typed by people.
     */
    public static function findByReferralCode(?string $code): ?self
    {
        $code = Str::upper(trim((string) $code));

        return $code === '' ? null : self::query()->where('referral_code', $code)->first();
    }

    /**
     * The landing page link that carries the client's referral code.
     */
    public function referralUrl(): string
    {
        return route('landing', ['ref' => $this->referral_code]);
    }

    /** @return HasMany<User, $this> */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /** @return HasMany<Order, $this> */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * The orders of other clients who came recommended by this one.
     *
     * @return HasMany<Order, $this>
     */
    public function referredOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'referrer_client_id');
    }

    /** @return HasMany<Invitation, $this> */
    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    /**
     * Whether one of the client's orders includes a feature that is used from the panel, so the client may have users.
     */
    public function canHavePanelAccess(): bool
    {
        return $this->orders()->get()->contains(fn (Order $order) => $order->grantsPanelAccess());
    }
}
