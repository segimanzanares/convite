<?php

namespace App\Enums;

/**
 * Where a partner's commission on an order stands. It is worked out from the order (see Order::commissionStatus()),
 * not stored.
 */
enum CommissionStatus: string
{
    /** The order is not paid in full yet, so the commission is not owed. */
    case Pending = 'pending';
    /** The order is paid in full: Convite owes the partner the commission. */
    case Earned = 'earned';
    /** The commission was paid to the partner. */
    case Paid = 'paid';
}
