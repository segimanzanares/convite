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

export interface DetailCardData {
  icon: string;
  label: string;
  title: string;
  lines: string[];
  time?: string;
  note?: string;
  code?: string;
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
