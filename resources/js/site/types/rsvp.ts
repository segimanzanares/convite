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

export interface InvitationPageProps {
  rsvp?: RsvpSettings;
  guest?: InvitationGuest | null;
  [key: string]: unknown;
}
