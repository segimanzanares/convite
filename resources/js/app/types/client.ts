export type Client = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
    orders_count?: number;
    created_at: string;
};

/** A panel user of a client. */
export type ClientUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};
