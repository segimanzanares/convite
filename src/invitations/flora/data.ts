import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CelebrantInfo } from '../../types/birthday';
import type {
  ColorSwatchData,
  DetailCardData,
  GalleryImage,
  Venue,
} from '../../types/wedding';

// TODO: placeholder data — replace date, venues, photos and contact with the real ones.

const publicPath = (file: string) => `${import.meta.env.BASE_URL}invitations/flora/${file}`;

const eventDate = new Date(2026, 10, 21, 13, 0);

export const CELEBRANT: CelebrantInfo = {
  name: 'Lucila Santos',
  firstName: 'Lucila',
  age: 76,
  eventDateTime: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"),
  dateLabel: format(eventDate, "EEEE '·' dd 'de' MMMM '·' yyyy", { locale: es }),
  hosts: 'Con cariño, sus hijos, nietos y bisnietos',
  rsvpDeadlineLabel: format(subDays(eventDate, 14), "dd 'de' MMMM 'de' yyyy", { locale: es }),
  footerDateLabel: format(eventDate, "dd '·' MM '·' yyyy"),
  rsvpWhatsappNumber: '521234567890',
};

export const EVENT_DETAILS: DetailCardData[] = [
  {
    icon: '🕊️',
    label: 'Misa de Acción de Gracias',
    title: 'Parroquia de San Juan',
    lines: ['Plaza Hidalgo 1', 'Col. Centro, Coyoacán, CDMX'],
    time: '13:00 HRS',
  },
  {
    icon: '🥂',
    label: 'Comida & Celebración',
    title: 'Jardín Las Bugambilias',
    lines: ['Calle de las Flores 76', 'Col. Del Carmen, Coyoacán, CDMX'],
    time: '15:00 HRS',
  },
  {
    icon: '🌸',
    label: 'Dresscode',
    title: 'Formal de Día',
    lines: ['Te sugerimos vestir en tonos suaves y florales.'],
    note: 'Evitar el color blanco.',
  },
];

export const VENUES: Venue[] = [
  {
    icon: '🕊️',
    tag: 'Misa de acción de gracias',
    name: 'Parroquia de San Juan',
    addressLines: ['Plaza Hidalgo 1', 'Col. Centro, Coyoacán, CDMX'],
    time: '13:00 hrs',
    mapEmbedUrl: 'https://www.google.com/maps?q=19.349660,-99.162170&z=16&output=embed',
    mapTitle: 'Parroquia de San Juan — Misa',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=19.349660,-99.162170',
  },
  {
    icon: '🥂',
    tag: 'Comida & Celebración',
    name: 'Jardín Las Bugambilias',
    addressLines: ['Calle de las Flores 76', 'Col. Del Carmen, Coyoacán, CDMX'],
    time: '15:00 hrs',
    mapEmbedUrl: 'https://www.google.com/maps?q=19.352900,-99.160500&z=16&output=embed',
    mapTitle: 'Jardín Las Bugambilias — Celebración',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=19.352900,-99.160500',
  },
];

const imagePath = (file: string) => publicPath(`images/${file}`);

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: imagePath('01.jpeg'), alt: 'Foto 1', caption: 'Sus primeros años' },
  { src: imagePath('02.jpeg'), alt: 'Foto 2', caption: 'Juventud' },
  { src: imagePath('03.jpeg'), alt: 'Foto 3', caption: 'Su gran amor' },
  { src: imagePath('04.jpeg'), alt: 'Foto 4', caption: 'Mamá' },
  { src: imagePath('05.jpeg'), alt: 'Foto 5', caption: 'La familia crece' },
  { src: imagePath('06.jpeg'), alt: 'Foto 6', caption: 'Abuela' },
  { src: imagePath('07.jpeg'), alt: 'Foto 7', caption: 'Momentos' },
  { src: imagePath('08.jpeg'), alt: 'Foto 8', caption: 'Hoy' },
];

export const DRESS_CODE_SWATCHES: ColorSwatchData[] = [
  { hex: '#E8C4CC', label: 'Rosa Palo' },
  { hex: '#B98AA0', label: 'Malva' },
  { hex: '#B7A7C9', label: 'Lavanda' },
  { hex: '#EBC2A8', label: 'Durazno' },
  { hex: '#9FB49A', label: 'Salvia' },
  { hex: '#E6D3B3', label: 'Champagne' },
];
