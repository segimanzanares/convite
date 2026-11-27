import { Head } from '@inertiajs/react';
import { ArrowRight, Check, Clock, Sparkles } from 'lucide-react';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { DELIVERY_TIME, getServices } from '@/lib/services';
import type { Service, ServiceOption } from '@/lib/services';
import type { OfferedPlan } from '@/types';
import { cn } from '@/lib/utils';
import { Cta } from './components/cta';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { FallingPetals } from './components/illustrations/decorations';
import { DesignIllustration } from './components/illustrations/feature-illustrations';
import { ServiceIllustration } from './components/illustrations/service-illustrations';
import { Reveal } from './components/reveal';
import { Highlight } from './components/section-heading';
import { SectionLink } from './components/section-link';
import { useWhatsappLeadTracking, useWhatsappLink } from './use-whatsapp-link';

/** The tint behind each service's illustration, by its id. */
const TINTS: Record<string, string> = {
    'video-semblanza': 'bg-linear-to-br from-rose-light/45 to-gold-pale',
    'invitacion-en-video': 'bg-linear-to-br from-teal-light/40 to-cream',
    imprimibles: 'bg-linear-to-br from-gold-pale to-terracotta-light/40',
};

/** The options' grid for each number of options, so none is left alone on a row. */
const OPTION_GRIDS: Record<number, string> = {
    1: 'max-w-sm',
    2: 'max-w-3xl sm:grid-cols-2',
    3: 'max-w-5xl md:grid-cols-3',
};


function Eyebrow({ children }: { children: string }) {
    return (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-pale/60 px-3 py-1 text-xs font-medium text-gold-deep">
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {children}
        </span>
    );
}

function Hero({ services }: { services: Service[] }) {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-cream to-background px-4 pt-36 pb-16 sm:px-6 md:pt-44 md:pb-20">
            <FallingPetals />
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-24 -left-20 size-80 rounded-full bg-rose-light/40 blur-[100px]" />
                <div className="absolute top-10 -right-24 size-80 rounded-full bg-gold-pale blur-[100px]" />
            </div>
            <Reveal className="relative mx-auto max-w-3xl text-center">
                <Eyebrow>Servicios</Eyebrow>
                <h1 className="text-[clamp(36px,5.6vw,64px)] leading-[1.05] font-semibold tracking-tight text-balance">
                    Todo para su evento, además de la <Highlight>invitación</Highlight>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
                    Videos que cuentan su historia o invitan con música, y tarjetas y pases con un diseño hecho para su evento,
                    listos para imprimir.
                </p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm shadow-xs ring-1 ring-border">
                    <Clock className="size-4 text-gold-deep" /> Entrega en {DELIVERY_TIME}
                </p>
                <nav aria-label="Servicios" className="mt-8 flex flex-wrap justify-center gap-2">
                    {[{ id: 'invitaciones', title: 'Invitaciones digitales' }, ...services].map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                        >
                            {link.title}
                        </a>
                    ))}
                </nav>
            </Reveal>
        </section>
    );
}

