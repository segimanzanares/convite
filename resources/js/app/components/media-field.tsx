import { useHttp } from '@inertiajs/react';
import { ImageIcon, MusicIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { useId, useRef } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { mediaUrl } from '@/lib/media';
import type { RouteDefinition } from '@/wayfinder';

export type MediaType = 'image' | 'audio';

type Props = {
    label: string;
    type: MediaType;
    /** Path on the public disk, or an absolute path for static files. */
    value: string | null | undefined;
    onChange: (path: string | null) => void;
    uploadUrl: RouteDefinition<'post'>;
    /** Builds the preview URL of an uploaded (relative) path. */
    urlPrefix: string;
    error?: string;
    hint?: string;
};

const ACCEPT: Record<MediaType, string> = {
    image: 'image/jpeg,image/png,image/webp',
    audio: 'audio/mpeg,audio/mp4,audio/x-m4a,.mp3,.m4a',
};

/**
 * Uploads the file as soon as it is chosen and hands its path to the form.
 * The file is only kept if the form is saved afterwards.
 */
export default function MediaField({
    label,
    type,
    value,
    onChange,
    uploadUrl,
    urlPrefix,
    error,
    hint,
}: Props) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useHttp<
        { type: MediaType; file: File | null },
        { path: string }
    >({
        type,
        file: null,
    });

    const choose = (file: File | undefined) => {
        if (!file) {
            return;
        }

        upload.transform(() => ({ type, file }));
        upload
            .post(uploadUrl.url)
            .then((response) => onChange(response.path))
            .catch(() => undefined)
            .finally(() => {
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            });
    };

    const preview = value ? mediaUrl(value, urlPrefix) : null;

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex flex-wrap items-center gap-3">
                {preview && type === 'image' && (
                    <img
                        src={preview}
                        alt=""
                        className="size-16 rounded-md border object-cover"
                    />
                )}
                {preview && type === 'audio' && (
                    <audio src={preview} controls className="h-9 max-w-64" />
                )}
                {!preview && (
                    <div className="text-muted-foreground flex size-16 items-center justify-center rounded-md border border-dashed">
                        {type === 'image' ? <ImageIcon /> : <MusicIcon />}
                    </div>
                )}

                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept={ACCEPT[type]}
                    className="hidden"
                    onChange={(event) => choose(event.target.files?.[0])}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={upload.processing}
                    onClick={() => inputRef.current?.click()}
                >
                    {upload.processing ? <Spinner /> : <UploadIcon />}
                    {upload.processing
                        ? `Subiendo${upload.progress?.percentage ? ` ${upload.progress.percentage}%` : '…'}`
                        : value
                          ? 'Cambiar'
                          : 'Subir'}
                </Button>
                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange(null)}
                        aria-label={`Quitar ${label.toLocaleLowerCase('es')}`}
                    >
                        <TrashIcon />
                    </Button>
                )}
            </div>
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
            <InputError message={upload.errors.file ?? error} />
        </div>
    );
}
