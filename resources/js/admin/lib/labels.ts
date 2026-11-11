import type {
    InvitationKind,
    InvitationStatus,
    OrderStatus,
    PaymentMethod,
    PlanFeature,
} from '@/types';

export const planFeatureLabels: Record<PlanFeature, string> = {
    guest_management: 'Lista de invitados',
    online_rsvp: 'Confirmaciones en línea',
    print_card: 'Tarjeta imprimible',
    guest_passes: 'Pases imprimibles',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
    quoted: 'Cotizada',
    active: 'Activa',
    delivered: 'Entregada',
    archived: 'Archivada',
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    other: 'Otro',
};

export const invitationKindLabels: Record<InvitationKind, string> = {
    wedding: 'Boda',
    birthday: 'Cumpleaños',
    xv: 'XV años',
};

export const invitationStatusLabels: Record<InvitationStatus, string> = {
    draft: 'Borrador',
    published: 'Publicada',
    archived: 'Archivada',
};
