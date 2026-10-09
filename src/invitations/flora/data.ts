import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CelebrantInfo } from '../../types/birthday';
import type {
  ColorSwatchData,
  DetailCardData,
  GalleryImage,
  ProgramItem,
  Venue,
} from '../../types/wedding';

const publicPath = (file: string) => `${import.meta.env.BASE_URL}invitations/flora/${file}`;

const eventDate = new Date(2026, 10, 1, 16, 0);

export const CELEBRANT: CelebrantInfo = {
  name: 'Flora Santos',
  firstName: 'Flora',
  age: 76,
  eventDateTime: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"),
  dateLabel: format(eventDate, "EEEE '·' dd 'de' MMMM '·' yyyy", { locale: es }),
  hosts: 'Con cariño, sus hijos y nietos',
  rsvpDeadlineLabel: format(subDays(eventDate, 14), "dd 'de' MMMM 'de' yyyy", { locale: es }),
  footerDateLabel: format(eventDate, "dd '·' MM '·' yyyy"),
  rsvpWhatsappNumber: '529541621208',
  musicFile: publicPath('music.mp3'),
};

export const EVENT_DETAILS: DetailCardData[] = [
  {
    icon: '🥂',
    label: 'Comida & Celebración',
    title: 'Domicilio Particular',
    lines: ['Calle Guelatao S/N', 'Col. Sector Reforma C, Puerto Escondido, Oax.'],
    time: '16:00 HRS',
  },
  {
    icon: '🌸',
    label: 'Dresscode',
    title: 'Formal de Día',
    lines: ['Te sugerimos vestir en tonos suaves y florales.'],
    note: 'Evitar colores oscuros.',
  },
];

export const PROGRAM: ProgramItem[] = [
  {
    time: '16:00 hrs',
    icon: '🥂',
    title: 'Recepción',
    description: 'Bienvenida en su domicilio particular del Sector Reforma C.',
  },
  {
    time: '16:30 hrs',
    icon: '🍽️',
    title: 'Comida',
    description: 'Disfrutaremos juntos de una comida en familia.',
  },
  {
    time: '17:30 hrs',
    icon: '🎂',
    title: 'Pastel y mañanitas',
    description: 'Cantaremos juntos para celebrarla.',
  },
  {
    time: '18:00 hrs',
    icon: '🎶',
    title: 'Baile y convivencia',
    description: 'Música, baile y la mejor compañía hasta el anochecer.',
  },
];

export const VENUES: Venue[] = [
  {
    icon: '🥂',
    tag: 'Comida & Celebración',
    name: 'Domicilio Particular',
    addressLines: ['Calle Guelatao S/N', 'Col. Sector Reforma C, Puerto Escondido, Oax.'],
    time: '16:00 hrs',
    mapEmbedUrl: 'https://www.google.com/maps?q=15.871279,-97.064253&z=16&output=embed',
    mapTitle: 'Domicilio Particular — Celebración',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=15.871279,-97.064253',
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
