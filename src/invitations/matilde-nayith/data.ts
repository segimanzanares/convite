import type {
  ColorSwatchData,
  CoupleInfo,
  DetailCardData,
  GalleryImage,
  Venue,
} from '../../types/wedding';

const publicPath = (file: string) => `${import.meta.env.BASE_URL}invitations/matilde-nayith/${file}`;

export const COUPLE: CoupleInfo = {
  names: ['Matilde', 'Nayith'],
  weddingDateTime: '2026-11-21T17:00:00',
  dateLabel: 'Sábado · 21 de noviembre · 2026',
  year: '2026',
  families: 'La Familia López & La Familia Pérez',
  rsvpDeadlineLabel: '1 de noviembre de 2026',
  footerDateLabel: '21 · XI · 2026',
  rsvpWhatsappNumber: '521234567890',
  musicFile: publicPath('music.mp3'),
};

export const EVENT_DETAILS: DetailCardData[] = [
  {
    icon: '⛪',
    label: 'Ceremonia Religiosa',
    title: 'Parroquia de la Soledad',
    lines: ['Calle Fundadores SN', 'Puerto Escondido, Oax.'],
    time: '15:00 HRS',
  },
  {
    icon: '🥂',
    label: 'Recepción & Banquete',
    title: 'Salón De Fiestas',
    lines: ['Av. Hidalgo S/N', 'Col. Centro, Puerto Escondido, Oax.'],
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
    name: 'Salón De Fiestas',
    addressLines: ['Av. Hidalgo S/N', 'Col. Centro, Puerto Escondido, Oax.'],
    time: '16:00 hrs',
    mapEmbedUrl:
      'https://www.google.com/maps?q=15.862436,-97.071639&z=15&output=embed',
    mapTitle: 'Salón De Fiestas — Recepción',
    directionsUrl: 'https://www.google.com/maps/dir//15.8624356,-97.0716393/@15.8624698,-97.0712048,133m/data=!3m1!1e3!4m2!4m1!3e0?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
  },
];

const imagePath = (file: string) => publicPath(`images/${file}`);

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: imagePath('01.jpg'), alt: 'Foto1', caption: 'El comienzo' },
  { src: imagePath('03.jpg'), alt: 'Foto3', caption: 'Para siempre' },
  { src: imagePath('04.jpg'), alt: 'Foto4', caption: 'Nuestra historia' },
  { src: imagePath('06.jpg'), alt: 'Foto5', caption: 'Siempre juntos' },
  { src: imagePath('07.jpg'), alt: 'Foto7', caption: 'Momentos' },
  { src: imagePath('08.jpg'), alt: 'Foto8', caption: 'Bellos' },
  { src: imagePath('09.jpg'), alt: 'Foto9', caption: 'Selfie' },
  { src: imagePath('10.jpg'), alt: 'Foto10', caption: 'Sin filtros' },
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
