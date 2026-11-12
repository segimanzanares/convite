import {
    index as invitationsIndex,
    mine,
} from '@/actions/App/Http/Controllers/Admin/InvitationController';
import type { BreadcrumbItem, Invitation, UserRole } from '@/types';

/** Whether the invitation's plan includes a guest list and online RSVPs. */
export function invitationSections(invitation: Invitation) {
    const features = invitation.features ?? [];

    return {
        guests: features.includes('guest_management'),
        rsvps: features.includes('online_rsvp'),
    };
}

/** Breadcrumbs of a page that belongs to an invitation, starting at the listing each role sees. */
export function invitationBreadcrumbs(
    role: UserRole,
    invitation: Invitation,
    page: BreadcrumbItem,
): BreadcrumbItem[] {
    return [
        role === 'admin'
            ? { title: 'Invitaciones', href: invitationsIndex() }
            : { title: 'Mis invitaciones', href: mine() },
        { title: `${page.title} · ${invitation.title}`, href: page.href },
    ];
}
