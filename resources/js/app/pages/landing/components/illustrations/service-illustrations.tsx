import { Heart, Music2, Play, Volume2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { ComponentType } from 'react';
import convitePetal from '@/assets/images/convite-icon.png';
import { cn } from '@/lib/utils';
import { Petal, Sparkle } from './decorations';

/** The photos of a story, as tinted frames. */
const STORY_PHOTOS = [
    { tint: 'bg-[linear-gradient(150deg,var(--color-rose-light),var(--color-gold-pale))]', label: '2014' },
    { tint: 'bg-[linear-gradient(150deg,var(--color-teal-light),var(--color-ivory))]', label: '2017' },
    { tint: 'bg-[linear-gradient(150deg,var(--color-gold-light),var(--color-terracotta-light))]', label: '2020' },
    { tint: 'bg-[linear-gradient(150deg,var(--color-primary),var(--color-rose))]', label: '2023' },
    { tint: 'bg-[linear-gradient(150deg,var(--color-gold-pale),var(--color-teal-light))]', label: '2026' },
];

/** Beats of the song on the timeline: the premium video changes photo on each one. */
const BEATS = [12, 24, 36, 48, 60, 72, 84];

/**
 * A tribute video playing on a screen: the story's photos roll by while the song's beats mark the timeline.
 */
export function TributeVideoIllustration() {
    return (
        <div className="relative flex h-full items-center justify-center px-5">
            <div className="relative aspect-video w-full max-w-[340px] overflow-hidden rounded-xl bg-ink p-2 shadow-2xl ring-4 ring-ink/10">
                <div className="relative flex h-full flex-col overflow-hidden rounded-md bg-[linear-gradient(180deg,#3b2a3c,var(--color-ink))]">
                    <p className="pt-2 text-center font-script text-lg leading-none text-gold-light">Nuestra historia</p>
                    <div className="relative mt-2 flex-1 overflow-hidden">
                        <div className="flex w-max gap-2 motion-safe:animate-marquee" style={{ animationDuration: '14s' }}>
                            {[...STORY_PHOTOS, ...STORY_PHOTOS].map((photo, index) => (
                                <div key={index} className="w-16 shrink-0 rounded-sm bg-white p-1 pb-3 shadow-md even:rotate-3 odd:-rotate-3">
                                    <div className={cn('flex aspect-square items-center justify-center rounded-[2px]', photo.tint)}>
                                        <Heart className="size-3.5 fill-white/70 text-white/70" />
                                    </div>
                                    <p className="mt-0.5 text-center text-[6px] font-medium text-ink/60">{photo.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 pb-2">
                        <Play className="size-3 shrink-0 fill-white text-white" />
                        <div className="relative h-1 flex-1 rounded-full bg-white/15">
                            <span className="absolute inset-y-0 left-0 block rounded-full bg-gold motion-safe:animate-fill" />
                            {BEATS.map((beat) => (
                                <span key={beat} className="absolute -top-0.5 h-2 w-px bg-rose" style={{ left: `${beat}%` }} />
                            ))}
                        </div>
                        <span className="text-[7px] text-white/60 tabular-nums">4:12</span>
                    </div>
                </div>
            </div>
            <div className="absolute right-[6%] bottom-[10%] flex h-8 items-end gap-0.5 rounded-lg bg-white px-2 py-1.5 shadow-md" aria-hidden="true">
                {[0.1, 0.5, 0.2, 0.7, 0.3].map((delay, index) => (
                    <span
                        key={index}
                        className={cn('h-full w-1 origin-bottom rounded-full motion-safe:animate-equalizer', index % 2 ? 'bg-gold' : 'bg-rose')}
                        style={{ animationDelay: `${delay}s` }}
                    />
                ))}
            </div>
            <Music2 className="absolute top-[12%] left-[8%] size-5 text-primary/60 motion-safe:animate-float" />
            <Sparkle className="absolute top-[10%] right-[12%] w-4 text-gold" />
        </div>
    );
}

/**
 * A video invitation playing on a phone, and the same video sent in a chat.
 */
export function VideoInvitationIllustration() {
    return (
        <div className="relative flex h-full items-center justify-center gap-6 px-4">
            <div className="relative h-44 w-24 shrink-0 -rotate-3 rounded-[1.25rem] bg-ink p-1.5 shadow-xl">
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(170deg,var(--color-primary),#3b2a3c_55%,var(--color-rose))] px-2 text-center text-white">
                    <Petal className="absolute -top-2 -left-2 w-8 rotate-45 text-white/15" />
                    <Petal className="absolute -right-2 bottom-6 w-7 -rotate-12 text-gold/25" />
                    <p className="text-[6px] tracking-[0.3em] text-gold-light uppercase motion-safe:animate-bubble" style={{ animationDuration: '6s' }}>
                        Nos casamos
                    </p>
                    <p
                        className="mt-1 font-script text-lg leading-tight motion-safe:animate-bubble motion-safe:[animation-delay:0.6s]"
                        style={{ animationDuration: '6s' }}
                    >
                        Mariana &amp; Alejandro
                    </p>
                    <div className="my-1.5 h-px w-8 bg-gold-light/60" />
                    <p
                        className="text-[7px] text-white/80 motion-safe:animate-bubble motion-safe:[animation-delay:1.2s]"
                        style={{ animationDuration: '6s' }}
                    >
                        12 · Diciembre · 2026
                    </p>
                    <div className="absolute inset-x-2 bottom-2 flex items-center gap-1">
                        <Volume2 className="size-2.5 text-white/70" />
                        <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
                            <span className="block h-full rounded-full bg-gold motion-safe:animate-fill" />
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-36 rounded-xl bg-[#d9fdd3] p-1.5 shadow-md motion-safe:animate-float-slow">
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--color-primary),var(--color-rose))]">
                    <p className="font-script text-base text-white/90">M &amp; A</p>
                    <span className="absolute flex size-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-xs">
                        <Play className="size-3.5 translate-x-px fill-white text-white" />
                    </span>
                    <span className="absolute bottom-1 left-1.5 text-[7px] text-white/85">0:45</span>
                </div>
                <p className="px-1 pt-1 text-[9px] text-ink/80">¡Están invitados! 💛</p>
            </div>
            <Sparkle className="absolute top-[12%] left-[14%] w-4 text-gold" />
            <Heart className="absolute right-[10%] bottom-[12%] size-4 fill-rose/60 text-rose/60 motion-safe:animate-float" />
        </div>
    );
}

/**
 * The printed card in its envelope, with a pass and its QR code beside it.
 */
export function PrintablesIllustration() {
    return (
        <div className="relative flex h-full items-center justify-center gap-5 px-4">
            <div className="relative">
                <div className="absolute -bottom-3 -left-4 h-20 w-28 -rotate-6 rounded-md bg-gold shadow-lg">
                    <svg viewBox="0 0 112 80" className="absolute inset-0" aria-hidden="true">
                        <path d="M0 0 L56 40 L112 0" fill="none" stroke="var(--color-gold-light)" strokeWidth="2" />
                    </svg>
                </div>
                <div className="relative flex aspect-[3/4] w-28 rotate-3 flex-col items-center justify-center rounded-md border-4 border-double border-gold/50 bg-ivory p-2 text-center shadow-xl ring-1 ring-black/5 transition-transform duration-500 motion-safe:animate-float">
                    <img src={convitePetal} alt="" className="mb-1 size-5" />
                    <p className="text-[6px] tracking-[0.3em] text-gold-deep uppercase">Mis XV años</p>
                    <p className="font-script text-xl leading-tight text-primary">Valentina</p>
                    <div className="my-1 h-px w-8 bg-gold/50" />
                    <p className="text-[6px] text-ink/60">Sábado 12 de diciembre</p>
                </div>
            </div>

            <div className="relative flex w-40 -rotate-2 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5">
                <div className="flex-1 p-2.5">
                    <p className="text-[6px] tracking-[0.25em] text-gold-deep uppercase">Pase de invitación</p>
                    <p className="mt-1 font-serif text-[11px] leading-tight text-ink">Familia Ruiz</p>
                    <p className="mt-1.5 text-[7px] text-muted-foreground">Válido para</p>
                    <p className="text-sm leading-none font-semibold text-primary">4 personas</p>
                </div>
                <div className="relative flex items-center border-l border-dashed border-gold/50 bg-gold-pale/50 px-2">
                    <span className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-cream" />
                    <span className="absolute -bottom-1.5 -left-1.5 size-3 rounded-full bg-cream" />
                    <QRCodeSVG value={window.location.origin} size={40} fgColor="#2a1a2b" bgColor="transparent" />
                </div>
            </div>
            <Sparkle className="absolute top-[12%] right-[16%] w-4 text-gold" />
            <Petal className="absolute bottom-[10%] left-[12%] w-4 rotate-[-30deg] text-rose-light motion-safe:animate-float" />
        </div>
    );
}

const ILLUSTRATIONS: Record<string, ComponentType> = {
    'video-semblanza': TributeVideoIllustration,
    'invitacion-en-video': VideoInvitationIllustration,
    imprimibles: PrintablesIllustration,
};

/** A service's illustration, by its id (see lib/services). */
export function ServiceIllustration({ id }: { id: string }) {
    const Illustration = ILLUSTRATIONS[id];

    return Illustration ? <Illustration /> : null;
}
