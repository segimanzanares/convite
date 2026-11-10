import { format, addDays, setHours, setMinutes, startOfDay, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CelebrantInfo } from '../../types/birthday';
import type {
  ColorSwatchData,
  DressCodeData,
  GalleryImage,
  GiftOption,
  ProgramItem,
  Venue,
} from '../../types/wedding';
import type { HonorGroup } from '../../components/xv/HonorSection';
import type { ChapterLink } from '../../components/xv/ChapterNav';
import type { XvPhoto } from '../../components/xv/ArchPhoto';

const publicPath = (file: string) => `${import.meta.env.BASE_URL}invitations/demo-xv/${file}`;
const imagePath = (file: string) => publicPath(`images/${file}`);
// The venue photos and the song are shared with the wedding demo.
const sharedDemoPath = (file: string) => `${import.meta.env.BASE_URL}invitations/demo/${file}`;

// Always two months ahead so the countdown never runs out on the demo;
// the time is the first event of the day (the mass).
const eventDate = setMinutes(setHours(startOfDay(addDays(new Date(), 60)), 17), 30);

export const CELEBRANT: CelebrantInfo = {
  name: 'Sofía Valentina',
  firstName: 'Sofía',
  age: 15,
  eventDateTime: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"),
  dateLabel: format(eventDate, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }),
  hosts: 'Con cariño, Sofía',
  rsvpDeadlineLabel: format(subDays(eventDate, 15), "dd 'de' MMMM 'de' yyyy", { locale: es }),
  footerDateLabel: format(eventDate, "dd '·' MM '·' yyyy"),
  rsvpWhatsappNumber: '521234567890',
  musicFile: sharedDemoPath('music.mp3'),
};

export const MONOGRAM = 'SV';
/** e.g. "05 · DIC · 2026" */
export const SHORT_DATE = format(eventDate, "dd '·' MMM '·' yyyy", { locale: es }).replace('.', '').toUpperCase();
/** e.g. "05.12.2026" */
export const DOTTED_DATE = format(eventDate, 'dd.MM.yyyy');
/** e.g. "Sábado · 09 enero 2027" */
export const CARD_DATE = format(eventDate, "EEEE '·' dd MMMM yyyy", { locale: es }).replace(/^./, (c) => c.toUpperCase());

/** Portrait for the hero; set `position` (e.g. '50% 20%') to keep the face in the crop. */
export const HERO_PHOTO: XvPhoto = { src: imagePath('portada.jpg'), alt: `Retrato de ${CELEBRANT.name}` };

export const CHAPTERS: ChapterLink[] = [
  { href: '#historia', label: 'Mi historia' },
  { href: '#celebracion', label: 'La celebración' },
  { href: '#galeria', label: 'Galería' },
  { href: '#deseos', label: 'Mis deseos' },
  { href: '#confirmar', label: 'Confirmar' },
];

export const STORY = {
  eyebrow: 'Capítulo XV · El comienzo',
  title: 'Un sueño que florece',
  opening: 'Érase una vez…',
  paragraphs: [
    'Una niña que soñaba con jardines llenos de luz, con música bajo las estrellas y con una noche en la que todas las personas que quiere estuvieran juntas. Hoy ese sueño está a punto de hacerse realidad.',
    'Cumplir quince años es cerrar el primer capítulo de mi historia y abrir uno nuevo, lleno de ilusiones. Cada uno de ustedes ha escrito una parte de este cuento, y no imagino esta página sin ustedes.',
    'Por eso quiero invitarte a vivir conmigo una noche en el jardín encantado, donde celebraremos, bailaremos y guardaremos recuerdos para siempre.',
  ],
  signature: 'Con cariño, Sofía',
  photo: { src: imagePath('historia.jpg'), alt: 'Sofía de niña' } satisfies XvPhoto,
};

export const PARENTS: HonorGroup = {
  role: 'Mis papás',
  names: ['Laura Méndez Ríos', 'Ricardo Salinas Ortega'],
};

export const GODPARENTS: HonorGroup[] = [
  { role: 'Padrinos de velación', names: ['Andrea Ruiz', 'Fernando Ruiz'] },
  { role: 'Padrinos de anillo', names: ['Mónica Torres', 'Daniel Herrera'] },
];

