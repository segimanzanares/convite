/** What kind of business or person a partner is (App\Enums\PartnerKind). */
export type PartnerKind =
    "wedding_planner" | "influencer" | "venue" | "photographer" | "other";

/** Where a partner's commission on an order stands (App\Enums\CommissionStatus). */
export type CommissionStatus = "pending" | "earned" | "paid";

/** What a partner's orders add up to; quotes are left out. */
export type PartnerSummary = {
    sales_count: number;
    sales_total: string;
    /** Of orders not paid in full yet. */
    commission_pending: string;
    /** Owed to the partner: their orders are paid in full. */
    commission_earned: string;
    commission_paid: string;
};

/** An "aliado" who brings clients for a commission. */
export type Partner = {
    id: number;
    name: string;
    kind: PartnerKind;
    phone: string | null;
    email: string | null;
    code: string;
    commission_percent: string;
    discount_percent: number;
    is_active: boolean;
    notes: string | null;
    /** The short link they share, e.g. https://convite.mx/a/ANAPLANNER. */
    link: string;
    /** Quotes included. Only sent on the list. */
    orders_count?: number;
    /** Only sent when the partner's orders were loaded. */
    summary?: PartnerSummary;
    created_at: string;
};

/** A partner as offered by the order forms. */
export type PartnerOption = Pick<Partner, "id" | "name" | "code" | "is_active">;
