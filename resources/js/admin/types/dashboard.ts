import type { RsvpSummary } from './guest';
import type { Invitation } from './invitation';

/** Sales (orders that are not quotes) and payments of one month, "Y-m". */
export type MonthlyRevenue = {
    month: string;
    sales: string;
    collected: string;
};

export type AdminTotals = {
    sales_this_month: string;
    collected_this_month: string;
    /** What active and delivered orders still owe. */
    balance_due: string;
    upcoming_events: number;
};

/** How far along one of the client's invitations is. Sections the plan lacks are null. */
export type InvitationProgress = {
    invitation: Invitation;
    /** Negative once the event passed; null without a date. */
    days_until_event: number | null;
    guests: {
        total: number;
        sent: number;
        opened: number;
        /** The plan's guest limit, null without one. */
        limit: number | null;
    } | null;
    rsvps: RsvpSummary | null;
};

/** Answers that came in on one day, "Y-m-d". */
export type DailyAnswers = {
    day: string;
    attending: number;
    declined: number;
};
