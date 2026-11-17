import { CalendarHeart, CheckCheck, MapPin, Music2 } from 'lucide-react';
import convitePetal from '@/assets/images/convite-icon.png';
import { pad, useCountdown } from '../use-countdown';
import { Petal, Sparkle } from './decorations';

/**
 * The hero's animated illustration: a phone opening a sample invitation, with a live countdown and its song playing,
 * an envelope whose letter rises behind it and the cards of what the hosts see while the guests answer.
 */
export function HeroIllustration({ href }: { href: string | null }) {
    const countdown = useCountdown(60);
    const PhoneTag = href ? 'a' : 'div';

    return (
        <div className="relative mx-auto aspect-[10/11] w-full max-w-[520px]">
            {/* Glow and rotating rings */}
            <div className="absolute inset-[8%] rounded-full bg-[conic-gradient(from_120deg,var(--color-gold-light),var(--color-rose-light),var(--color-teal-light),var(--color-gold-light))] opacity-50 blur-3xl" />
            <svg
                viewBox="0 0 200 200"
                className="absolute inset-[4%] motion-safe:animate-[spin_60s_linear_infinite]"
                aria-hidden="true"
            >
                <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-gold)" strokeOpacity="0.45" strokeWidth="0.6" strokeDasharray="2 5" />
                <circle cx="100" cy="4" r="2.4" fill="var(--color-rose)" />
                <circle cx="196" cy="100" r="1.8" fill="var(--color-teal)" />
            </svg>
            <svg
                viewBox="0 0 200 200"
                className="absolute inset-[16%] motion-safe:animate-[spin_40s_linear_infinite_reverse]"
                aria-hidden="true"
            >
                <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-primary)" strokeOpacity="0.12" strokeWidth="0.8" />
                <circle cx="4" cy="100" r="2.2" fill="var(--color-gold)" />
            </svg>

            {/* Envelope with its letter rising, behind the phone */}
            <div className="absolute bottom-[8%] left-0 w-[38%] -rotate-12 motion-safe:animate-float-slow">
                <div className="relative aspect-[4/3]">
                    <div className="absolute inset-x-[8%] bottom-[20%] h-[85%] overflow-hidden">
                        <div className="h-full rounded-md bg-ivory p-2 shadow-sm motion-safe:animate-letter">
                            <p className="font-script text-sm leading-tight text-primary">¡Están invitados!</p>
                            <div className="mt-1.5 h-0.5 w-2/3 rounded bg-gold/40" />
                            <div className="mt-1 h-0.5 w-1/2 rounded bg-gold/30" />
                        </div>
                    </div>
                    <svg viewBox="0 0 120 90" className="absolute inset-0 drop-shadow-xl" aria-hidden="true">
                        <path d="M2 30 L60 62 L118 30 V86 H2 Z" fill="var(--color-terracotta)" />
                        <path d="M2 86 L60 50 L118 86 Z" fill="var(--color-terracotta-light)" />
                        <circle cx="60" cy="60" r="8" fill="var(--color-rose)" />
                        <path d="M57 58 q3 -4 6 0 q-3 5 -3 6 q0 -1 -3 -6Z" fill="white" fillOpacity="0.8" />
                    </svg>
                </div>
            </div>

            {/* The phone */}
            <PhoneTag
                {...(href ? { href } : {})}
                className="group absolute top-1/2 left-1/2 block w-[60%] sm:w-[54%] -translate-x-1/2 -translate-y-1/2"
            >
                <div className="motion-safe:animate-float">
                    <div className="rounded-[2.4rem] bg-primary p-2.5 shadow-[0_40px_80px_-20px_rgba(42,26,43,0.55)] ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
                        <div className="relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(175deg,var(--color-ivory),var(--color-gold-pale))] px-4 pt-7 pb-5 text-center">
                            <div className="absolute top-2 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-primary/80" />
                            <Petal className="absolute -top-2 -right-2 w-10 rotate-45 text-rose/20" />
                            <Petal className="absolute top-24 -left-3 w-8 -rotate-45 text-gold/25" />
                            <img src={convitePetal} alt="" className="mx-auto mb-3 size-8 motion-safe:animate-[spin_12s_linear_infinite]" />
                            <p className="text-[9px] font-medium tracking-[0.4em] text-gold-deep uppercase">Nos casamos</p>
                            <p className="my-1 font-script text-[clamp(26px,4.4vw,36px)] leading-tight text-primary">
                                Mariana &amp; Alejandro
                            </p>
                            <p className="mb-4 font-serif text-sm text-primary/70">Sábado · 18:00 h</p>

                            <div className="mb-4 grid grid-cols-4 gap-1.5">
                                {(
                                    [
                                        ['días', countdown.days],
                                        ['hrs', countdown.hours],
                                        ['min', countdown.minutes],
                                        ['seg', countdown.seconds],
                                    ] as const
                                ).map(([label, value]) => (
                                    <div key={label} className="rounded-lg bg-white/80 py-1.5 shadow-xs">
                                        <p className="text-base leading-none font-semibold text-primary tabular-nums">{pad(value)}</p>
                                        <p className="mt-0.5 text-[8px] tracking-wider text-muted-foreground uppercase">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-left text-white">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                                    <Music2 className="size-3.5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[10px] font-medium">Nuestra canción</span>
                                    <span className="block text-[8px] text-white/60">Reproduciendo</span>
                                </span>
                                <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
                                    {[0, 0.2, 0.4, 0.1].map((delay) => (
                                        <span
                                            key={delay}
                                            className="h-full w-0.5 origin-bottom rounded-full bg-gold motion-safe:animate-equalizer"
                                            style={{ animationDelay: `${delay}s` }}
                                        />
                                    ))}
                                </span>
                            </div>

                            <span className="relative inline-flex items-center justify-center rounded-full bg-terracotta px-4 py-2 text-[10px] font-medium text-white">
                                <span className="absolute inset-0 rounded-full bg-terracotta motion-safe:animate-ping motion-safe:[animation-duration:2.4s]" />
                                <span className="relative">Confirmar asistencia</span>
                            </span>
                        </div>
                    </div>
                </div>
            </PhoneTag>

            {/* What the hosts see */}
            <div className="absolute top-[6%] right-0 hidden w-[40%] max-w-[190px] sm:block rounded-2xl border bg-card/95 p-3 shadow-xl backdrop-blur motion-safe:animate-float [animation-delay:-2s]">
                <div className="mb-2 flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-teal/15 text-teal">
                        <CalendarHeart className="size-4" />
                    </span>
                    <p className="text-xs font-semibold">Confirmaciones</p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/4 rounded-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-gold))] motion-safe:animate-fill" />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">Se actualiza en tiempo real</p>
            </div>

            <div className="absolute top-[30%] left-[2%] flex items-center gap-1.5 rounded-full border bg-card/95 px-3 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur motion-safe:animate-float [animation-delay:-4s]">
                <MapPin className="size-3.5 text-rose" />
                Ver ubicación
            </div>

            <div className="absolute right-0 -bottom-[2%] w-[62%] max-w-[230px] sm:right-[2%] sm:bottom-[12%] sm:w-[48%] motion-safe:animate-toast">
                <div className="flex items-start gap-2.5 rounded-2xl border bg-card p-3 shadow-xl">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
                        <CheckCheck className="size-4" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold">Familia López confirmó</p>
                        <p className="text-[11px] text-muted-foreground">4 personas · ¡Ahí estaremos! 🎉</p>
                    </div>
                </div>
            </div>

            <Sparkle className="absolute top-[2%] left-[22%] w-5 text-gold" />
            <Sparkle className="absolute right-[10%] bottom-[2%] w-4 text-rose" style={{ animationDelay: '1s' }} />
            <Sparkle className="absolute top-[52%] right-[1%] w-3 text-teal" style={{ animationDelay: '1.8s' }} />
        </div>
    );
}
