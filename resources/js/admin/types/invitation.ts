import type { Client } from './client';
import type { PlanFeature } from './plan';

export type InvitationStatus = 'draft' | 'published' | 'archived';

export type InvitationKind = 'wedding' | 'birthday' | 'xv';

export type InvitationSection =
    | 'venues'
    | 'program'
    | 'gallery'
    | 'dress_code'
    | 'swatches'
    | 'gifts';

/** A design under resources/js/site/templates, as its template.json declares it. */
export type InvitationTemplate = {
    name: string;
    label: string;
    kind: InvitationKind;
    /** The optional sections its design shows. */
    sections: InvitationSection[];
};

export type Invitation = {
    id: number;
    slug: string;
    /** Public URL of the invitation. */
    url: string;
    /** Folder of the template under resources/js/site/templates. */
    template: string;
    /** Name of the template as its template.json declares it, e.g. "Boda floral". */
    template_label: string;
    kind: InvitationKind | null;
    client_id: number | null;
    order_id: number | null;
    event_date: string | null;
    /** "HH:mm" */
    event_time: string | null;
    rsvp_deadline: string | null;
    status: InvitationStatus;
    title: string;
    description: string;
    og_image: string | null;
    guests_purged_at: string | null;
    /** The features of the order's plan; only sent when the order was loaded. */
    features?: PlanFeature[];
    /** The plan's guest limit, null without one; only sent when the order was loaded. */
    max_guests?: number | null;
    /** The printable passes, null when the plan or template has none; only sent when the order was loaded. */
    guest_passes_url?: string | null;
    client?: Client;
};