export const VENUES: Venue[] = [
  {
    icon: '⛪',
    tag: 'Misa de acción de gracias',
    name: 'Parroquia de San Rafael Arcángel',
    addressLines: ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'],
    time: '17:30 hrs',
    mapEmbedUrl: 'https://www.google.com/maps?q=15.861208,-97.065710&z=15&output=embed',
    mapTitle: 'Parroquia de San Rafael Arcángel — Misa',
    directionsUrl: 'https://www.google.com/maps/dir//15.861208,-97.065710',
    image: sharedDemoPath('images/catedral.jpg'),
  },
  {
    icon: '✨',
    tag: 'Recepción',
    name: 'Jardín Las Magnolias',
    addressLines: ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'],
    time: '19:00 hrs',
    mapEmbedUrl: 'https://www.google.com/maps?q=15.862436,-97.071639&z=15&output=embed',
    mapTitle: 'Jardín Las Magnolias — Recepción',
    directionsUrl: 'https://www.google.com/maps/dir//15.862436,-97.071639',
    image: sharedDemoPath('images/salon.jpeg'),
  },
];

export const PROGRAM: ProgramItem[] = [
  { time: '19:00 hrs', icon: '🥂', title: 'Recepción', description: 'Bienvenida entre faroles y flores blancas.' },
  { time: '20:00 hrs', icon: '👑', title: 'Mi entrada', description: 'El momento en que comienza el cuento.' },
  { time: '20:30 hrs', icon: '💃', title: 'Vals', description: 'Bailaré con mi papá y mis chambelanes.' },
  { time: '21:15 hrs', icon: '🍽️', title: 'Cena', description: 'Una cena especial bajo las estrellas.' },
  { time: '22:30 hrs', icon: '🎂', title: 'Brindis y pastel', description: 'Unas palabras, un brindis y un momento dulce.' },
  { time: '23:00 hrs', icon: '🪩', title: '¡A bailar!', description: 'Música y fiesta hasta que termine la noche.' },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: imagePath('01.svg'), alt: 'Foto 1', caption: 'Un sueño dorado' },
  { src: imagePath('02.svg'), alt: 'Foto 2', caption: 'Mis primeros pasos' },
  { src: imagePath('03.svg'), alt: 'Foto 3', caption: 'La magia está en los detalles' },
  { src: imagePath('04.svg'), alt: 'Foto 4', caption: 'Con mi familia' },
  { src: imagePath('05.svg'), alt: 'Foto 5', caption: 'Mis amigas' },
  { src: imagePath('06.svg'), alt: 'Foto 6', caption: 'Quince primaveras' },
  { src: imagePath('07.svg'), alt: 'Foto 7', caption: 'Lo que viene' },
];

export const DRESS_CODE: DressCodeData = {
  type: 'Formal',
  description: 'Te sugerimos vestir de gala, en tonos de jardín.',
  men: 'Traje',
  women: 'Vestido largo',
  reservedColor: {
    name: 'Verde esmeralda',
    hex: '#2F6B4F',
    description: 'está reservado para la quinceañera; te pedimos evitarlo.',
  },
};

export const DRESS_CODE_SWATCHES: ColorSwatchData[] = [
  { hex: '#8F9C7B', label: 'Salvia' },
  { hex: '#67754B', label: 'Oliva' },
  { hex: '#D9C796', label: 'Champagne' },
  { hex: '#B99A5A', label: 'Dorado' },
  { hex: '#E3D5C4', label: 'Arena' },
  { hex: '#C7B7D6', label: 'Lavanda' },
  { hex: '#E7C3BE', label: 'Rosa Polvo' },
  { hex: '#A9B8C6', label: 'Azul Niebla' },
];

export const GIFTS: GiftOption[] = [
  {
    kind: 'envelope',
    title: 'Lluvia de sobres',
    description: 'El día de la fiesta habrá un buzón a la entrada para tu sobre.',
  },
  {
    kind: 'bank',
    title: 'Transferencia',
    details: [
      { label: 'Banco', value: 'BBVA' },
      { label: 'Titular', value: 'Laura Méndez Ríos' },
      { label: 'Cuenta', value: '4189 1431 8018 4403' },
    ],
    copy: { value: '4189143180184403', label: 'Copiar número' },
  },
];
