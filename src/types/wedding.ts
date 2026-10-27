export interface CoupleInfo {
  names: [string, string];
  weddingDateTime: string;
  dateLabel: string;
  year: string;
  families: string;
  rsvpDeadlineLabel: string;
  footerDateLabel: string;
  rsvpWhatsappNumber: string;
  musicFile?: string;
}

export interface Venue {
  icon: string;
  tag: string;
  name: string;
  addressLines: string[];
  time: string;
  mapEmbedUrl: string;
  mapTitle: string;
  directionsUrl: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ColorSwatchData {
  hex: string;
  label: string;
}

export interface ProgramItem {
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface ReservedColor {
  name: string;
  /** Optional swatch shown next to the color name. */
  hex?: string;
  /** Text that follows the color name, e.g. "está reservado para la novia, evita llevar ese color." */
  description: string;
}

export interface DressCodeData {
  /** Attire type headline, e.g. "Formal", "Etiqueta rigurosa", "Cóctel". */
  type: string;
  description?: string;
  men?: string;
  women?: string;
  reservedColor?: ReservedColor;
}
