/** How the invitation's RSVP section works, sent by the server with every invitation page. */
export interface RsvpSettings {
  /** Answers are stored by the server; otherwise the section opens WhatsApp. */
  online: boolean;
  /** The server still takes answers (the deadline has not passed). */
  open: boolean;
  url: string;
  /** The most people one answer through the open form may confirm. */
  max_seats: number;
}

export interface RsvpAnswer {
  attending: boolean;
  seats_confirmed: number;
  message: string | null;
}

/** The guest a personalized link (/i/{slug}/{token}) belongs to. */
export interface InvitationGuest {
  name: string;
  seats: number;
  token: string;
  /** Their current answer; only sent when the invitation stores answers. */
  rsvp?: RsvpAnswer | null;
}

/** A message of the wishes book, as the invitation shows it. */
export interface PublicWish {
  id: number;
  author_name: string;
  message: string;
  created_at: string | null;
}

/** The invitation's wishes book, sent when its plan includes it and a panel user turned it on. */
export interface WishesSettings {
  /** The book still takes messages. */
  open: boolean;
  url: string;
  /** The approved messages show on the invitation. */
  public: boolean;
  /** New messages wait for approval before showing. */
  moderated: boolean;
  max_length: number;
  /** The latest approved messages, newest first; empty unless `public`. */
  wishes: PublicWish[];
}

export interface InvitationPageProps {
  rsvp?: RsvpSettings;
  wishes?: WishesSettings | null;
  guest?: InvitationGuest | null;
  [key: string]: unknown;
}
