/** How many guests and people have arrived, out of the whole guest list. */
export interface CheckInSummary {
    guests: number;
    seats: number;
    arrived_guests: number;
    arrived_seats: number;
}

/** The check-in window and progress, sent with every door page. */
export interface Door {
    title: string;
    /** Guests may be checked in now (from the day before the event until noon after it). */
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    /** The door page, with the counter and the search by name. */
    url: string;
    summary: CheckInSummary;
}

/** A guest as the staff at the door sees them. */
export interface CheckInGuest {
    id: number;
    name: string;
    seats: number;
    table_label: string | null;
    checked_in_at: string | null;
    /** People of the group who have arrived, 0 before check-in. */
    checked_in_seats: number;
    rsvp?: { attending: boolean; seats_confirmed: number } | null;
    /** Posting `seats` checks the guest in; deleting undoes it. */
    check_in_url: string;
}

export interface DoorPageProps {
    door: Door;
    /** Null outside the check-in window. */
    guests: CheckInGuest[] | null;
    [key: string]: unknown;
}

export interface CheckInPageProps {
    door: Door;
    /** Null when the scanned code is not a pass of this invitation. */
    guest: CheckInGuest | null;
    [key: string]: unknown;
}
