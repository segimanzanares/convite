<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

/**
 * The referral program: a visitor who opens the landing page with a client's code (?ref=CODE) is offered a discount,
 * and the code goes in their WhatsApp messages so the admin can record who referred them on the order.
 */
class ReferralService
{
    /** Remembers the code of the visitor's last referral link, so it still applies when they come back later. */
    public const string COOKIE = 'convite_ref';

    /**
     * Whether the referral program is on (config('convite.referrals_enabled')).
     */
    public function isEnabled(): bool
    {
        return (bool) config('convite.referrals_enabled');
    }

    /**
     * The referral that applies to the visitor: the code in the link, or else the one remembered from an earlier
     * visit. A valid code in the link is remembered for config('convite.referral_cookie_days') days. Unknown codes are
     * ignored, and so is every code while the program is off. The page only gets the code, never who it belongs to.
     *
     * @return array{code: string, discount_percent: int}|null
     */
    public function landingProps(Request $request): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        $referrer = Client::findByReferralCode($request->query('ref'));

        if ($referrer !== null) {
            Cookie::queue(self::COOKIE, $referrer->referral_code, config('convite.referral_cookie_days') * 24 * 60);
        } else {
            $referrer = Client::findByReferralCode($request->cookie(self::COOKIE));
        }

        return $referrer === null ? null : [
            'code' => $referrer->referral_code,
            'discount_percent' => config('convite.referral_discount_percent'),
        ];
    }

    /**
     * Whether the visitor opened a client's referral link (?ref=CODE with a known code) while the program is on.
     */
    public function isReferralLink(Request $request): bool
    {
        return $this->isEnabled() && Client::findByReferralCode($request->query('ref')) !== null;
    }

    /**
     * The link to the landing page from an invitation's "made with Convite" credit. Its UTM parameters tell Google
     * Analytics the visit came from an invitation and which template, and a client's invitation carries the client's
     * referral code while the program is on, so a guest who orders their own invitation counts as referred by them.
     */
    public function invitationCreditUrl(Invitation $invitation): string
    {
        return route('landing', array_filter([
            'utm_source' => 'invitacion',
            'utm_medium' => 'credito',
            'utm_campaign' => $invitation->template,
            'ref' => $this->isEnabled() ? $invitation->client?->referral_code : null,
        ]));
    }
}
