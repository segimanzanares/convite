<?php

namespace App\Enums;

/**
 * How the client found Convite, recorded by the admin on the order (usually asked over WhatsApp), so sales can be
 * counted by marketing channel.
 */
enum OrderSource: string
{
    case Instagram = 'instagram';
    case Tiktok = 'tiktok';
    case Facebook = 'facebook';
    case Pinterest = 'pinterest';
    case Google = 'google';
    /** Saw another client's invitation. */
    case Invitation = 'invitation';
    /** Recommended by another client, with their referral code. */
    case Referral = 'referral';
    /** Recommended by a vendor (wedding planner, venue, photographer...). */
    case Partner = 'partner';
    case Other = 'other';
}
