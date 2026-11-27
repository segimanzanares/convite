<?php

namespace App\Enums;

/**
 * What a plan sells. Web invitations are the main product, shown on the landing page's pricing, and the only ones
 * with features; the rest are the services of /servicios. An order keeps its plan's type in its snapshot.
 */
enum PlanType: string
{
    /** The invitation's web page at /i/{slug}, with the features of the plan. */
    case WebInvitation = 'web_invitation';

    /** A video drawn from the invitation's content (see InvitationVideoService). The invitation has no web page. */
    case VideoInvitation = 'video_invitation';

    /** A video of the client's photos and song ("video semblanza"), made by hand and delivered as a file. */
    case TributeVideo = 'tribute_video';

    /** A card and guest passes designed for the client, delivered as PDF files to print. */
    case Printables = 'printables';

    /**
     * Whether an order of this type holds an invitation: its web page, or the content its video draws.
     */
    public function hasInvitation(): bool
    {
        return $this === self::WebInvitation || $this === self::VideoInvitation;
    }
}
