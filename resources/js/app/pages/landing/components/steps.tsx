import { MessageCircleHeart, Palette, PencilLine, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkle } from './illustrations/decorations';
import { Reveal } from './reveal';
import { Highlight, SectionHeading } from './section-heading';

const STEPS = [
    {
        icon: MessageCircleHeart,
        color: 'from-gold to-gold-deep text-ink',
        title: 'Cuéntennos su historia',
        body: 'Elijan su plan y su diseño, y compártannos la fecha, el lugar y sus fotos.',
    },
    {
        icon: Palette,
        color: 'from-terracotta-light to-terracotta text-white',
        title: 'Preparamos su invitación',
        body: 'La armamos con su contenido y sus fotos, o creamos un diseño exclusivo si lo eligieron.',
    },
    {
        icon: PencilLine,
        color: 'from-rose-light to-rose text-white',
        title: 'Revisan y ajustan',
        body: 'Ven la invitación terminada y piden los cambios que necesiten antes de publicarla.',
    },
    {
        icon: Send,
        color: 'from-teal-light to-teal text-white',
        title: 'Comparten el enlace',
        body: 'Reciben un enlace propio, listo para enviar a sus invitados por WhatsApp.',
    },
];

export function Steps() {
    return (
        <section id="como-funciona" className="relative scroll-mt-28 overflow-hidden bg-primary py-24 text-white md:py-32">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-40 left-1/4 size-[420px] rounded-full bg-gold/15 blur-[120px] motion-safe:animate-blob" />
                <div className="absolute -right-20 -bottom-40 size-[420px] rounded-full bg-rose/20 blur-[120px] motion-safe:animate-blob [animation-delay:-9s]" />
                <Sparkle className="absolute top-20 left-[8%] w-4 text-gold/70" />
                <Sparkle className="absolute right-[12%] bottom-24 w-3 text-rose-light" style={{ animationDelay: '1.4s' }} />
            </div>
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <Reveal>
                    <SectionHeading
                        tone="dark"
                        eyebrow="Cómo funciona"
                        title={
                            <>
                                De la idea al enlace en <Highlight>4 pasos</Highlight>
                            </>
                        }
                        description="Ustedes nos cuentan, nosotros nos encargamos del resto."
                    />
                </Reveal>
                <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    <svg
                        className="absolute top-8 right-[12%] left-[12%] hidden h-px w-[76%] overflow-visible lg:block"
                        aria-hidden="true"
                    >
                        <line
                            x1="0"
                            y1="0"
                            x2="100%"
                            y2="0"
                            stroke="var(--color-gold)"
                            strokeOpacity="0.5"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            className="motion-safe:animate-dash"
                        />
                    </svg>
                    {STEPS.map((step, index) => (
                        <Reveal key={step.title} delay={index * 120} className="relative text-center">
                            <div className="relative mx-auto mb-6 size-16">
                                <span
                                    className="absolute inset-0 rounded-2xl bg-white/20 motion-safe:animate-ping motion-safe:[animation-duration:3s]"
                                    style={{ animationDelay: `${index * 0.75}s` }}
                                />
                                <span
                                    className={cn(
                                        'relative flex size-16 rotate-3 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg ring-4 ring-primary transition-transform hover:rotate-0',
                                        step.color,
                                    )}
                                >
                                    <step.icon className="size-7" />
                                </span>
                                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary shadow">
                                    {index + 1}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="mx-auto mt-2 max-w-xs leading-relaxed text-white/70">{step.body}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
