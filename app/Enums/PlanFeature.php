<?php

namespace App\Enums;

enum PlanFeature: string
{
    /** Guest list, personalized links, sending and passes generated from the database. */
    case GuestManagement = 'guest_management';

    /** RSVPs are stored in the database and shown to the client in the panel. */
    case OnlineRsvp = 'online_rsvp';

    /** Printable card served at /i/{slug}/tarjeta. */
    case PrintCard = 'print_card';

    /** Printable guest passes served at /i/{slug}/pases. */
    case GuestPasses = 'guest_passes';

    /** The invitation gets a design made for the client (an exclusive template) instead of one from the catalog. */
    case CustomDesign = 'custom_design';

    /** Guests are checked in at the door by scanning the QR code of their pass. Requires the guest list. */
    case CheckIn = 'check_in';

    /**
     * Whether a plan with this feature gives the client an account for the panel.
     */
    public function grantsPanelAccess(): bool
    {
        return in_array($this, [self::GuestManagement, self::OnlineRsvp], true);
    }
}
