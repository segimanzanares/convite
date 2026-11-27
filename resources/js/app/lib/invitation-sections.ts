import {
    index as invitationsIndex,
    mine,
} from '@/actions/App/Http/Controllers/Admin/InvitationController';
import { index as videoIndex } from '@/actions/App/Http/Controllers/Admin/InvitationVideoController';
import type { BreadcrumbItem, Invitation, UserRole } from '@/types';

/** Whether the invitation's plan includes a guest list, online RSVPs, the live gallery and the wishes book. */
export function invitationSections(invitation: Invitation) {
    const features = invitation.features ?? [];

    return {
        guests: features.includes('guest_management'),
        rsvps: features.includes('online_rsvp'),
        gallery: features.includes('live_gallery'),
        wishes: features.includes('wishes'),
    };
}

/**
 * Where the panel links an invitation: its public page, or its video page when it was sold with only a video (it has
 * no public page then). Needs the order loaded, which sends offers_web.
 */
export function invitationLink(invitation: Invitation): {
    href: string;
    external: boolean;
} {
    return invitation.offers_web === false
        ? { href: videoIndex.url(invitation.slug), external: false }
        : { href: invitation.url, external: true };
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
