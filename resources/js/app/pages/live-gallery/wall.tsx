import { Head, usePage, usePoll } from '@inertiajs/react';
import { ExpandIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatGalleryTime } from '@/lib/live-gallery';
import type { GalleryPhoto, LiveGalleryPageProps } from '@/types/live-gallery';

/** How often the wall asks for new photos. */
const REFRESH_MS = 8_000;

/** How long each photo stays on screen. */
const SLIDE_MS = 7_000;

/** How long a photo stays at least before a new one cuts in. */
const MIN_SLIDE_MS = 2_500;

/**
 * The wall projected at the venue: one photo at a time, full screen. New photos jump the line as soon as they arrive;
 * between them the wall cycles through the latest ones. A corner shows the QR code to share more. Being projected in a
 * dim room, it sits on a dark gradient of the primary color with `primary-foreground` text. (A nested `dark` class would
 * not do: Tailwind resolves `--color-*` on `:root`, so only `<html>` can switch the theme.)
 */
export default function LiveGalleryWall() {
    const { gallery, photos } = usePage<LiveGalleryPageProps>().props;
    const current = useSlideshow(photos);

    usePoll(REFRESH_MS, { only: ['photos'] }, { mode: 'rest', background: 'continue' });

    return (
        <main className="relative flex h-screen cursor-none items-center justify-center overflow-hidden bg-radial-[at_50%_35%] from-[color-mix(in_oklch,var(--primary),white_12%)] to-[color-mix(in_oklch,var(--primary),black_45%)] text-primary-foreground">
            <Head title={`Muro de fotos — ${gallery.title}`} />

            {current ? (
                <figure key={current.id} className="relative flex size-full items-center justify-center motion-safe:animate-photo-in">
                    {/* The same photo, blurred, fills the bars around it */}
                    <img src={current.thumb_url} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl" />
                    <img
                        src={current.url}
                        alt={current.uploader_name ? `Foto de ${current.uploader_name}` : 'Foto del evento'}
                        className="relative max-h-full max-w-full object-contain shadow-2xl"
                    />
                    {(current.uploader_name || current.message) && (
                        <figcaption className="absolute bottom-8 left-8 max-w-[60%] rounded-xl border border-primary-foreground/15 bg-primary/75 px-5 py-3 shadow-lg backdrop-blur">
                            {current.message && <p className="text-2xl leading-snug font-medium tracking-tight">“{current.message}”</p>}
                            {current.uploader_name && <p className="mt-1 text-sm text-primary-foreground/70">{current.uploader_name}</p>}
                        </figcaption>
                    )}
                </figure>
            ) : (
                <div className="px-8 text-center">
                    <p className="text-sm font-medium tracking-wide text-primary-foreground/70">Galería en vivo</p>
                    <h1 className="mt-3 text-5xl font-semibold tracking-tight">{gallery.title}</h1>
                    <p className="mt-6 text-lg text-primary-foreground/80">
                        {gallery.is_open || !gallery.opens_at
                            ? 'Escanea el código y comparte la primera foto.'
                            : `Las fotos aparecerán aquí a partir del ${formatGalleryTime(gallery.opens_at)}.`}
                    </p>
                </div>
            )}

            {/* Light, so phones read the code on any projector; the code takes the text color (primary) */}
            <aside className="absolute right-8 bottom-8 flex items-center gap-4 rounded-xl bg-card p-4 text-primary shadow-xl">
                <QRCodeSVG value={gallery.upload_url} size={132} fgColor="currentColor" bgColor="transparent" />
                <p className="max-w-36 text-xl leading-tight font-semibold tracking-tight">Escanea y comparte tus fotos</p>
            </aside>

            <FullscreenButton />
        </main>
    );
}

/**
 * The photo on screen. New photos (the ones not seen before) go up as soon as they arrive, oldest of them first;
 * otherwise the wall moves to the next of the latest photos. A photo hidden from the panel leaves the screen on the next refresh.
 */
function useSlideshow(photos: GalleryPhoto[]): GalleryPhoto | null {
    const [current, setCurrent] = useState<GalleryPhoto | null>(photos[0] ?? null);
    const shown = useRef(current);
    const shownAt = useRef(0);
    const seen = useRef(new Set(photos.map((photo) => photo.id)));
    const fresh = useRef<GalleryPhoto[]>([]);
    const position = useRef(0);
    const latest = useRef(photos);
    const cutIn = useRef<number | undefined>(undefined);

    const show = useCallback((photo: GalleryPhoto | null) => {
        window.clearTimeout(cutIn.current);
        shown.current = photo;
        shownAt.current = Date.now();
        setCurrent(photo);
    }, []);

    const advance = useCallback(() => {
        const next = fresh.current.shift();

        if (next) {
            show(next);
        } else if (latest.current.length > 0) {
            position.current = (position.current + 1) % latest.current.length;
            show(latest.current[position.current]);
        }
    }, [show]);

    useEffect(() => {
        latest.current = photos;
        const ids = new Set(photos.map((photo) => photo.id));
        const added = photos.filter((photo) => !seen.current.has(photo.id));
        added.forEach((photo) => seen.current.add(photo.id));
        fresh.current = [...fresh.current.filter((photo) => ids.has(photo.id)), ...added.reverse()];

        if (!shown.current || !ids.has(shown.current.id)) {
            show(fresh.current.shift() ?? photos[0] ?? null);
        } else if (added.length > 0) {
            // A new photo goes up right away, or as soon as the one on screen had a moment
            const wait = Math.max(0, MIN_SLIDE_MS - (Date.now() - shownAt.current));
            window.clearTimeout(cutIn.current);
            cutIn.current = window.setTimeout(advance, wait);
        }
    }, [photos, show, advance]);

    useEffect(() => () => window.clearTimeout(cutIn.current), []);

    // Each photo gets its full time on screen, counted from when it went up
    useEffect(() => {
        const timer = window.setTimeout(advance, SLIDE_MS);

        return () => window.clearTimeout(timer);
    }, [current, advance]);

    return current;
}

function FullscreenButton() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const sync = () => setIsFullscreen(document.fullscreenElement !== null);
        document.addEventListener('fullscreenchange', sync);

        return () => document.removeEventListener('fullscreenchange', sync);
    }, []);

    if (isFullscreen || !document.fullscreenEnabled) {
        return null;
    }

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={() => void document.documentElement.requestFullscreen()}
            className="absolute top-6 right-6 cursor-pointer bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
        >
            <ExpandIcon aria-hidden />
            Pantalla completa
        </Button>
    );
}
