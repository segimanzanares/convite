/** A guest of the invitation's guest list, as their printed pass shows them. */
export interface PassGuest {
  name: string;
  seats: number;
  table: string | null;
  /** The guest's personalized link, printed as a QR code. */
  url: string;
}

export interface GuestPassesPageProps {
  /** The guest list when the plan includes one; null when the visitor types the list on the page. */
  guests: PassGuest[] | null;
  [key: string]: unknown;
}
