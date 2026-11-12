export type PlanFeature =
    | 'guest_management'
    | 'online_rsvp'
    | 'print_card'
    | 'guest_passes'
    | 'custom_design'
    | 'check_in';

export type Plan = {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string | null;
    max_guests: number | null;
    /** The most seats per guest (family or group), null without a limit of its own. */
    max_seats_per_guest: number | null;
    features: PlanFeature[];
    is_active: boolean;
    sort_order: number;
    orders_count?: number;
};

/** The copy of a plan's conditions that an order keeps. */
export type PlanSnapshot = {
    name: string;
    max_guests: number | null;
    /** Missing in orders sold before plans had this limit. */
    max_seats_per_guest?: number | null;
    features: PlanFeature[];
};

/** A plan offered on the landing page, as sent by LandingController to visitors. */
export type OfferedPlan = Omit<Plan, 'is_active' | 'sort_order' | 'orders_count'>;
