import { format, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  ColorSwatchData,
  CoupleInfo,
  DressCodeData,
  GalleryImage,
  GiftOption,
  ProgramItem,
  Venue,
} from '../../types/wedding';

const publicPath = (file: string) => `${import.meta.env.BASE_URL}invitations/demo/${file}`;
const imagePath = (file: string) => publicPath(`images/${file}`);

const eventDate = addDays(new Date(), 60);

export const COUPLE: CoupleInfo = {
  names: ['Mariana', 'Alejandro'],
  weddingDateTime: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"),
  dateLabel: format(eventDate, "EEEE '·' dd 'de' MMMM '·' yyyy", { locale: es }),
  year: eventDate.getFullYear().toString(),
  families: 'La Familia López & La Familia Pérez',
  rsvpDeadlineLabel: format(subDays(eventDate, 21), "dd 'de' MMMM 'de' yyyy", { locale: es }),
  footerDateLabel: format(eventDate, "dd '·' MM '·' yyyy"),
  rsvpWhatsappNumber: '521234567890',
  musicFile: publicPath('music.mp3'),
};

export const DRESS_CODE: DressCodeData = {
  type: 'Formal',
  description: 'Solicitamos a nuestros invitados vestimenta formal.',
  men: 'Traje',
  women: 'Vestido largo',
  reservedColor: {
    name: 'Blanco',
    hex: '#FFFFFF',
    description: 'está reservado para la novia, evita llevar ese color.',
  },
};

export const PROGRAM: ProgramItem[] = [
  {
    time: '13:00 hrs',
    icon: '⛪',
    title: 'Ceremonia religiosa',
    description: 'Acompañanos a unir nuestras vidas en la Parroquia de San Rafael Arcángel.',
  },
  {
    time: '14:30 hrs',
    icon: '🥂',
    title: 'Coctel de bienvenida',
    description: 'Recepción y brindis de honor en la Hacienda Los Almendros.',
  },
  {
    time: '15:30 hrs',
    icon: '🍽️',
    title: 'Banquete de bodas',
    description: 'Disfrutaremos de una comida especial para celebrar nuestro amor.',
  },
  {
    time: '17:00 hrs',
    icon: '💃',
    title: 'Primer baile',
    description: 'Apertura de pista con el tradicional baile de los novios.',
  },
  {
    time: '17:30 hrs',
    icon: '🎂',
    title: 'Corte de pastel',
    description: 'El momento dulce de la tarde y brindis con la familia.',
  },
  {
    time: '18:00 hrs',
    icon: '🪩',
    title: 'Fiesta y baile',
    description: 'Música, fiesta y mucha diversión hasta que el cuerpo aguante.',
  },
];

export const VENUES: Venue[] = [
  {
    icon: '⛪',
    tag: 'Ceremonia religiosa',
    name: 'Parroquia de San Rafael Arcángel',
    addressLines: ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'],
    time: '15:00 hrs',
    mapEmbedUrl:
      'https://www.google.com/maps?q=15.861208,-97.065710&z=15&output=embed',
    mapTitle: 'Parroquia de San Rafael Arcángel — Ceremonia',
    directionsUrl: 'https://www.google.com/maps/dir//15.861208,-97.065710',
    image: imagePath('catedral.jpg'),
  },
  {
    icon: '🥂',
    tag: 'Recepción & Banquete',
    name: 'Hacienda Los Almendros',
    addressLines: ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'],
    time: '16:00 hrs',
    mapEmbedUrl:
      'https://www.google.com/maps?q=15.862436,-97.071639&z=15&output=embed',
    mapTitle: 'Hacienda Los Almendros — Recepción',
    directionsUrl: 'https://www.google.com/maps/dir//15.862436,-97.071639',
    image: imagePath('salon.jpeg'),
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: imagePath('01.jpeg'), alt: 'Foto1', caption: 'El comienzo' },
  { src: imagePath('03.jpeg'), alt: 'Foto3', caption: 'Para siempre' },
  { src: imagePath('04.jpeg'), alt: 'Foto4', caption: 'Nuestra historia' },
  { src: imagePath('06.jpeg'), alt: 'Foto5', caption: 'Siempre juntos' },
  { src: imagePath('07.jpeg'), alt: 'Foto7', caption: 'Momentos' },
  { src: imagePath('08.jpeg'), alt: 'Foto8', caption: 'Bellos' },
  { src: imagePath('09.jpeg'), alt: 'Foto9', caption: 'Selfie' },
  { src: imagePath('10.jpeg'), alt: 'Foto10', caption: 'Sin filtros' },
];

export const DRESS_CODE_SWATCHES: ColorSwatchData[] = [
  { hex: '#D4B896', label: 'Champagne' },
  { hex: '#C8A882', label: 'Camel' },
  { hex: '#8B9E7A', label: 'Sage' },
  { hex: '#A0927E', label: 'Taupe' },
  { hex: '#B8B4A0', label: 'Gris Plata' },
  { hex: '#C9A84C', label: 'Dorado' },
  { hex: '#7A8FA0', label: 'Azul Pálido' },
  { hex: '#C4A0A0', label: 'Rosa Antiguo' },
];

export const GIFTS: GiftOption[] = [
  {
    kind: 'bank',
    title: 'Transferencia Bancaria',
    details: [
      { label: 'Banco', value: 'BBVA' },
      { label: 'Titular', value: 'Mariana López Pérez' },
      { label: 'Cuenta', value: '4189 1431 8018 4403' },
    ],
    copy: { value: '4189143180184403', label: 'Copiar número' },
  },
  {
    kind: 'registry',
    title: 'Mesa de Regalos',
    description: 'También pueden elegir un detalle de nuestra mesa de regalos.',
    details: [{ label: 'Número de evento', value: '51234567' }],
    link: { url: 'https://mesaderegalos.liverpool.com.mx/', label: 'Ver mesa de regalos' },
  },
];
