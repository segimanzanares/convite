import { http } from '@inertiajs/react';
import type { GalleryPhoto } from '@/types/live-gallery';

/** Longest side of a photo before it is sent; the server keeps up to 2000 px. */
const MAX_SIDE = 2000;

const JPEG_QUALITY = 0.85;

/**
 * Scale a photo down and re-encode it as JPEG in the browser, so it uploads fast on the venue's network and loses its
 * metadata (e.g. where it was taken). Browsers apply the photo's orientation when decoding it. When the browser cannot
 * decode the file (e.g. HEIC outside Safari) the original is sent, and the server rejects what it cannot read either.
 */
export async function shrinkPhoto(file: File): Promise<File> {
    try {
        const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
        const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));

        return blob ? new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
    } catch {
        return file;
    }
}

/**
 * Send a photo to the gallery, reporting the upload's progress (0-100). Rejects with a message for the guest.
 */
export async function uploadPhoto(
    url: string,
    photo: File,
    fields: { uploader_name: string; message: string },
    onProgress: (percentage: number) => void,
): Promise<GalleryPhoto> {
    const data = new FormData();
    data.append('photo', photo);

    if (fields.uploader_name.trim()) {
        data.append('uploader_name', fields.uploader_name.trim());
    }

    if (fields.message.trim()) {
        data.append('message', fields.message.trim());
    }

    try {
        const response = await http.getClient().request({
            method: 'post',
            url,
            data,
            headers: { Accept: 'application/json' },
            onUploadProgress: (event) => onProgress(event.percentage ?? Math.round((event.progress ?? 0) * 100)),
        });

        return JSON.parse(response.data) as GalleryPhoto;
    } catch (error) {
        throw new Error(uploadErrorMessage(error), { cause: error });
    }
}

function uploadErrorMessage(error: unknown): string {
    const response = (error as { response?: { status: number; data: string } }).response;

    if (!response) {
        return 'No hay conexión. Revisa tu señal e inténtalo de nuevo.';
    }

    if (response.status === 429) {
        return 'Subiste muchas fotos seguidas. Espera un minuto e inténtalo de nuevo.';
    }

    if (response.status === 422) {
        try {
            const body = JSON.parse(response.data) as { errors?: Record<string, string[]> };
            const message = Object.values(body.errors ?? {})[0]?.[0];

            if (message) {
                return message;
            }
        } catch {
            // Fall through to the generic message
        }
    }

    return 'No pudimos subir la foto. Inténtalo de nuevo.';
}

/** "5 de diciembre, 00:00", in the phone's time zone. */
export function formatGalleryTime(iso: string) {
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(
        new Date(iso),
    );
}