/** The digital invitations, the main service, presented on the landing page. */
function Invitations() {
    return (
        <section id="invitaciones" className="scroll-mt-28 px-4 py-16 sm:px-6 md:py-20">
            <Reveal className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm md:grid-cols-2 md:p-10">
                <div className="relative h-60 overflow-hidden rounded-3xl bg-linear-to-br from-gold-pale to-rose-light/40" aria-hidden="true">
                    <DesignIllustration />
                </div>
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Invitaciones digitales</h2>
                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                        Nuestro servicio principal: una invitación con su propio enlace, cuenta regresiva, música, ubicación y
                        confirmación de asistencia, lista para compartir por WhatsApp. Elijan un diseño del catálogo o pidan uno
                        exclusivo.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Button asChild size="lg" className="rounded-full">
                            <SectionLink href="#planes">
                                Ver planes y precios <ArrowRight />
                            </SectionLink>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full">
                            <SectionLink href="#disenos">Ver diseños</SectionLink>
                        </Button>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

function Checklist({ items, isFeatured = false }: { items: string[]; isFeatured?: boolean }) {
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

function OptionCard({ service, option }: { service: Service; option: ServiceOption }) {
    const whatsappLink = useWhatsappLink();
    const isFeatured = option.isFeatured ?? false;
    const message = service.options.length > 1 ? `${service.whatsappMessage} ${option.name}.` : service.whatsappMessage;

    return (
        <div
            className={cn(
                'relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1',
                isFeatured ? 'border-primary bg-primary text-white shadow-[0_30px_60px_-20px_rgba(42,26,43,0.6)]' : 'bg-card shadow-sm hover:shadow-lg',
            )}
        >
            {isFeatured && (
                <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink shadow">
                    <Sparkles className="size-3" /> Recomendado
                </span>
            )}
            <h3 className={cn('text-lg font-semibold', isFeatured ? 'text-gold-light' : 'text-primary')}>{option.name}</h3>
            <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{formatPrice(option.price)}</span>
                <span className={cn('text-sm', isFeatured ? 'text-white/60' : 'text-muted-foreground')}>MXN</span>
            </p>
            {option.priceNote && (
                <p className={cn('mt-1 text-xs', isFeatured ? 'text-white/60' : 'text-muted-foreground')}>{option.priceNote}</p>
            )}
            <div className={cn('my-6 h-px', isFeatured ? 'bg-white/15' : 'bg-border')} />
            <Checklist items={option.details} isFeatured={isFeatured} />
            <div className="mt-auto pt-8">
                <Button
                    asChild
                    size="lg"
                    variant={isFeatured ? 'default' : 'outline'}
                    className={cn('h-11 w-full rounded-full', isFeatured && 'bg-gold text-ink hover:bg-gold-light')}
                >
                    <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                        Lo quiero
                    </a>
                </Button>
            </div>
        </div>
    );
}

function ServiceSection({ service, index }: { service: Service; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <section id={service.id} className={cn('scroll-mt-28 py-20 md:py-28', isEven && 'bg-cream/70')}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
                    <Reveal className={cn('min-w-0', !isEven && 'md:order-2')}>
                        <div className={cn('relative h-72 overflow-hidden rounded-3xl border shadow-sm', TINTS[service.id])} aria-hidden="true">
                            <ServiceIllustration id={service.id} />
                        </div>
                    </Reveal>
                    <Reveal delay={100} className="min-w-0">
                        <h2 className="text-[clamp(30px,4vw,44px)] leading-[1.1] font-semibold tracking-tight text-balance">{service.title}</h2>
                        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{service.description}</p>
                        <p className="mt-6 mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">Qué necesitamos de ustedes</p>
                        <Checklist items={service.needs} />
                        <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-deep">
                            <Clock className="size-4" /> Entrega en {DELIVERY_TIME}
                        </p>
                    </Reveal>
                </div>
                <div
                    className={cn('mx-auto mt-14 grid items-stretch gap-6', OPTION_GRIDS[service.options.length] ?? OPTION_GRIDS[3])}
                >
                    {service.options.map((option, optionIndex) => (
                        <Reveal key={option.name} delay={optionIndex * 100} className="h-full">
                            <OptionCard service={service} option={option} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ServicesPage({ servicePlans }: { servicePlans: OfferedPlan[] }) {
    useWhatsappLeadTracking();
    const services = getServices(servicePlans);

    return (
        <div className="bg-background text-foreground">
            <Head title="Video semblanza, invitación en video e imprimibles" />
            <Header />
            <main>
                <Hero services={services} />
                <Invitations />
                {services.map((service, index) => (
                    <ServiceSection key={service.id} service={service} index={index} />
                ))}
                <Cta />
            </main>
            <Footer />
            {/* Google Analytics only measures the public pages (see use-google-analytics) */}
            <CookieConsentBanner />
        </div>
    );
}

export default ServicesPage;
