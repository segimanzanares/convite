import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWhatsappUrl } from '@/lib/contact';
import { formatPrice } from '@/lib/format';
import type { DemoInvitation } from '@/types/invitation';
import type { OfferedPlan } from '@/types/plan';
import { FallingPetals } from './illustrations/decorations';
import { HeroIllustration } from './illustrations/hero-illustration';
import { Highlight } from './section-heading';

/** The demo the hero's phone opens. */
const HERO_DEMO = 'boda-clasica';

export function Hero({ plans, demos }: { plans: OfferedPlan[]; demos: DemoInvitation[] }) {
    const whatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi evento.');
    const lowestPrice = plans.length > 0 ? Math.min(...plans.map((plan) => Number(plan.price))) : null;
    const heroDemoUrl = demos.find((demo) => demo.slug === HERO_DEMO)?.url ?? null;
    const highlights = [
        'Entrega en 3 a 5 días',
        '2 rondas de ajustes incluidas',
        ...(demos.length > 1 ? [`${demos.length} diseños para elegir`] : []),
    ];

    return (
        <section id="inicio" className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-gold-pale),var(--color-ivory)_65%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-primary)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)] bg-size-[56px_56px] opacity-[0.05]" />
                <div className="absolute -top-32 -left-24 size-[420px] rounded-full bg-gold/30 blur-[100px] motion-safe:animate-blob" />
                <div className="absolute top-40 -right-32 size-[380px] rounded-full bg-rose/20 blur-[110px] motion-safe:animate-blob [animation-delay:-6s]" />
                <div className="absolute bottom-0 left-1/3 size-[320px] rounded-full bg-teal/15 blur-[100px] motion-safe:animate-blob [animation-delay:-12s]" />
            </div>
            <FallingPetals />

            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-32 pb-20 sm:px-6 md:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
                <div className="text-center lg:text-left">
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 py-1 pr-3 pl-1 text-xs font-medium text-primary shadow-xs backdrop-blur">
                        <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-white">
                            <Sparkles className="size-3" /> Nuevo
                        </span>
                        Libro de buenos deseos y galería en vivo
                    </span>
                    <h1 className="text-[clamp(40px,6.4vw,72px)] leading-[1.02] font-semibold tracking-tight text-balance text-foreground">
                        La invitación que su evento <Highlight><span className="text-[1.3em] leading-none">merece</span></Highlight>
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground lg:mx-0">
                        Bodas, XV años, bautizos y cumpleaños. Elijan un diseño de nuestro catálogo o pidan uno exclusivo;
                        nosotros lo llenamos con su historia y sus fotos, y queda listo para compartir por WhatsApp.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                        <Button
                            asChild
                            size="lg"
                            className="group h-12 rounded-full px-7 text-base shadow-[0_14px_30px_-12px_rgba(42,26,43,0.7)] transition-transform hover:-translate-y-0.5"
                        >
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                Cotizar mi invitación
                                <ArrowRight className="transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-white/70 px-7 text-base backdrop-blur">
                            <a href="#disenos">Ver diseños de ejemplo</a>
                        </Button>
                    </div>

                    {lowestPrice !== null && (
                        <p className="mt-5 text-sm text-muted-foreground">
                            Desde{' '}
                            <a href="#planes" className="font-semibold text-primary underline-offset-4 hover:underline">
                                {formatPrice(lowestPrice)} pesos
                            </a>
                            , pago único
                        </p>
                    )}

                    <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/80 lg:justify-start">
                        {highlights.map((highlight) => (
                            <li key={highlight} className="flex items-center gap-2">
                                <span className="flex size-5 items-center justify-center rounded-full bg-teal/15 text-teal">
                                    <Check className="size-3" strokeWidth={3} />
                                </span>
                                {highlight}
                            </li>
                        ))}
                    </ul>
                </div>

                <HeroIllustration href={heroDemoUrl} />
            </div>
        </section>
    );
}
