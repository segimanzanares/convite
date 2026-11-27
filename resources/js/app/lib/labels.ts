import type {
    CommissionStatus,
    InvitationKind,
    InvitationStatus,
    OrderSource,
    OrderStatus,
    PartnerKind,
    PaymentMethod,
    PlanFeature,
    PlanType,
} from '@/types';

export const planTypeLabels: Record<PlanType, string> = {
    web_invitation: 'Invitación web',
    video_invitation: 'Invitación en video',
    tribute_video: 'Video semblanza',
    printables: 'Tarjeta y pases imprimibles',
};

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
    partner: 'Recomendación de un aliado o proveedor',
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
    baby_shower: 'Baby shower',
};

export const invitationStatusLabels: Record<InvitationStatus, string> = {
    draft: 'Borrador',
    published: 'Publicada',
    archived: 'Archivada',
};

export const partnerKindLabels: Record<PartnerKind, string> = {
    wedding_planner: 'Wedding planner',
    influencer: 'Influencer',
    venue: 'Salón o jardín',
    photographer: 'Fotógrafo',
    other: 'Otro',
};

export const commissionStatusLabels: Record<CommissionStatus, string> = {
    pending: 'Pendiente de pago del cliente',
    earned: 'Por pagar',
    paid: 'Pagada',
};
