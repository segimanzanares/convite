<?php

namespace App\Enums;

/**
 * Whether a message of the wishes book shows on the invitation and goes into its PDF. Invitations that moderate their
 * book get the messages as pending until a panel user approves them; the rest show them right away.
 */
enum WishStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Hidden = 'hidden';
}
