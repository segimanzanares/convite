/**
 * The services Convite offers besides the digital invitations, shown on the services page and summed up on the
 * landing page. Their prices are not in the database, since they are not plans and orders do not record them: they
 * come from .env (VITE_PRICE_*), with the defaults below.
 */

import { formatPrice } from './format';

export type ServiceOption = {
    name: string;
    price: number;
    /** What the price covers, shown under it (e.g. how many passes it includes). */
    priceNote?: string;
    details: string[];
    /** Stands out as the recommended option. */
    isFeatured?: boolean;
};

export type Service = {
    /** The anchor of its section on the services page. */
    id: string;
    title: string;
    /** One line for the landing page's summary. */
    summary: string;
    description: string;
    /** What the client sends to get started. */
    needs: string[];
    options: ServiceOption[];
    /** The message prefilled in WhatsApp, followed by the chosen option's name when there are several. */
    whatsappMessage: string;
};

export const DELIVERY_TIME = '2 a 5 días hábiles';

/**
 * A price (or amount) set in .env, or the given default when it is missing or not a positive number. Vite inlines the
 * variables at build time, so changing one takes a new build.
 */
function envNumber(value: string | undefined, fallback: number): number {
    const number = Number(value?.trim());

    return value?.trim() && Number.isFinite(number) && number > 0 ? number : fallback;
}

const TRIBUTE_VIDEO_PRICE = envNumber(import.meta.env.VITE_PRICE_TRIBUTE_VIDEO, 599);
const TRIBUTE_VIDEO_PREMIUM_PRICE = envNumber(import.meta.env.VITE_PRICE_TRIBUTE_VIDEO_PREMIUM, 999);
const VIDEO_INVITATION_PRICE = envNumber(import.meta.env.VITE_PRICE_VIDEO_INVITATION, 499);
const CARD_PRICE = envNumber(import.meta.env.VITE_PRICE_CARD, 299);
const PASSES_PRICE = envNumber(import.meta.env.VITE_PRICE_PASSES, 249);
const CARD_AND_PASSES_PRICE = envNumber(import.meta.env.VITE_PRICE_CARD_AND_PASSES, 469);
/** The passes are made one per guest, so their price covers up to this many and grows by blocks of the same size. */
const PASSES_INCLUDED = envNumber(import.meta.env.VITE_PASSES_INCLUDED, 50);
const EXTRA_PASSES_PRICE = envNumber(import.meta.env.VITE_PRICE_EXTRA_PASSES, 99);

const CARD_AND_PASSES_SAVING = CARD_PRICE + PASSES_PRICE - CARD_AND_PASSES_PRICE;

const PASSES_NOTE = `Incluye hasta ${PASSES_INCLUDED} pases`;
const EXTRA_PASSES_DETAIL = `+${formatPrice(EXTRA_PASSES_PRICE)} por cada ${PASSES_INCLUDED} pases adicionales`;

const TRIBUTE_VIDEO_OPTIONS: ServiceOption[] = [
    {
        name: 'Esencial',
        price: TRIBUTE_VIDEO_PRICE,
        details: ['Duración de hasta 3 minutos', 'Sus fotos con transiciones y su canción de fondo'],
    },
    {
        name: 'Premium',
        price: TRIBUTE_VIDEO_PREMIUM_PRICE,
        details: ['Duración de 3 a 5 minutos', 'Fotos sincronizadas con el ritmo de la música'],
        isFeatured: true,
    },
];

export const SERVICES: Service[] = [
    {
        id: 'video-semblanza',
        title: 'Video semblanza',
        summary: 'Su historia en fotos y música, para proyectar en la fiesta.',
        description:
            'Un recorrido por su historia, de las primeras fotos al gran día, con su canción favorita. Ideal para proyectarlo en la recepción y emocionar a todos sus invitados.',
        needs: ['Sus fotos favoritas, de preferencia en orden', 'La canción que quieran de fondo', 'Frases o fechas que quieran incluir'],
        options: TRIBUTE_VIDEO_OPTIONS,
        whatsappMessage: 'Hola 👋 Me interesa una video semblanza para mi evento, opción',
    },
    {
        id: 'invitacion-en-video',
        title: 'Invitación en video',
        summary: 'Un video con los datos de su evento, listo para enviar por WhatsApp.',
        description:
            'Su invitación convertida en un video animado con sus fotos, música y los datos del evento. Se comparte por WhatsApp o redes y se reproduce al momento, sin abrir ningún enlace.',
        needs: ['Nombres, fecha, hora y lugares del evento', 'Algunas fotos', 'La canción que quieran de fondo'],
        options: [
            {
                name: 'Invitación en video',
                price: VIDEO_INVITATION_PRICE,
                details: ['Sus fotos, su canción y los datos del evento', 'Lista para enviar por WhatsApp o redes'],
            },
        ],
        whatsappMessage: 'Hola 👋 Me interesa una invitación en video para mi evento.',
    },
    {
        id: 'imprimibles',
        title: 'Tarjeta y pases imprimibles',
        summary: 'Diseño personalizado, listo para imprimir y entregar en mano.',
        description:
            'Una tarjeta y pases de invitación con un diseño hecho a la medida de su evento, distinto al que incluyen los planes de invitación digital. Nosotros preparamos el pase de cada invitado y los reciben en PDF, listos para imprimir.',
        needs: [
            'Nombres, fecha, hora y lugares del evento',
            'Los colores o el estilo que imaginan',
            'Para los pases, su lista de invitados con los lugares de cada uno',
        ],
        options: [
            {
                name: 'Tarjeta',
                price: CARD_PRICE,
                details: ['Diseño personalizado de la tarjeta', 'En PDF, lista para imprimir'],
            },
            {
                name: 'Pases',
                price: PASSES_PRICE,
                priceNote: PASSES_NOTE,
                details: ['Un pase por invitado, con su nombre y sus lugares', 'En PDF, listos para imprimir', EXTRA_PASSES_DETAIL],
            },
            {
                name: 'Tarjeta + pases',
                price: CARD_AND_PASSES_PRICE,
                priceNote: PASSES_NOTE,
                details: [
                    'La tarjeta y los pases con el mismo diseño',
                    'Un pase por invitado, con su nombre y sus lugares',
                    EXTRA_PASSES_DETAIL,
                    ...(CARD_AND_PASSES_SAVING > 0 ? [`Ahorran ${formatPrice(CARD_AND_PASSES_SAVING)}`] : []),
                ],
                isFeatured: true,
            },
        ],
        whatsappMessage: 'Hola 👋 Me interesa el diseño personalizado imprimible para mi evento:',
    },
];

/** The lowest price of a service, for "desde" labels. */
export function lowestPrice(service: Service): number {
    return Math.min(...service.options.map((option) => option.price));
}
