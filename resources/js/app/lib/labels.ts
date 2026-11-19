import type {
    InvitationKind,
    InvitationStatus,
    OrderSource,
    OrderStatus,
    PaymentMethod,
    PlanFeature,
} from '@/types';

export const planFeatureLabels: Record<PlanFeature, string> = {
    guest_management: 'Lista de invitados',
    online_rsvp: 'Confirmaciones en línea',
    print_card: 'Tarjeta imprimible',
    guest_passes: 'Pases imprimibles',
    custom_design: 'Diseño personalizado',
    check_in: 'Registro de llegadas',
    live_gallery: 'Galería en vivo',
    wishes: 'Libro de buenos deseos',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
    quoted: 'Cotizada',
    active: 'Activa',
    delivered: 'Entregada',
    archived: 'Archivada',
};

export const orderSourceLabels: Record<OrderSource, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    pinterest: 'Pinterest',
    google: 'Google',
    invitation: 'Vio una invitación',
    referral: 'Recomendación de un cliente',
    partner: 'Recomendación de un proveedor',
    other: 'Otro',
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
    baptism: 'Bautizo',
    gender_reveal: 'Revelación de género',
};

export const invitationStatusLabels: Record<InvitationStatus, string> = {
    draft: 'Borrador',
    published: 'Publicada',
    archived: 'Archivada',
};
