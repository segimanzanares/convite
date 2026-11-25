import { usePage, usePoll } from '@inertiajs/react';
import { CalendarClockIcon, CameraIcon, CheckIcon, ImageIcon, ImageUpIcon, RotateCwIcon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import EventPage from '@/components/event-page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatGalleryTime, shrinkPhoto, uploadPhoto } from '@/lib/live-gallery';
import type { GalleryPhoto, LiveGalleryPageProps } from '@/types/live-gallery';

/** How often the photos under the button refresh. */
const REFRESH_MS = 15_000;

/** The guest's name, remembered on their phone so they type it once. */
const NAME_KEY = 'convite_gallery_name';

type Upload = {
    key: string;
    file: File;
    preview: string;
    /** The name and message as they were when the photo was chosen. */
    fields: { uploader_name: string; message: string };
    state: 'waiting' | 'uploading' | 'done' | 'failed';
    progress: number;
    error?: string;
};

/**
 * The page the gallery QR code opens at the event: guests pick photos from their phone (or take one) and they upload
 * one after the other, with their progress and a retry for the ones that fail. Below, the latest photos everybody
 * shared. Outside the event it says when the gallery opens.
 */
export default function LiveGalleryUpload() {
    const { gallery, photos } = usePage<LiveGalleryPageProps>().props;

    return (
        <EventPage headTitle={`Fotos — ${gallery.title}`} eyebrow="Galería en vivo" title={gallery.title} icon={<ImageIcon />}>
            {gallery.is_open ? (
                <Uploader />
            ) : (
                <Alert className="bg-card">
                    <CalendarClockIcon />
                    <AlertTitle>La galería no está recibiendo fotos</AlertTitle>
                    <AlertDescription>{closedMessage(gallery.opens_at, gallery.closes_at)}</AlertDescription>
                </Alert>
            )}

            <RecentPhotos photos={photos} refreshes={gallery.is_open} />
        </EventPage>
    );
}

function Uploader() {
    const { gallery } = usePage<LiveGalleryPageProps>().props;
    const [name, setName] = useState(() => readName());
    const [message, setMessage] = useState('');
    const [uploads, setUploads] = useState<Upload[]>([]);
    const pickerRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLInputElement>(null);
    const isUploading = useRef(false);

    const update = (key: string, changes: Partial<Upload>) =>
        setUploads((current) => current.map((upload) => (upload.key === key ? { ...upload, ...changes } : upload)));

    // Uploads go one at a time, so a weak signal is not split among several photos
    useEffect(() => {
        const next = uploads.find((upload) => upload.state === 'waiting');

        if (!next || isUploading.current) {
            return;
        }

        isUploading.current = true;
        update(next.key, { state: 'uploading', progress: 0, error: undefined });

        shrinkPhoto(next.file)
            .then((photo) =>
                uploadPhoto(gallery.upload_url, photo, next.fields, (progress) => update(next.key, { progress })),
            )
            .then(() => update(next.key, { state: 'done', progress: 100 }))
            .catch((error: Error) => update(next.key, { state: 'failed', error: error.message }))
            .finally(() => {
                isUploading.current = false;
                // Wake the effect up for the next photo in the queue
                setUploads((current) => [...current]);
            });
    }, [uploads, gallery.upload_url]);

    // Free the previews when leaving the page
    const previews = useRef<string[]>([]);
    useEffect(() => {
        const urls = previews.current;

        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    function choose(files: FileList | null) {
        if (!files?.length) {
            return;
        }

        saveName(name);
        // The message goes with the photos chosen with it
        const fields = { uploader_name: name, message };
        setMessage('');
        const chosen = Array.from(files).map((file) => ({
            key: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            fields,
            state: 'waiting' as const,
            progress: 0,
        }));
        previews.current.push(...chosen.map((upload) => upload.preview));
        setUploads((current) => [...chosen, ...current]);
    }

    const done = uploads.filter((upload) => upload.state === 'done').length;

    return (
        <section>
            <p className="text-sm leading-relaxed text-muted-foreground">
                Comparte las fotos que tomes en el evento.{' '}
                {gallery.moderated
                    ? 'Aparecerán en la pantalla del salón cuando los anfitriones las aprueben.'
                    : 'Aparecerán al momento en la pantalla del salón.'}
            </p>

            <div className="mt-5 grid gap-2">
                <Label htmlFor="uploader_name">
                    Tu nombre <span className="font-normal text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                    id="uploader_name"
                    type="text"
                    value={name}
                    maxLength={60}
                    autoComplete="name"
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 bg-background text-base md:text-base"
                />
            </div>
            <div className="mt-4 grid gap-2">
                <Label htmlFor="message">
                    Un mensaje para acompañar tus fotos <span className="font-normal text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                    id="message"
                    type="text"
                    value={message}
                    maxLength={140}
                    onChange={(event) => setMessage(event.target.value)}
                    className="h-11 bg-background text-base md:text-base"
                />
            </div>

            <input
                ref={pickerRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                    choose(event.target.files);
                    event.target.value = '';
                }}
            />
            <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => {
                    choose(event.target.files);
                    event.target.value = '';
                }}
            />
            <div className="mt-5 grid grid-cols-2 gap-3">
                <Button type="button" size="lg" onClick={() => pickerRef.current?.click()} className="h-12 text-base [&_svg:not([class*='size-'])]:size-5">
                    <ImageUpIcon aria-hidden />
                    Elegir fotos
                </Button>
                <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => cameraRef.current?.click()}
                    className="h-12 text-base [&_svg:not([class*='size-'])]:size-5"
                >
                    <CameraIcon aria-hidden />
                    Tomar foto
                </Button>
            </div>

            {uploads.length > 0 && (
                <div className="mt-6">
                    <p role="status" className="text-sm text-muted-foreground">
                        {done} de {uploads.length} {uploads.length === 1 ? 'foto subida' : 'fotos subidas'}
                    </p>
                    <ul className="mt-2 grid grid-cols-3 gap-2">
                        {uploads.map((upload) => (
                            <li key={upload.key} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                                <img src={upload.preview} alt="" className="size-full object-cover" />
                                <UploadState
                                    upload={upload}
                                    onRetry={() => update(upload.key, { state: 'waiting', error: undefined })}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

function UploadState({ upload, onRetry }: { upload: Upload; onRetry: () => void }) {
    switch (upload.state) {
        case 'done':
            return (
                <span className="absolute top-1 right-1 rounded-full bg-primary p-1 text-primary-foreground shadow-sm" aria-label="Subida">
                    <CheckIcon className="size-3.5" />
                </span>
            );
        case 'failed':
            return (
                <button
                    type="button"
                    onClick={onRetry}
                    title={upload.error}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/65 p-1 text-center text-[11px] leading-tight text-white"
                >
                    <TriangleAlertIcon className="size-4" aria-hidden />
                    {upload.error}
                    <span className="mt-1 inline-flex items-center gap-1 underline">
                        <RotateCwIcon className="size-3" aria-hidden />
                        Reintentar
                    </span>
                </button>
            );
        default:
            return (
                <span className="absolute inset-x-0 bottom-0 h-1.5 bg-black/30">
                    <span className="block h-full bg-white transition-[width]" style={{ width: `${upload.progress}%` }} />
                </span>
            );
    }
}

function RecentPhotos({ photos, refreshes }: { photos: GalleryPhoto[]; refreshes: boolean }) {
    usePoll(REFRESH_MS, { only: ['photos'] }, { autoStart: refreshes, mode: 'rest', background: 'pause' });

    if (photos.length === 0) {
        return null;
    }

    return (
        <section className="mt-10">
            <h2 className="text-sm font-semibold tracking-tight">Fotos del evento</h2>
            <ul className="mt-3 grid grid-cols-3 gap-1.5">
                {photos.map((photo) => (
                    <li key={photo.id} className="aspect-square overflow-hidden rounded-md bg-muted">
                        <a href={photo.url} target="_blank" rel="noreferrer">
                            <img
                                src={photo.thumb_url}
                                alt={photo.uploader_name ? `Foto de ${photo.uploader_name}` : 'Foto del evento'}
                                loading="lazy"
                                className="size-full object-cover"
                            />
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function readName(): string {
    try {
        return localStorage.getItem(NAME_KEY) ?? '';
    } catch {
        return '';
    }
}

function saveName(name: string) {
    try {
        localStorage.setItem(NAME_KEY, name.trim());
    } catch {
        // Private browsing: the guest types it again next time
    }
}

/** Why the gallery takes no photos: it has not opened yet, it already closed, or the event has no date. */
function closedMessage(opensAt: string | null, closesAt: string | null): string {
    if (!opensAt || !closesAt) {
        return 'La galería se abre cerca del día del evento.';
    }

    if (new Date(closesAt).getTime() <= Date.now()) {
        return `Hasta el ${formatGalleryTime(closesAt)} la galería recibió fotos. ¡Gracias por compartirlas!`;
    }

    return `Del ${formatGalleryTime(opensAt)} al ${formatGalleryTime(closesAt)} la galería recibe fotos. ¡Te esperamos en el evento!`;
}
