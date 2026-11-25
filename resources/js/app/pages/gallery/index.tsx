import { Head, router, usePoll } from '@inertiajs/react';
import {
    CheckIcon,
    CopyIcon,
    DownloadIcon,
    EyeIcon,
    EyeOffIcon,
    ImagesIcon,
    MonitorPlayIcon,
    QrCodeIcon,
    RefreshCwIcon,
    TrashIcon,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useMemo, useRef, useState } from 'react';
import {
    destroyPhoto,
    download,
    index,
    regenerateLink,
    updatePhoto,
} from '@/actions/App/Http/Controllers/Admin/LiveGalleryController';
import ConfirmDialog from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatDateTime } from '@/lib/format';
import { invitationBreadcrumbs } from '@/lib/invitation-sections';
import GallerySettingsPanel from './components/gallery-settings';
import type {
    Auth,
    GalleryPhoto,
    GalleryPhotoStatus,
    GallerySettings,
    Invitation,
} from '@/types';

type Props = {
    invitation: Invitation;
    gallery: GallerySettings;
    photos: GalleryPhoto[];
};

type Filter = 'all' | GalleryPhotoStatus;

/** How often the page refreshes while guests are sharing photos. */
const REFRESH_MS = 10_000;

const STATUS_LABELS: Record<GalleryPhotoStatus, string> = {
    pending: 'Por aprobar',
    approved: 'En el muro',
    hidden: 'Oculta',
};

const FILTER_LABELS: Record<GalleryPhotoStatus, string> = {
    ...STATUS_LABELS,
    hidden: 'Ocultas',
};

/**
 * The live gallery of an invitation: its QR code and links, its settings (approval, when it takes photos, how long
 * the wall shows each one), and every photo the guests shared, to approve, hide or delete them and download them all.
 */
