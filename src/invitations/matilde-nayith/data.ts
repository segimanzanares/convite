import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  ColorSwatchData,
  CoupleInfo,
  DetailCardData,
  GalleryImage,
  Venue,
} from '../../types/wedding';

const publicPath = (file: string) => `${import.meta.env.BASE_URL}invitations/matilde-nayith/${file}`;

const eventDate = new Date(2026, 10, 21, 15, 0, 0);

export const COUPLE: CoupleInfo = {
  names: ['Matilde', 'Nayith'],
  weddingDateTime: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"),
  dateLabel: format(eventDate, "EEEE '·' dd 'de' MMMM '·' yyyy", { locale: es }),
  year: eventDate.getFullYear().toString(),
  families: 'La Familia González & La Familia Gallardo',
  rsvpDeadlineLabel: format(subDays(eventDate, 21), "dd 'de' MMMM 'de' yyyy", { locale: es }),
  footerDateLabel: format(eventDate, "dd '·' MM '·' yyyy"),
  rsvpWhatsappNumber: '523321852205',
  musicFile: publicPath('music.mp3'),
};

export const EVENT_DETAILS: DetailCardData[] = [
  {
    icon: '⛪',
    label: 'Ceremonia Religiosa',
    title: 'Parroquia de la Soledad',
    lines: ['Calle Fundadores S/N', 'Puerto Escondido, Oax.'],
    time: '15:00 HRS',
  },
  {
    icon: '🥂',
    label: 'Recepción & Banquete',
    title: 'Salón Nochetly',
    lines: ['Calle Ignacio Barrera S/N', 'Col. Aeropuerto, Puerto Escondido, Oax.'],
    time: '16:00 HRS',
  },
  {
    icon: '🌹',
    label: 'Dresscode',
    title: 'Vestimenta Formal',
    lines: ['Solicitamos a nuestros invitados vestimenta formal.'],
    note: 'Evitar el color blanco y el negro riguroso.',
  },
];

export const VENUES: Venue[] = [
  {
    icon: '⛪',
    tag: 'Ceremonia religiosa',
    name: 'Parroquia de la Soledad',
    addressLines: ['Calle Fundadores S/N', 'Puerto Escondido, Oax.'],
    time: '15:00 hrs',
    mapEmbedUrl:
      'https://www.google.com/maps?q=15.861208,-97.065710&z=15&output=embed',
    mapTitle: 'Parroquia de la Soledad — Ceremonia',
    directionsUrl: 'https://www.google.com/maps/dir//Parroquia+de+la+Virgen+de+la+Soledad,+Fundadores+205,+Centro,+71980+Puerto+Escondido,+Oax./@15.8611489,-97.0682913,1064m/data=!3m1!1e3!4m17!1m7!3m6!1s0x85b8f78ea8585f57:0xeb58d0f79a8faa6b!2sParroquia+de+la+Virgen+de+la+Soledad!8m2!3d15.8611489!4d-97.0657164!16s%2Fg%2F11g6bnwxbd!4m8!1m0!1m5!1m1!1s0x85b8f78ea8585f57:0xeb58d0f79a8faa6b!2m2!1d-97.0657164!2d15.8611489!3e0?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    icon: '🥂',
    tag: 'Recepción & Banquete',
    name: 'Salón Nochetly',
    addressLines: ['Calle Ignacio Barrera S/N', 'Col. Aeropuerto, Puerto Escondido, Oax.'],
    time: '16:00 hrs',
    mapEmbedUrl:
      'https://www.google.com/maps?q=15.881308,-97.080966&z=15&output=embed',
    mapTitle: 'Salón Nochetly — Recepción',
    directionsUrl: 'https://www.google.com/maps/dir//15.8813113,-97.0809648/@15.8813564,-97.0812249,266m/data=!3m1!1e3!4m2!4m1!3e0?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D',
  },
];

const imagePath = (file: string) => publicPath(`images/${file}`);

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: imagePath('01.jpeg'), alt: 'Foto1', caption: 'La sesión' },
  { src: imagePath('02.jpeg'), alt: 'Foto2', caption: 'La ternura' },
  { src: imagePath('03.jpeg'), alt: 'Foto3', caption: 'El amor' },
  { src: imagePath('04.jpeg'), alt: 'Foto4', caption: 'La complicidad' },
  { src: imagePath('05.jpeg'), alt: 'Foto5', caption: 'La emoción' },
  { src: imagePath('06.jpeg'), alt: 'Foto6', caption: 'Las miradas' },
  { src: imagePath('07.jpeg'), alt: 'Foto7', caption: 'La promesa' },
  { src: imagePath('08.jpeg'), alt: 'Foto8', caption: 'La alegría' },
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
