<?php

namespace App\Services;

use App\Enums\PlanFeature;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie as CookieJar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * Checking guests in at the event. The staff at the door opens the invitation's door link once, which leaves a cookie
 * on their phone; with it, scanning a pass (its QR code is the guest's personalized link) shows the check-in screen
 * instead of the invitation. Making a new door link revokes the cookies of the old one.
 */
class CheckInService
{
    /** Length of the token in the door link. */
    public const int DOOR_TOKEN_LENGTH = 32;

    /** Folder of the door's Inertia pages, under resources/js/app/pages (see HandleInertiaRequests::PUBLIC_PAGES). */
    public const string PAGES = 'check-in/';

    /**
     * Give the invitation a new door link, which replaces the previous one.
     */
    public function regenerateDoorToken(Invitation $invitation): string
    {
        $invitation->forceFill(['door_token' => Str::random(self::DOOR_TOKEN_LENGTH)])->save();

        return $invitation->door_token;
    }

    /**
     * The link that gives a phone access to the door, or null while the invitation has none.
     */
    public function doorUrl(Invitation $invitation): ?string
    {
        return $invitation->door_token === null
            ? null
            : route('invitations.door.enter', [$invitation, $invitation->door_token]);
    }

    /**
     * Whether the given token is the invitation's current door token.
     */
    public function isDoorToken(Invitation $invitation, string $token): bool
    {
        return $invitation->door_token !== null && hash_equals($invitation->door_token, $token);
    }

    /**
     * Whether the request comes from a phone that opened the current door link, while check-in is open.
     */
    public function hasDoorAccess(Request $request, Invitation $invitation): bool
    {
        return $invitation->checkInIsOpen() && $this->isDoorToken($invitation, (string) $request->cookie($this->cookieName($invitation)));
    }

    /**
     * The cookie that remembers door access on the staff's phone until check-in closes. Cookies are encrypted (see
     * bootstrap/app.php), so its value cannot be read or forged.
     */
    public function doorCookie(Invitation $invitation): Cookie
    {
        $minutes = (int) ceil(now()->diffInMinutes($invitation->checkInClosesAt(), true));

        return CookieJar::make($this->cookieName($invitation), (string) $invitation->door_token, max(1, $minutes));
    }

    /**
     * Record how many people of the guest's group have arrived. Scanning the pass again corrects the number instead of
     * adding to it, and keeps the time of the first arrival.
     *
     * @throws ValidationException when check-in is closed or the number exceeds the guest's seats.
     */
    public function checkIn(Guest $guest, int $seats): Guest
    {
        $this->ensureOpen($guest->invitation);

        return DB::transaction(function () use ($guest, $seats): Guest {
            $guest = Guest::query()->whereKey($guest->id)->lockForUpdate()->firstOrFail();

            if ($seats < 1 || $seats > $guest->seats) {
                throw ValidationException::withMessages([
                    'seats' => __('The guest has :count seats.', ['count' => $guest->seats]),
                ]);
            }

            $guest->forceFill([
                'checked_in_at' => $guest->checked_in_at ?? now(),
                'checked_in_seats' => $seats,
            ])->save();

            return $guest;
        });
    }

    /**
     * Undo a check-in made by mistake.
     *
     * @throws ValidationException when check-in is closed.
     */
    public function undo(Guest $guest): void
    {
        $this->ensureOpen($guest->invitation);

        $guest->forceFill(['checked_in_at' => null, 'checked_in_seats' => 0])->save();
    }

    /**
     * How many guests and people have arrived, out of the whole list.
     *
     * @return array{guests: int, seats: int, arrived_guests: int, arrived_seats: int}
     */
    public function summary(Invitation $invitation): array
    {
        $totals = $invitation->guests()
            ->toBase()
            ->selectRaw('count(*) as guests, coalesce(sum(seats), 0) as seats')
            ->selectRaw('count(checked_in_at) as arrived_guests, coalesce(sum(checked_in_seats), 0) as arrived_seats')
            ->first();

        return [
            'guests' => (int) $totals->guests,
            'seats' => (int) $totals->seats,
            'arrived_guests' => (int) $totals->arrived_guests,
            'arrived_seats' => (int) $totals->arrived_seats,
        ];
    }

    /**
     * Check-in as the panel's guest list shows it, or null when the plan does not include it.
     *
     * @return array{door_url: string|null, opens_at: string|null, closes_at: string|null, is_open: bool, summary: array{guests: int, seats: int, arrived_guests: int, arrived_seats: int}}|null
     */
    public function panelSettings(Invitation $invitation): ?array
    {
        if (! $invitation->hasFeature(PlanFeature::CheckIn)) {
            return null;
        }

        return [
            'door_url' => $this->doorUrl($invitation),
            'opens_at' => $invitation->checkInOpensAt()?->toIso8601String(),
            'closes_at' => $invitation->checkInClosesAt()?->toIso8601String(),
            'is_open' => $invitation->checkInIsOpen(),
            'summary' => $this->summary($invitation),
        ];
    }

    /**
     * The props every door page shares: the check-in window, the arrivals so far and the page meta tags.
     *
     * @return array{door: array<string, mixed>, meta: array<string, string>}
     */
    public function doorPageProps(Invitation $invitation): array
    {
        return [
            'door' => [
                'title' => $invitation->title,
                'is_open' => $invitation->checkInIsOpen(),
                'opens_at' => $invitation->checkInOpensAt()?->toIso8601String(),
                'closes_at' => $invitation->checkInClosesAt()?->toIso8601String(),
                'url' => route('invitations.door.show', $invitation),
                'summary' => $this->summary($invitation),
            ],
            'meta' => [
                'title' => "Registro de llegadas — {$invitation->title}",
                'robots' => 'noindex, nofollow',
            ],
        ];
    }

    private function cookieName(Invitation $invitation): string
    {
        return "convite_door_{$invitation->id}";
    }

    /**
     * @throws ValidationException
     */
    private function ensureOpen(Invitation $invitation): void
    {
        if (! $invitation->checkInIsOpen()) {
            throw ValidationException::withMessages(['seats' => __('Check-in is closed.')]);
        }
    }
}
