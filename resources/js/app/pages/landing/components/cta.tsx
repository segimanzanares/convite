import { ArrowRight, Clock, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildWhatsappUrl } from '@/lib/contact';
import { Petal, Sparkle } from './illustrations/decorations';
import { Reveal } from './reveal';

/** An envelope flying off with its trail of hearts, for the closing call to action. */
function FlyingEnvelope() {
    return (
        <div className="relative mx-auto aspect-square w-full max-w-[300px]" aria-hidden="true">
            <div className="absolute inset-[10%] rounded-full bg-gold/25 blur-3xl" />
            <svg viewBox="0 0 200 200" className="absolute inset-0">
                <path
                    d="M10 170 C 60 160, 50 110, 100 110 S 150 60, 170 40"
                    fill="none"
                    stroke="var(--color-gold-light)"
                    strokeOpacity="0.6"
                    strokeWidth="2"
                    strokeDasharray="4 8"
                    className="motion-safe:animate-dash"
                />
            </svg>
            <div className="absolute top-[18%] left-[30%] w-[52%] motion-safe:animate-float-slow">
                <div className="relative aspect-[4/3]">
                    <div className="absolute inset-x-[8%] bottom-[20%] h-[85%] overflow-hidden">
                        <div className="h-full rounded-md bg-ivory p-2.5 motion-safe:animate-letter">
                            <p className="font-script text-lg leading-tight text-primary">¡Su invitación!</p>
                            <div className="mt-2 h-1 w-2/3 rounded bg-gold/50" />
                            <div className="mt-1 h-1 w-1/2 rounded bg-rose/30" />
                        </div>
                    </div>
                    <svg viewBox="0 0 120 90" className="absolute inset-0 drop-shadow-2xl">
                        <path d="M2 30 L60 62 L118 30 V86 H2 Z" fill="var(--color-gold)" />
                        <path d="M2 86 L60 50 L118 86 Z" fill="var(--color-gold-light)" />
                        <circle cx="60" cy="60" r="9" fill="var(--color-rose)" />
                        <path d="M56 58 q4 -5 8 0 q-4 6 -4 7 q0 -1 -4 -7Z" fill="white" fillOpacity="0.85" />
                    </svg>
                </div>
            </div>
            <Petal className="absolute bottom-[18%] left-[8%] w-5 rotate-[-30deg] text-rose-light motion-safe:animate-float" />
            <Petal className="absolute top-[8%] right-[6%] w-4 rotate-45 text-teal-light motion-safe:animate-float [animation-delay:-3s]" />
            <Sparkle className="absolute top-[6%] left-[14%] w-5 text-gold-light" />
            <Sparkle className="absolute right-[12%] bottom-[10%] w-4 text-gold-light" style={{ animationDelay: '1.3s' }} />
        </div>
    );
}

export function Cta() {
    const whatsappUrl = buildWhatsappUrl(
        'Hola 👋 Me interesa el servicio de invitaciones digitales de Convite. ¿Podemos platicar sobre mi evento?',
    );

    return (
        <section className="px-4 py-24 sm:px-6 md:py-32">
            <Reveal className="mx-auto max-w-6xl">
                <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-white shadow-[0_40px_80px_-30px_rgba(42,26,43,0.7)] sm:px-12 md:py-16">
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        <div className="absolute -top-24 -left-16 size-80 rounded-full bg-rose/30 blur-[100px] motion-safe:animate-blob" />
                        <div className="absolute -right-16 -bottom-24 size-80 rounded-full bg-teal/25 blur-[100px] motion-safe:animate-blob [animation-delay:-7s]" />
                        <div className="absolute inset-0 bg-[radial-gradient(var(--color-white)_1px,transparent_1px)] bg-size-[22px_22px] opacity-[0.06]" />
                    </div>
                    <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
                        <div className="text-center md:text-left">
                            <p className="text-sm font-medium text-gold-light">Empecemos hoy</p>
                            <h2 className="mt-3 text-[clamp(30px,4.4vw,48px)] leading-[1.1] font-semibold tracking-tight text-balance">
                                Cuéntennos su fecha y hagamos su{' '}
                                <span className="font-script text-[1.3em] font-normal text-gold-light">invitación</span>
                            </h2>
                            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75 md:mx-0 mx-auto">
                                Escríbannos por WhatsApp y en el mismo día les compartimos una propuesta para su evento, sin
                                compromiso.
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="group mt-8 h-12 rounded-full bg-gold px-7 text-base text-ink shadow-[0_14px_30px_-10px_rgba(223,163,63,0.7)] transition-transform hover:-translate-y-0.5 hover:bg-gold-light"
                            >
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    Escríbannos por WhatsApp
                                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/65 md:justify-start">
                                <span className="flex items-center gap-2">
                                    <Clock className="size-4 text-gold-light" /> Respuesta el mismo día
                                </span>
                                <span className="flex items-center gap-2">
                                    <HeartHandshake className="size-4 text-gold-light" /> Sin compromiso
                                </span>
                            </div>
                        </div>
                        <FlyingEnvelope />
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
