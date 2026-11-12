import { SectionHeading } from './section-heading';
import { Reveal } from './reveal';
import { buildWhatsappUrl } from '@/lib/contact';
import type { OfferedPlan, PlanFeature } from '@/types/plan';
import { formatPrice } from '@/lib/format';
import { ACCENT_CLASSES, type Accent } from './accents';

const ACCENTS: Accent[] = ['gold', 'terracotta', 'rose', 'teal'];

const FEATURE_LABELS: Record<PlanFeature | 'catalog_design', string> = {
    catalog_design: 'Invitación digital con un diseño de nuestro catálogo',
    guest_management: 'Lista de invitados con enlaces personalizados',
    online_rsvp: 'Confirmaciones en línea en tu panel',
    print_card: 'Tarjeta imprimible',
    guest_passes: 'Pases imprimibles para tus invitados',
    custom_design: 'Diseño exclusivo creado para su evento',
    check_in: 'Registro de llegadas escaneando el QR de cada pase',
};

/** Sections every template shows, whatever the plan. */
const INVITATION_SECTIONS = ['Cuenta regresiva', 'Ubicación con mapa', 'Código de vestimenta', 'Música de fondo'];

/** Sections only some catalog templates have; a custom design includes the ones the event needs. */
const OPTIONAL_SECTIONS = {
    catalog: 'Programa, galería de fotos y mesa de regalos, según el diseño',
    custom: 'Programa, galería de fotos, mesa de regalos y las secciones que pida su evento',
};

function Checklist({ items, markClassName, className }: { items: string[]; markClassName: string; className: string }) {
    return (
        <ul className={`space-y-2 text-[14px] font-light text-[#4a3820] ${className}`}>
            {items.map((item) => (
                <li key={item} className="flex gap-2">
                    <span className={markClassName} aria-hidden="true">
                        ✓
                    </span>
                    {item}
                </li>
            ))}
        </ul>
    );
}

export function Pricing({ plans }: { plans: OfferedPlan[] }) {
    if (plans.length === 0) {
        return null;
    }

    return (
        <section id="planes" className="max-w-[1100px] mx-auto px-8 pb-[120px]">
            <Reveal className="text-center mb-16">
                <SectionHeading eyebrow="Planes" title="Elijan el suyo" />
            </Reveal>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
                {plans.map((plan, index) => {
                    const accent = ACCENT_CLASSES[ACCENTS[index % ACCENTS.length]];
                    const whatsappUrl = buildWhatsappUrl(`Hola 👋 Me interesa el plan ${plan.name} para mi evento.`);
                    const includes = [
                        FEATURE_LABELS[plan.features.includes('custom_design') ? 'custom_design' : 'catalog_design'],
                        plan.features.includes('online_rsvp') ? null : 'Confirmación de asistencia por WhatsApp',
                        plan.max_guests
                            ? `Hasta ${plan.max_guests} invitaciones personalizadas`
                            : plan.features.includes('guest_management')
                                ? 'Invitaciones personalizadas sin límite'
                                : null,
                        ...plan.features.filter((feature) => feature !== 'custom_design').map((feature) => FEATURE_LABELS[feature]),
                    ].filter((item): item is string => item !== null);
                    const sections = [
                        ...INVITATION_SECTIONS,
                        OPTIONAL_SECTIONS[plan.features.includes('custom_design') ? 'custom' : 'catalog'],
                    ];

                    return (
                        <Reveal key={plan.id}>
                            <div
                                className={`h-full flex flex-col border ${accent.border} py-10 px-7 bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))]`}
                            >
                                <h3 className={`font-jost text-sm tracking-[0.2em] uppercase mb-4 ${accent.text}`}>{plan.name}</h3>
                                <p className="font-display text-4xl text-primary mb-1">{formatPrice(plan.price)}</p>
                                <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-primary/60 mb-6">pesos, pago único</p>
                                {plan.description && (
                                    <p className="text-[15px] font-light leading-[1.8] text-[#4a3820] mb-6">{plan.description}</p>
                                )}
                                <Checklist items={includes} markClassName={accent.text} className="mb-6" />
                                <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-primary/60 mb-3">
                                    Secciones de la invitación
                                </p>
                                <Checklist items={sections} markClassName={accent.text} className="mb-8" />
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto text-center font-jost text-[11px] tracking-[0.3em] uppercase text-primary border border-primary/40 py-4 px-6 transition-colors duration-200 hover:bg-primary/5"
                                >
                                    Lo quiero
                                </a>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
