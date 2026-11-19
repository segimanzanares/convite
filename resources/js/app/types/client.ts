export type Client = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
    /** Shared with friends, who get a discount on the landing page. */
    referral_code: string;
    /** The landing page with the referral code. */
    referral_url: string;
    /** Sales (not quotes) the referral code brought in. Only sent on the client page. */
    referred_orders_count?: number;
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
