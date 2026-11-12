import type { HonorGroup } from '../components/xv/HonorSection';
import type { XvPhoto } from '../components/xv/ArchPhoto';
import type { ColorSwatchData, DressCodeData, GalleryImage, GiftOption, ProgramItem, Venue } from './wedding';

/**
 * The `invitation` prop of every template page: the content the admin captured, as
 * app/Http/Resources/InvitationContentResource.php sends it. Sections without data come empty (or null) and the
 * templates hide them.
 */
interface BaseContent {
  /** Local date and time of the event, e.g. "2027-03-20T17:30:00"; null until the admin sets the date. */
  eventAt: string | null;
  /** Last day to RSVP, e.g. "2027-03-01". */
  rsvpDeadline: string | null;
  /** Digits only, with the country code. */
  rsvpWhatsappNumber: string;
  musicFile: string | null;
  /** Background of the hero; templates fall back to their own image. */
  cover: string | null;
  /** Main invitation text; templates fall back to their own. */
  message: string | null;
  closingMessage: string | null;
  tagline: string | null;
  venues: Venue[];
  program: ProgramItem[];
  gallery: GalleryImage[];
  dressCode: DressCodeData | null;
  swatches: ColorSwatchData[];
  gifts: GiftOption[];
}

export interface WeddingContent extends BaseContent {
  kind: 'wedding';
  names: [string, string];
  families: string;
}

export interface BirthdayContent extends BaseContent {
  kind: 'birthday';
  name: string;
  firstName: string;
  age: number | null;
  hosts: string;
}

export interface XvStory {
  eyebrow: string;
  title: string;
  opening: string;
  paragraphs: string[];
  signature: string;
  photo: XvPhoto | null;
}

export interface XvContent extends Omit<BirthdayContent, 'kind'> {
  kind: 'xv';
  monogram: string | null;
  heroPhoto: XvPhoto | null;
  story: XvStory | null;
  parents: HonorGroup | null;
  godparents: HonorGroup[];
}

export type InvitationContent = WeddingContent | BirthdayContent | XvContent;
