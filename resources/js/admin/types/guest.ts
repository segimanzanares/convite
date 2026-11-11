import type { Invitation } from './invitation';

export type Rsvp = {
    id: number;
    /** Null for answers sent through the open form. */
    guest_id: number | null;
    name: string;
    attending: boolean;
    seats_confirmed: number;
    message: string | null;
    responded_at: string;
    /** Only sent when the invitation was loaded, e.g. on the dashboard. */
    invitation?: Invitation;
};

export type Guest = {
    id: number;
    name: string;
    seats: number;
    phone: string | null;
    email: string | null;
    table_label: string | null;
    /** The guest's personalized link to the invitation. */
    url: string;
    /** Opens WhatsApp with the invitation message ready to send to the guest. */
    whatsapp_url: string;
    sent_at: string | null;
    first_opened_at: string | null;
    rsvp?: Rsvp | null;
};

/** A row of a CSV file as the import preview returns it. */
export type GuestImportRow = {
    line: number;
    name: string;
    seats: number | string;
    table_label: string | null;
    phone: string | null;
    email: string | null;
    errors: string[];
};

export type RsvpSummary = {
    guests: number;
    attending: number;
    declined: number;
    pending: number;
    people: number;
};
