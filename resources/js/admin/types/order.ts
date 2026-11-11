import type { Client } from './client';
import type { Invitation } from './invitation';
import type { PlanSnapshot } from './plan';

export type OrderStatus = 'quoted' | 'active' | 'delivered' | 'archived';

export type PaymentMethod = 'cash' | 'transfer' | 'other';

export type Payment = {
    id: number;
    amount: string;
    paid_at: string;
    method: PaymentMethod;
    notes: string | null;
};

export type Order = {
    id: number;
    client_id: number;
    plan_id: number;
    price: string;
    plan: PlanSnapshot;
    grants_panel_access: boolean;
    status: OrderStatus;
    notes: string | null;
    /** Only sent when the payments sum was loaded. */
    amount_paid?: string;
    balance?: string;
    client?: Client;
    payments?: Payment[];
    invitations?: Invitation[];
    created_at: string;
};
