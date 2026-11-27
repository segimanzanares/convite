/**
 * The services Convite offers besides the digital invitations, shown on the services page and summed up on the
 * landing page. Each one is a plan type, and its options are the active plans of that type (their prices, notes and
 * details are edited in the panel); this file only holds each service's copy. A service without active plans is left
 * out.
 */

import type { OfferedPlan, PlanType } from '@/types';

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

type ServiceCopy = Omit<Service, 'options'> & { type: Exclude<PlanType, 'web_invitation'> };

/** The services in the order they are shown. */
const SERVICE_COPY: ServiceCopy[] = [
    {
        type: 'tribute_video',
        id: 'video-semblanza',
        title: 'Video semblanza',
        summary: 'Su historia en fotos y música, para proyectar en la fiesta.',
        description:
            'Un recorrido por su historia, de las primeras fotos al gran día, con su canción favorita. Ideal para proyectarlo en la recepción y emocionar a todos sus invitados.',
        needs: ['Sus fotos favoritas, de preferencia en orden', 'La canción que quieran de fondo', 'Frases o fechas que quieran incluir'],
        whatsappMessage: 'Hola 👋 Me interesa una video semblanza para mi evento, opción',
    },
    {
        type: 'video_invitation',
        id: 'invitacion-en-video',
        title: 'Invitación en video',
        summary: 'Un video con los datos de su evento, listo para enviar por WhatsApp.',
        description:
            'Su invitación convertida en un video animado con sus fotos, música y los datos del evento. Se comparte por WhatsApp o redes y se reproduce al momento, sin abrir ningún enlace.',
        needs: ['Nombres, fecha, hora y lugares del evento', 'Algunas fotos', 'La canción que quieran de fondo'],
        whatsappMessage: 'Hola 👋 Me interesa una invitación en video para mi evento.',
    },
    {
        type: 'printables',
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
        whatsappMessage: 'Hola 👋 Me interesa el diseño personalizado imprimible para mi evento:',
    },
];

/**
 * The services with their options, from the active plans of each type (as the server sends them, already in order).
 */
export function getServices(plans: OfferedPlan[]): Service[] {
    return SERVICE_COPY.map(({ type, ...service }) => ({
        ...service,
        options: plans
            .filter((plan) => plan.type === type)
            .map((plan) => ({
                name: plan.name,
                price: Number(plan.price),
                priceNote: plan.price_note ?? undefined,
                details: plan.details ?? [],
                isFeatured: plan.is_featured,
            })),
    })).filter((service) => service.options.length > 0);
}

/** The lowest price of a service, for "desde" labels. */
export function lowestPrice(service: Service): number {
    return Math.min(...service.options.map((option) => option.price));
}
