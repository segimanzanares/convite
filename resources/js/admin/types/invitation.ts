import type { Client } from './client';

export type InvitationStatus = 'draft' | 'published' | 'archived';

export type Invitation = {
    id: number;
    slug: string;
    /** Public URL of the invitation. */
    url: string;
    template: string;
    client_id: number | null;
    order_id: number | null;
    event_date: string | null;
    rsvp_deadline: string | null;
    status: InvitationStatus;
    title: string;
    description: string;
    og_image: string | null;
    guests_purged_at: string | null;
    client?: Client;
};
