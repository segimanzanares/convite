import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWhatsappUrl } from '@/lib/contact';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { OfferedPlan, PlanFeature } from '@/types/plan';
import { Reveal } from './reveal';
import { Highlight, SectionHeading } from './section-heading';

const FEATURE_LABELS: Record<PlanFeature | 'catalog_design', string> = {
    catalog_design: 'Invitación digital con un diseño de nuestro catálogo',
    guest_management: 'Lista de invitados con enlaces personalizados',
    online_rsvp: 'Confirmaciones en línea en su panel',
    print_card: 'Tarjeta imprimible',
    guest_passes: 'Pases imprimibles para sus invitados',
    custom_design: 'Diseño exclusivo creado para su evento',
    check_in: 'Registro de llegadas escaneando el QR de cada pase',
    live_gallery: 'Galería en vivo: sus invitados suben fotos con un QR y se proyectan al momento',
};

/** Sections every template shows, whatever the plan. */
const INVITATION_SECTIONS = ['Cuenta regresiva', 'Ubicación con mapa', 'Código de vestimenta', 'Música de fondo'];

/** The grid's columns for each number of plans, so none is left alone on a row. */
const GRID_COLUMNS: Record<number, string> = {
    1: 'mx-auto max-w-md',
    2: 'mx-auto max-w-4xl md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 xl:grid-cols-4',
};

/** Sections only some catalog templates have; a custom design includes the ones the event needs. */
const OPTIONAL_SECTIONS = {
    catalog: 'Programa, galería de fotos y mesa de regalos, según el diseño',
    custom: 'Programa, galería de fotos, mesa de regalos y las secciones que pida su evento',
};

function Checklist({ items, isFeatured }: { items: string[]; isFeatured: boolean }) {
    return (
        <ul className="space-y-2.5 text-sm">
            {items.map((item) => (
                <li key={item} className="flex gap-2.5">
                    <span
                        className={cn(
                            'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full',
                            isFeatured ? 'bg-gold text-ink' : 'bg-primary/10 text-primary',
                        )}
                        aria-hidden="true"
                    >
                        <Check className="size-2.5" strokeWidth={3.5} />
                    </span>
                    <span className={isFeatured ? 'text-white/85' : 'text-foreground/80'}>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export function Pricing({ plans }: { plans: OfferedPlan[] }) {
    if (plans.length === 0) {
        return null;
    }

    // With three or more plans, the middle one stands out as the recommended
    const featuredIndex = plans.length >= 3 ? Math.floor(plans.length / 2) : -1;

    return (
        <section id="planes" className="relative mx-auto max-w-7xl scroll-mt-28 px-4 py-24 sm:px-6 md:py-32">
            <Reveal>
                <SectionHeading
                    eyebrow="Planes"
                    title={
                        <>
                            Elijan el <Highlight>suyo</Highlight>
                        </>
                    }
                    description="Pago único, sin mensualidades. Todos incluyen dos rondas de ajustes y su enlace listo para compartir."
                />
            </Reveal>
            <div className={cn('mt-14 grid items-stretch gap-6 xl:gap-5', GRID_COLUMNS[plans.length] ?? 'md:grid-cols-2 lg:grid-cols-3')}>
                {plans.map((plan, index) => {
                    const isFeatured = index === featuredIndex;
                    const whatsappUrl = buildWhatsappUrl(`Hola 👋 Me interesa el plan ${plan.name} para mi evento.`);
                    const includes = [
                        FEATURE_LABELS[plan.features.includes('custom_design') ? 'custom_design' : 'catalog_design'],
                        plan.features.includes('online_rsvp') ? null : 'Confirmación de asistencia por WhatsApp',
                        plan.max_guests
                            ? `Hasta ${plan.max_guests} invitaciones personalizadas${plan.max_seats_per_guest ? ` de hasta ${plan.max_seats_per_guest} personas` : ''}`
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
                        <Reveal key={plan.id} delay={index * 100} className="h-full">
                            <div
                                className={cn(
                                    'relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1',
                                    isFeatured
                                        ? 'border-primary bg-primary text-white shadow-[0_30px_60px_-20px_rgba(42,26,43,0.6)] xl:-my-4 xl:py-11'
                                        : 'bg-card shadow-sm hover:shadow-lg',
                                )}
                            >
                                {isFeatured && (
                                    <>
                                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
                                            <div className="absolute -top-20 -right-20 size-56 rounded-full bg-gold/25 blur-3xl motion-safe:animate-blob" />
                                        </div>
                                        <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink shadow">
                                            <Sparkles className="size-3" /> Recomendado
                                        </span>
                                    </>
                                )}
                                <div className="relative flex flex-1 flex-col">
                                    <h3 className={cn('text-lg font-semibold', isFeatured ? 'text-gold-light' : 'text-primary')}>
                                        {plan.name}
                                    </h3>
                                    <p className="mt-3 flex items-baseline gap-1.5">
                                        <span className="text-4xl font-semibold tracking-tight">{formatPrice(plan.price)}</span>
                                        <span className={cn('text-sm', isFeatured ? 'text-white/60' : 'text-muted-foreground')}>MXN</span>
                                    </p>
                                    <p className={cn('mt-1 text-xs', isFeatured ? 'text-white/60' : 'text-muted-foreground')}>pago único</p>
                                    {plan.description && (
                                        <p className={cn('mt-4 text-sm leading-relaxed', isFeatured ? 'text-white/75' : 'text-muted-foreground')}>
                                            {plan.description}
                                        </p>
                                    )}
                                    <div className={cn('my-6 h-px', isFeatured ? 'bg-white/15' : 'bg-border')} />
                                    <Checklist items={includes} isFeatured={isFeatured} />
                                    <p
                                        className={cn(
                                            'mt-6 mb-3 text-xs font-medium tracking-wider uppercase',
                                            isFeatured ? 'text-white/50' : 'text-muted-foreground',
                                        )}
                                    >
                                        Secciones de la invitación
                                    </p>
                                    <Checklist items={sections} isFeatured={isFeatured} />
                                    <div className="mt-auto pt-8">
                                        <Button
                                            asChild
                                            size="lg"
                                            variant={isFeatured ? 'default' : 'outline'}
                                            className={cn('h-11 w-full rounded-full', isFeatured && 'bg-gold text-ink hover:bg-gold-light')}
                                        >
                                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                                Lo quiero
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
