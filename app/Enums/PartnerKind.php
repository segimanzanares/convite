<?php

namespace App\Enums;

/**
 * What kind of business or person a partner is, used to group their visits in Google Analytics (the utm_campaign of
 * their link).
 */
enum PartnerKind: string
{
    case WeddingPlanner = 'wedding_planner';
    case Influencer = 'influencer';
    case Venue = 'venue';
    case Photographer = 'photographer';
    case Other = 'other';
}
