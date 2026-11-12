import { Link } from '@inertiajs/react';
import { ClipboardCheckIcon, UsersIcon } from 'lucide-react';
import { index as guestsIndex } from '@/actions/App/Http/Controllers/Admin/GuestController';
import { index as rsvpsIndex } from '@/actions/App/Http/Controllers/Admin/RsvpController';
import { Button } from '@/components/ui/button';
import { invitationSections } from '@/lib/invitation-sections';
import type { Invitation } from '@/types';

/** Links to the guest list and the RSVPs of an invitation, for the sections its plan includes. */
export default function InvitationSectionLinks({
    invitation,
    size = 'sm',
}: {
    invitation: Invitation;
    size?: 'sm' | 'default';
}) {
    const sections = invitationSections(invitation);

    return (
        <>
            {sections.guests && (
                <Button variant="outline" size={size} asChild>
                    <Link href={guestsIndex(invitation.slug)}>
                        <UsersIcon />
                        Invitados
                    </Link>
                </Button>
            )}
            {sections.rsvps && (
                <Button variant="outline" size={size} asChild>
                    <Link href={rsvpsIndex(invitation.slug)}>
                        <ClipboardCheckIcon />
                        Confirmaciones
                    </Link>
                </Button>
            )}
        </>
    );
}
