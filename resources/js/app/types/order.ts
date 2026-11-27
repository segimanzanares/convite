import type { Client } from './client';
import type { Invitation } from './invitation';
import type { CommissionStatus, Partner } from './partner';
import type { PlanSnapshot, PlanType } from './plan';

export type OrderStatus = 'quoted' | 'active' | 'delivered' | 'archived';

/** How the client found Convite (App\Enums\OrderSource). */
export type OrderSource =
    | 'instagram'
    | 'tiktok'
    | 'facebook'
    | 'pinterest'
    | 'google'
    | 'invitation'
    | 'referral'
    | 'partner'
    | 'other';

export type PaymentMethod = 'cash' | 'transfer' | 'other';

export type Payment = {
    id: number;
    amount: string;
    paid_at: string;
    method: PaymentMethod;
    notes: string | null;
};

/** A file delivered with an order. */
export type OrderFile = {
    id: number;
    name: string;
    /** In bytes. */
    size: number;
    created_at: string;
};

export type Order = {
    id: number;
    client_id: number;
    plan_id: number;
    price: string;
    plan: PlanSnapshot;
    /** What the order sold (its plan's type, web_invitation for orders from before plans had one). */
    type: PlanType;
    grants_panel_access: boolean;
    /** The delivered files; only sent on the order page. */
    files?: OrderFile[];
    status: OrderStatus;
    notes: string | null;
    source: OrderSource | null;
    /** The client who recommended Convite. Only sent on the order page. */
    referrer?: Pick<Client, 'id' | 'name' | 'referral_code'> | null;
    /** The partner who brought the client, who earns a commission on the order. */
    partner_id: number | null;
    /** Only sent on the order page. */
    partner?: Pick<Partner, 'id' | 'name' | 'code'> | null;
    /** The partner's percent when they were assigned. */
    commission_percent: string | null;
    commission_amount: string | null;
    /** Only sent when the payments sum was loaded; null without a partner. */
    commission_status?: CommissionStatus | null;
    commission_paid_at: string | null;
    /** Only sent when the payments sum was loaded. */
    amount_paid?: string;
    balance?: string;
    client?: Client;
    payments?: Payment[];
    invitations?: Invitation[];
    created_at: string;
};
