import { CheckCheck, Heart, Send, UserCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import convitePetal from '@/assets/images/convite-icon.png';
import { cn } from '@/lib/utils';
import { pad, useCountdown } from '../use-countdown';
import { Petal, Sparkle } from './decorations';

const SAMPLE_CARDS = [
    { className: 'bg-primary text-gold-light', rotate: '-rotate-12 -translate-x-[70%]', title: 'Mariana & Alejandro', label: 'Boda' },
    { className: 'bg-[linear-gradient(160deg,var(--color-rose-light),var(--color-gold-pale))] text-primary', rotate: 'z-10 motion-safe:animate-float', title: 'Valentina', label: 'XV años' },
    { className: 'bg-[linear-gradient(160deg,var(--color-teal-light),var(--color-ivory))] text-primary', rotate: 'rotate-12 translate-x-[70%]', title: 'Santiago', label: 'Bautizo' },
];

/** Three sample invitations fanned out, opening further on hover. */
export function DesignIllustration() {
    return (
        <div className="relative flex h-full items-center justify-center">
            {SAMPLE_CARDS.map((card) => (
                <div
                    key={card.title}
                    className={cn(
                        'absolute flex aspect-[3/4] w-[30%] max-w-[140px] flex-col items-center justify-center rounded-2xl p-3 text-center shadow-xl ring-1 ring-black/5 transition-transform duration-500',
                        card.className,
                        card.rotate,
                    )}
                >
                    <img src={convitePetal} alt="" className="mb-2 size-6" />
                    <p className="text-[8px] tracking-[0.3em] uppercase opacity-70">{card.label}</p>
                    <p className="font-script text-xl leading-tight">{card.title}</p>
                    <div className="mt-2 h-px w-8 bg-current opacity-40" />
                </div>
            ))}
            <Sparkle className="absolute top-[12%] left-[18%] w-4 text-gold" />
            <Sparkle className="absolute right-[16%] bottom-[14%] w-3 text-rose" style={{ animationDelay: '1.2s' }} />
        </div>
    );
}

/** The live countdown, as large as the one in the invitations. */
export function CountdownIllustration() {
    const countdown = useCountdown(45);

    return (
        <div className="flex h-full items-center justify-center gap-2">
            {(
                [
                    ['Días', countdown.days],
                    ['Hrs', countdown.hours],
                    ['Min', countdown.minutes],
                    ['Seg', countdown.seconds],
                ] as const
            ).map(([label, value]) => (
                <div key={label} className="text-center">
                    <div className="relative flex h-16 w-13 items-center justify-center overflow-hidden rounded-xl bg-primary text-2xl font-semibold text-white tabular-nums shadow-lg">
                        <span key={value} className="motion-safe:animate-in motion-safe:slide-in-from-top-3 motion-safe:fade-in">
                            {pad(value)}
                        </span>
                        <span className="absolute inset-x-0 top-1/2 h-px bg-black/30" />
                    </div>
                    <p className="mt-1.5 text-[10px] tracking-wider text-muted-foreground uppercase">{label}</p>
                </div>
            ))}
        </div>
    );
}

/** A chat where a guest confirms and the answer lands in the hosts' list. */
export function RsvpIllustration() {
    return (
        <div className="flex h-full flex-col justify-center gap-2 px-5">
            <div
                className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-xs shadow-sm motion-safe:animate-bubble"
                style={{ animationDuration: '6s' }}
            >
                ¡Confirmamos! Somos 4 🎉
            </div>
            <div
                className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-[#d9fdd3] px-3 py-2 text-xs shadow-sm motion-safe:animate-bubble motion-safe:[animation-delay:0.8s]"
                style={{ animationDuration: '6s' }}
            >
                ¡Los esperamos! 💛 <CheckCheck className="ml-1 inline size-3.5 text-teal" />
            </div>
            <div
                className="mt-1 flex items-center gap-2 self-center rounded-full bg-teal px-3 py-1 text-[11px] font-medium text-white shadow motion-safe:animate-bubble motion-safe:[animation-delay:1.6s]"
                style={{ animationDuration: '6s' }}
            >
                <UserCheck className="size-3.5" /> Familia Ruiz · 4 asistentes
            </div>
        </div>
    );
}

/** A spinning record with the song's equalizer. */
export function MusicIllustration() {
    return (
        <div className="flex h-full items-center justify-center gap-6">
            <div className="relative size-24 rounded-full bg-[repeating-radial-gradient(circle,#2a1a2b_0,#2a1a2b_2px,#3b2a3c_3px,#2a1a2b_4px)] shadow-xl motion-safe:animate-[spin_4s_linear_infinite]">
                <div className="absolute inset-[34%] flex items-center justify-center rounded-full bg-gold">
                    <div className="size-2 rounded-full bg-primary" />
                </div>
                <div className="absolute top-3 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-white/20" />
            </div>
            <div className="flex h-16 items-end gap-1" aria-hidden="true">
                {[0.1, 0.5, 0.2, 0.7, 0.3, 0.6, 0].map((delay, index) => (
                    <span
                        key={index}
                        className={cn(
                            'h-full w-1.5 origin-bottom rounded-full motion-safe:animate-equalizer',
                            index % 2 ? 'bg-gold' : 'bg-rose',
                        )}
                        style={{ animationDelay: `${delay}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

/** The link's preview in a chat, with a paper plane flying off. */
export function ShareIllustration() {
    return (
        <div className="relative flex h-full items-center justify-center px-6">
            <div className="w-full max-w-[220px] overflow-hidden rounded-xl bg-[#d9fdd3] p-1.5 shadow-md">
                <div className="overflow-hidden rounded-lg bg-white">
                    <div className="relative flex h-16 items-center justify-center bg-[linear-gradient(135deg,var(--color-primary),var(--color-rose))]">
                        <Petal className="absolute -left-1 w-6 rotate-45 text-white/20" />
                        <p className="font-script text-xl text-white">Mariana &amp; Alejandro</p>
                    </div>
                    <div className="p-2">
                        <p className="text-[11px] font-semibold">¡Nos casamos! Acompáñennos</p>
                        <p className="text-[10px] text-muted-foreground">Toquen para abrir la invitación</p>
                    </div>
                </div>
            </div>
            <Send className="absolute top-4 right-8 size-6 text-teal motion-safe:animate-fly" />
        </div>
    );
}

/** A guest's phone sharing a photo, which flies onto the wall projected at the venue. */
export function LiveGalleryIllustration() {
    return (
        <div className="relative flex h-full items-center justify-center gap-8 px-4">
            <div className="relative h-36 w-20 shrink-0 -rotate-6 rounded-2xl bg-ink p-1.5 shadow-xl">
                <div className="flex h-full flex-col gap-1.5 rounded-xl bg-ivory p-1.5">
                    <div className="h-14 rounded-md bg-[linear-gradient(150deg,var(--color-teal-light),var(--color-gold-pale))]" />
                    <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                        <span className="block h-full rounded-full bg-gold motion-safe:animate-fill" />
                    </div>
                    <p className="text-[7px] text-muted-foreground">Subiendo foto…</p>
                    <div className="mt-auto rounded-md bg-primary py-1 text-center text-[7px] text-white">Elegir fotos</div>
                </div>
            </div>

            <div className="relative aspect-video w-[58%] max-w-[300px] overflow-hidden rounded-xl bg-ink p-2 shadow-2xl ring-4 ring-ink/10">
                <div className="relative h-full overflow-hidden rounded-md bg-[linear-gradient(135deg,var(--color-rose),var(--color-gold-light))]">
                    <Petal className="absolute -top-2 left-[18%] w-8 rotate-[30deg] text-white/25" />
                    <Petal className="absolute right-[22%] -bottom-3 w-10 -rotate-12 text-white/20" />
                    <Heart className="absolute top-1/2 left-1/2 size-8 -translate-1/2 fill-white/80 text-white/80" />
                    <div className="absolute bottom-1.5 left-1.5 rounded bg-ink/70 px-1.5 py-1 text-white">
                        <p className="font-serif text-[10px] leading-none italic">“¡Que vivan los novios!”</p>
                        <p className="mt-0.5 text-[7px] text-white/70">Tía Rosa</p>
                    </div>
                    <div className="absolute right-1.5 bottom-1.5 rounded-sm bg-white p-0.5">
                        <QRCodeSVG value={window.location.origin} size={26} fgColor="#2a1a2b" />
                    </div>
                </div>
            </div>

            <div
                className="absolute top-[34%] left-[38%] h-9 w-12 rounded-sm border-2 border-white bg-[linear-gradient(150deg,var(--color-teal-light),var(--color-gold-pale))] shadow-lg motion-safe:animate-fly"
                style={{ animationDuration: '3.5s' }}
            />
            <Sparkle className="absolute top-[12%] right-[14%] w-4 text-gold" />
        </div>
    );
}

/** A guest's pass being scanned at the door. */
export function CheckInIllustration() {
    return (
        <div className="flex h-full items-center justify-center gap-6 px-4">
            <div className="relative rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5">
                <QRCodeSVG value={window.location.origin} size={92} fgColor="#2a1a2b" />
                <span className="absolute inset-x-1 h-0.5 rounded-full bg-terracotta shadow-[0_0_12px_2px_var(--color-terracotta)] motion-safe:animate-scan" />
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-md motion-safe:animate-bubble" style={{ animationDuration: '5s' }}>
                    <span className="flex size-6 items-center justify-center rounded-full bg-teal text-white">
                        <CheckCheck className="size-3.5" />
                    </span>
                    <span>
                        <span className="block font-semibold">Familia Pérez</span>
                        <span className="text-muted-foreground">Llegaron 4 de 4</span>
                    </span>
                </div>
                <div className="rounded-xl bg-primary px-3 py-2 text-xs text-white shadow-md">
                    <span className="block text-white/60">Llegadas</span>
                    <span className="flex items-center gap-2">
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/15">
                            <span className="block h-full rounded-full bg-gold motion-safe:animate-fill" />
                        </span>
                        en vivo
                    </span>
                </div>
            </div>
        </div>
    );
}

/** From the first message to the link, in days. */
export function SpeedIllustration() {
    return (
        <div className="flex h-full flex-col justify-center gap-3 px-6">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                <span>Día 1</span>
                <span>Día 3</span>
                <span className="text-teal">¡Lista!</span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white shadow-inner">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-terracotta),var(--color-rose))] motion-safe:animate-fill" />
            </div>
            <div className="flex justify-between">
                {['Datos y fotos', 'Diseño', 'Enlace'].map((label) => (
                    <span key={label} className="rounded-full bg-white px-2 py-0.5 text-[10px] shadow-xs">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
