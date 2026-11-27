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
  /** The primary color the admin picked in place of the template's own; null keeps the design's colors. */
  colors: CustomColors | null;
}

/** See lib/customColors.ts, which applies them. */
export interface CustomColors {
  /** e.g. "#3F7A62". */
  primary: string;
  /** The text color that reads on the primary. */
  primaryForeground: string;
}

export interface WeddingContent extends BaseContent {
  kind: 'wedding';
  names: [string, string];
  families: string;
  /** The parents of each one of the couple, e.g. "Padres de la novia"; up to two groups. */
  parents: HonorGroup[];
  godparents: HonorGroup[];
}

export interface BirthdayContent extends BaseContent {
  kind: 'birthday';
  name: string;
  firstName: string;
  age: number | null;
  hosts: string;
  /** The celebrant's parents, null when the admin captured no names. */
  parents: HonorGroup | null;
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
  godparents: HonorGroup[];
}

/** A baptism has the XV chapters: the letter (written for the baby), the parents and the godparents. */
export interface BaptismContent extends Omit<XvContent, 'kind'> {
  kind: 'baptism';
}

export type BabyGender = 'boy' | 'girl';

/** A gender reveal: the parents-to-be (one or two names) invite to find out whether their baby is a boy or a girl. */
export interface GenderRevealContent extends BaseContent {
  kind: 'gender_reveal';
  /** The parents-to-be, one or two names. */
  names: string[];
  families: string;
  /** e.g. "Llega en abril de 2027". */
  dueLabel: string | null;
  /** The name they picked for each answer, if any. */
  babyNames: Record<BabyGender, string | null>;
  /** The answer, null until the party begins (or while nobody knows it). */
  reveal: BabyGender | null;
  /** The baby's grandparents, e.g. "Abuelos maternos". */
  grandparents: HonorGroup[];
}

/** One group of guests of a baby shower's "lluvia de pañales" and the size asked of it, e.g. "Etapa 2" for "Apellidos de la A a la M". */
export interface DiaperSize {
  label: string;
  note: string | null;
}

/**
 * A baby shower: the parents-to-be (one or two names) celebrate the baby on its way with their family and friends.
 */
export interface BabyShowerContent extends BaseContent {
  kind: 'baby_shower';
  /** The parents-to-be, one or two names. */
  names: string[];
  families: string;
  /** The baby's name, if they picked one. */
  babyName: string | null;
  /** e.g. "Llega en marzo de 2027". */
  dueLabel: string | null;
  /** Who hosts the party, e.g. "Organizan con cariño" or "Abuelos maternos". */
  hosts: HonorGroup[];
  /** The "lluvia de pañales": a note and the size asked of each group of guests; null without either. */
  diapers: { note: string | null; sizes: DiaperSize[] } | null;
}

export type InvitationContent = WeddingContent | BirthdayContent | XvContent | BaptismContent | GenderRevealContent | BabyShowerContent;
