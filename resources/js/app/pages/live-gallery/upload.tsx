import { Head, usePage, usePoll } from '@inertiajs/react';
import { CameraIcon, CheckIcon, ImageUpIcon, RotateCwIcon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
        <main className="min-h-screen bg-cream text-ink">
            <Head title={`Fotos — ${gallery.title}`} />
            <header className="bg-primary px-4 pt-6 pb-5 text-ivory">
                <div className="mx-auto max-w-md">
                    <p className="text-[11px] tracking-[0.3em] text-ivory/70 uppercase">Galería en vivo</p>
                    <h1 className="mt-1 text-xl">{gallery.title}</h1>
                </div>
            </header>
            <div className="mx-auto max-w-md px-4 py-6">
                {gallery.is_open ? (
                    <Uploader />
                ) : (
                    <p className="border border-primary/15 bg-ivory p-5 leading-relaxed">
                        {gallery.opens_at && gallery.closes_at
                            ? `La galería recibe fotos del ${formatGalleryTime(gallery.opens_at)} al ${formatGalleryTime(gallery.closes_at)}. ¡Te esperamos en el evento!`
                            : 'La galería se abre el día del evento.'}
                    </p>
                )}

                <RecentPhotos photos={photos} refreshes={gallery.is_open} />
            </div>
        </main>
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
            <p className="text-sm leading-relaxed text-ink/80">
                Comparte las fotos que tomes en el evento.{' '}
                {gallery.moderated
                    ? 'Aparecerán en la pantalla del salón cuando los anfitriones las aprueben.'
                    : 'Aparecerán al momento en la pantalla del salón.'}
            </p>

            <label className="mt-5 block">
                <span className="text-sm text-ink/70">Tu nombre (opcional)</span>
                <input
                    type="text"
                    value={name}
                    maxLength={60}
                    autoComplete="name"
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1 w-full border border-primary/30 bg-ivory px-4 py-3 text-base"
                />
            </label>
            <label className="mt-3 block">
                <span className="text-sm text-ink/70">Un mensaje para acompañar tus fotos (opcional)</span>
                <input
                    type="text"
                    value={message}
                    maxLength={140}
                    onChange={(event) => setMessage(event.target.value)}
                    className="mt-1 w-full border border-primary/30 bg-ivory px-4 py-3 text-base"
                />
            </label>

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
                <button
                    type="button"
                    onClick={() => pickerRef.current?.click()}
                    className="flex items-center justify-center gap-2 bg-primary px-4 py-4 text-ivory"
                >
                    <ImageUpIcon className="size-5" aria-hidden />
                    Elegir fotos
                </button>
                <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex items-center justify-center gap-2 border border-primary px-4 py-4 text-primary"
                >
                    <CameraIcon className="size-5" aria-hidden />
                    Tomar foto
                </button>
            </div>

            {uploads.length > 0 && (
                <div className="mt-6">
                    <p role="status" className="text-sm text-ink/70">
                        {done} de {uploads.length} {uploads.length === 1 ? 'foto subida' : 'fotos subidas'}
                    </p>
                    <ul className="mt-2 grid grid-cols-3 gap-2">
                        {uploads.map((upload) => (
                            <li key={upload.key} className="relative aspect-square overflow-hidden bg-ivory">
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
                <span className="absolute top-1 right-1 rounded-full bg-primary p-1 text-ivory" aria-label="Subida">
                    <CheckIcon className="size-3.5" />
                </span>
            );
        case 'failed':
            return (
                <button
                    type="button"
                    onClick={onRetry}
                    title={upload.error}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/70 p-1 text-center text-[11px] leading-tight text-ivory"
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
                <span className="absolute inset-x-0 bottom-0 h-1.5 bg-ink/30">
                    <span className="block h-full bg-gold transition-[width]" style={{ width: `${upload.progress}%` }} />
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
            <h2 className="text-[11px] tracking-[0.3em] text-ink/60 uppercase">Fotos del evento</h2>
            <ul className="mt-3 grid grid-cols-3 gap-1">
                {photos.map((photo) => (
                    <li key={photo.id} className="aspect-square overflow-hidden bg-ivory">
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
