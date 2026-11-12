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
    features: PlanFeature[];
    is_active: boolean;
    sort_order: number;
    orders_count?: number;
};

/** The copy of a plan's conditions that an order keeps. */
export type PlanSnapshot = {
    name: string;
    max_guests: number | null;
    features: PlanFeature[];
};
