import { Head, Link, router, usePoll } from '@inertiajs/react';
import {
    CircleCheckIcon,
    DownloadIcon,
    FileJsonIcon,
    FileTextIcon,
    FilmIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { edit as editContent } from '@/actions/App/Http/Controllers/Admin/InvitationContentController';
import {
    data,
    download,
    index,
    store,
} from '@/actions/App/Http/Controllers/Admin/InvitationVideoController';
import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatDateTime } from '@/lib/format';
import { invitationBreadcrumbs } from '@/lib/invitation-sections';
import type { Auth, Invitation } from '@/types';

type VideoStatus = 'queued' | 'rendering' | 'ready' | 'failed';

type Props = {
    invitation: Invitation;
    themes: { name: string; label: string }[];
    video: {
        /** The theme of the last render, null before the first one. */
        theme: string | null;
        status: VideoStatus | null;
        rendered_at: string | null;
        /** The rendered video, null until a render succeeds. */
        url: string | null;
    };
};

const BUSY: (VideoStatus | null)[] = ['queued', 'rendering'];

/**
 * The video invitation of an invitation: its theme, its render (queued, it takes a few minutes), a preview and its
 * download. The video draws the names, date, family, venues and photos captured in the content.
 */
export default function InvitationVideo({ invitation, themes, video }: Props) {
    const [theme, setTheme] = useState(video.theme ?? themes[0]?.name ?? '');
    const [processing, setProcessing] = useState(false);
    const busy = BUSY.includes(video.status);

    // While the video renders, check on it until it is ready
    const { start, stop } = usePoll(5000, { only: ['video'] }, { autoStart: false });
    useEffect(() => {
        if (busy) {
            start();
        } else {
            stop();
        }

        return stop;
    }, [busy, start, stop]);

    const render = () =>
        router.post(
            store.url(invitation.slug),
            { theme },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );

    return (
        <>
            <Head title={`Video · ${invitation.title}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Invitación en video"
                        description={invitation.title}
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={editContent(invitation.slug)}>
                                <FileTextIcon />
                                Contenido
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={data.url(invitation.slug)} download>
                                <FileJsonIcon />
                                Descargar JSON
                            </a>
                        </Button>
                        {video.url && (
                            <Button variant="outline" asChild>
                                <a href={download.url(invitation.slug)} download>
                                    <DownloadIcon />
                                    Descargar MP4
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <StatusAlert video={video} />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="border-sidebar-border/70 dark:border-sidebar-border space-y-4 rounded-xl border p-4">
                        <div>
                            <h2 className="font-medium">Generar el video</h2>
                            <p className="text-muted-foreground text-sm">
                                Usa los nombres, la fecha, la familia, los
                                lugares, las fotos y la música del contenido.
                                Revisa el contenido antes de generarlo: cada
                                cambio necesita generarlo de nuevo.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Tema</p>
                            <ToggleGroup
                                type="single"
                                variant="outline"
                                value={theme}
                                onValueChange={(value) => value && setTheme(value)}
                                className="flex flex-wrap justify-start"
                            >
                                {themes.map((option) => (
                                    <ToggleGroupItem
                                        key={option.name}
                                        value={option.name}
                                        className="h-auto px-3 py-2 text-left whitespace-normal"
                                    >
                                        {option.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>

                        <Button
                            onClick={render}
                            disabled={busy || processing || theme === ''}
                        >
                            {busy || processing ? <Spinner /> : <FilmIcon />}
                            {video.url ? 'Volver a generar' : 'Generar video'}
                        </Button>
                    </section>

                    <section className="border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center rounded-xl border p-4">
                        {video.url ? (
                            <video
                                key={video.url}
                                src={video.url}
                                controls
                                playsInline
                                className="aspect-9/16 w-full max-w-[320px] rounded-lg bg-black"
                            />
                        ) : (
                            <p className="text-muted-foreground py-24 text-center text-sm">
                                Aquí verás el video cuando esté listo.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

function StatusAlert({ video }: { video: Props['video'] }) {
    if (video.status === 'queued' || video.status === 'rendering') {
        return (
            <Alert>
                <Spinner />
                <AlertTitle>
                    {video.status === 'queued'
                        ? 'El video está en la fila'
                        : 'Generando el video'}
                </AlertTitle>
                <AlertDescription>
                    Tarda unos minutos. Esta página se actualiza sola cuando
                    termina.
                </AlertDescription>
            </Alert>
        );
    }

    if (video.status === 'failed') {
        return (
            <Alert variant="destructive">
                <TriangleAlertIcon />
                <AlertTitle>No se pudo generar el video</AlertTitle>
                <AlertDescription>
                    Revisa el registro de errores e inténtalo de nuevo.
                    {video.url && ' El video anterior sigue disponible.'}
                </AlertDescription>
            </Alert>
        );
    }

    if (video.status === 'ready' && video.rendered_at) {
        return (
            <Alert>
                <CircleCheckIcon />
                <AlertTitle>Video listo</AlertTitle>
                <AlertDescription>
                    Generado el {formatDateTime(video.rendered_at)}. Descárgalo
                    y envíalo al cliente.
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}

InvitationVideo.layout = (props: Props & { auth: Auth }) => ({
    breadcrumbs: invitationBreadcrumbs(props.auth.user.role, props.invitation, {
        title: 'Video',
        href: index(props.invitation.slug),
    }),
});
