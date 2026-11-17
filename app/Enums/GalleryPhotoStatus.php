<?php

namespace App\Enums;

/**
 * Whether a photo of the live gallery shows on the wall. Invitations that moderate their gallery get their guests'
 * photos as pending until a panel user approves them; the rest show them right away.
 */
enum GalleryPhotoStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Hidden = 'hidden';
}
