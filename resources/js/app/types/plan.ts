/** What a plan sells: a web invitation (with features) or one of the services of /servicios. */
export type PlanType =
    | 'web_invitation'
    | 'video_invitation'
    | 'tribute_video'
    | 'printables';

export type PlanFeature =
    | 'guest_management'
    | 'online_rsvp'
    | 'print_card'
    | 'guest_passes'
    | 'custom_design'
    | 'check_in'
    | 'live_gallery'
    | 'wishes';

export type Plan = {
    id: number;
    name: string;
    slug: string;
    type: PlanType;
    price: string;
    /** Under the price, e.g. what it covers ("Incluye hasta 50 pases"). */
    price_note: string | null;
    description: string | null;
    /** What a service includes, one line each; web invitations list their features instead. */
    details: string[] | null;
    max_guests: number | null;
    /** The most seats per guest (family or group), null without a limit of its own. */
    max_seats_per_guest: number | null;
    features: PlanFeature[];
    is_active: boolean;
    /** Stands out among the options of its service. */
    is_featured: boolean;
    sort_order: number;
    orders_count?: number;
};

/** The copy of a plan's conditions that an order keeps. */
export type PlanSnapshot = {
    name: string;
    /** Missing in orders sold before plans had a type, which were web invitations. */
    type?: PlanType;
    max_guests: number | null;
    /** Missing in orders sold before plans had this limit. */
    max_seats_per_guest?: number | null;
    features: PlanFeature[];
};

/** A plan offered on the landing page, as sent by LandingController to visitors. */
export type OfferedPlan = Omit<Plan, 'is_active' | 'sort_order' | 'orders_count'>;