export default function GalleryIndex({ invitation, gallery, photos }: Props) {
    const [filter, setFilter] = useState<Filter>(
        gallery.moderated && gallery.summary.pending > 0 ? 'pending' : 'all',
    );
    const shown = useMemo(
        () =>
            filter === 'all'
                ? photos
                : photos.filter((photo) => photo.status === filter),
        [photos, filter],
    );

    usePoll(
        REFRESH_MS,
        { only: ['gallery', 'photos'] },
        { autoStart: gallery.is_open, mode: 'rest', background: 'pause' },
    );

    return (
        <>
            <Head title={`Galería en vivo · ${invitation.title}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Galería en vivo"
                        description={invitation.title}
                    />

                    <div className="flex flex-wrap gap-2">
                        {gallery.wall_url && (
                            <Button variant="outline" asChild>
                                <a
                                    href={gallery.wall_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <MonitorPlayIcon />
                                    Abrir muro
                                </a>
                            </Button>
                        )}
                        {gallery.summary.total > gallery.summary.hidden && (
                            <Button variant="outline" asChild>
                                <a href={download.url(invitation.slug)} download>
                                    <DownloadIcon />
                                    Descargar fotos (ZIP)
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <LinkPanel invitation={invitation} gallery={gallery} />

                <GallerySettingsPanel
                    invitation={invitation}
                    gallery={gallery}
                />

                <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        label="Fotos"
                        value={gallery.summary.total}
                        hint={`Máximo ${gallery.max_photos}`}
                    />
                    <StatCard
                        label="En el muro"
                        value={gallery.summary.approved}
                    />
                    <StatCard
                        label="Por aprobar"
                        value={gallery.summary.pending}
                    />
                    <StatCard label="Ocultas" value={gallery.summary.hidden} />
                </dl>

                {photos.length === 0 ? (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center text-sm">
                        <ImagesIcon className="size-6" aria-hidden />
                        Aquí aparecerán las fotos que compartan los invitados.
                    </div>
                ) : (
                    <section className="space-y-4">
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={filter}
                            onValueChange={(value) =>
                                value && setFilter(value as Filter)
                            }
                        >
                            <ToggleGroupItem value="all" className="px-3">
                                Todas
                            </ToggleGroupItem>
                            {(
                                ['pending', 'approved', 'hidden'] as const
                            ).map((status) => (
                                <ToggleGroupItem
                                    key={status}
                                    value={status}
                                    className="px-3"
                                >
                                    {FILTER_LABELS[status]}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {shown.map((photo) => (
                                <PhotoCard
                                    key={photo.id}
                                    invitation={invitation}
                                    photo={photo}
                                />
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </>
    );
}

/**
 * The gallery link: its QR code to print or project, and the window in which it takes photos.
 */
function LinkPanel({
    invitation,
    gallery,
}: {
    invitation: Invitation;
    gallery: GallerySettings;
}) {
    const [copiedUrl, copy] = useClipboard();
    const qrRef = useRef<HTMLCanvasElement>(null);
    const uploadUrl = gallery.upload_url;

    const makeLink = () =>
        new Promise((resolve) =>
            router.post(
                regenerateLink(invitation.slug),
                {},
                { preserveScroll: true, onFinish: resolve },
            ),
        );

    const downloadQr = () => {
        const link = document.createElement('a');
        link.href = qrRef.current?.toDataURL('image/png') ?? '';
        link.download = `qr-fotos-${invitation.slug}.png`;
        link.click();
    };

    return (
        <section className="border-sidebar-border/70 dark:border-sidebar-border flex flex-wrap items-start gap-6 rounded-xl border p-4">
            {uploadUrl && (
                <QRCodeCanvas
                    ref={qrRef}
                    value={uploadUrl}
                    size={512}
                    marginSize={2}
                    // The canvas draws at 512 px for the PNG download, and shows smaller
                    style={{ width: 144, height: 144 }}
                    className="shrink-0 rounded-md border bg-white"
                />
            )}
            <div className="min-w-0 flex-1 space-y-3">
                <div>
                    <h2 className="flex items-center gap-2 font-medium">
                        <QrCodeIcon className="size-4" aria-hidden />
                        Código QR de la galería
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Imprímelo en las mesas o proyéctalo: los invitados lo
                        escanean y suben sus fotos, que aparecen en el muro.
                    </p>
                </div>

                {uploadUrl ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <code className="bg-muted max-w-full truncate rounded px-2 py-1 text-xs">
                            {uploadUrl}
                        </code>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copy(uploadUrl)}
                        >
                            {copiedUrl === uploadUrl ? (
                                <CheckIcon />
                            ) : (
                                <CopyIcon />
                            )}
                            Copiar
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadQr}>
                            <DownloadIcon />
                            Descargar QR
                        </Button>
                        <ConfirmDialog
                            trigger={
                                <Button variant="ghost" size="sm">
                                    <RefreshCwIcon />
                                    Generar nuevo
                                </Button>
                            }
                            title="¿Generar un nuevo enlace de galería?"
                            description="El enlace actual y los códigos QR que ya imprimiste dejarán de funcionar. Úsalo si el enlace llegó a alguien que no debía tenerlo."
                            confirmLabel="Generar nuevo"
                            onConfirm={makeLink}
                        />
                    </div>
                ) : (
                    <Button variant="outline" onClick={makeLink}>
                        <QrCodeIcon />
                        Crear código QR
                    </Button>
                )}
            </div>
        </section>
    );
}

function PhotoCard({
    invitation,
    photo,
}: {
    invitation: Invitation;
    photo: GalleryPhoto;
}) {
    const status = photo.status ?? 'approved';

    const setStatus = (next: GalleryPhotoStatus) =>
        router.patch(
            updatePhoto([invitation.slug, photo.id]),
            { status: next },
            { preserveScroll: true },
        );

    const remove = () =>
        new Promise((resolve) =>
            router.delete(destroyPhoto([invitation.slug, photo.id]), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <li className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
            <a
                href={photo.url}
                target="_blank"
                rel="noreferrer"
                className="relative block aspect-square"
            >
                <img
                    src={photo.thumb_url}
                    alt={
                        photo.uploader_name
                            ? `Foto de ${photo.uploader_name}`
                            : 'Foto de un invitado'
                    }
                    loading="lazy"
                    className={`size-full object-cover ${status === 'hidden' ? 'opacity-40' : ''}`}
                />
                <Badge
                    variant={status === 'approved' ? 'default' : 'secondary'}
                    className="absolute top-2 left-2"
                >
                    {STATUS_LABELS[status]}
                </Badge>
            </a>
            <div className="space-y-2 p-2 text-xs">
                <p className="text-muted-foreground truncate">
                    {photo.uploader_name ?? 'Anónimo'} ·{' '}
                    {formatDateTime(photo.created_at)}
                </p>
                {photo.message && (
                    <p className="line-clamp-2">“{photo.message}”</p>
                )}
                <div className="flex gap-1">
                    {status === 'approved' ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setStatus('hidden')}
                        >
                            <EyeOffIcon />
                            Ocultar
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setStatus('approved')}
                        >
                            <EyeIcon />
                            {status === 'pending' ? 'Aprobar' : 'Mostrar'}
                        </Button>
                    )}
                    <ConfirmDialog
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Eliminar foto"
                            >
                                <TrashIcon />
                            </Button>
                        }
                        title="¿Eliminar esta foto?"
                        description="Se borra para siempre y no saldrá en la descarga. Si solo quieres quitarla del muro, ocúltala."
                        confirmLabel="Eliminar"
                        variant="destructive"
                        onConfirm={remove}
                    />
                </div>
            </div>
        </li>
    );
}

GalleryIndex.layout = (props: Props & { auth: Auth }) => ({
    breadcrumbs: invitationBreadcrumbs(props.auth.user.role, props.invitation, {
        title: 'Galería en vivo',
        href: index(props.invitation.slug),
    }),
});
