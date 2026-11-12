export type PlanFeature = 'guest_management' | 'online_rsvp' | 'print_card' | 'guest_passes' | 'custom_design' | 'check_in';

/** A plan offered on the landing page, as sent by LandingController. */
export interface Plan {
  id: number;
  name: string;
  slug: string;
  /** Decimal string, e.g. "1500.00". */
  price: string;
  description: string | null;
  max_guests: number | null;
  features: PlanFeature[];
}
