export interface CelebrantInfo {
  /** Full name as shown in the hero and footer, e.g. "Lucila Santos". */
  name: string;
  firstName: string;
  age: number;
  eventDateTime: string;
  dateLabel: string;
  hosts: string;
  rsvpDeadlineLabel: string;
  footerDateLabel: string;
  rsvpWhatsappNumber: string;
  musicFile?: string;
}
