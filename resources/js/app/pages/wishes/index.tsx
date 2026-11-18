import { Head, router } from '@inertiajs/react';
import {
    BookHeartIcon,
    DownloadIcon,
    EyeIcon,
    EyeOffIcon,
    TrashIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    destroy,
    download,
    index,
    update,
    updateSettings,
} from '@/actions/App/Http/Controllers/Admin/WishController';
import ConfirmDialog from '@/components/confirm-dialog';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatDate, formatDateTime } from '@/lib/format';
import { invitationBreadcrumbs } from '@/lib/invitation-sections';
import type { Auth, Invitation, Wish, WishesBook, WishStatus } from '@/types';

type Props = {
    invitation: Invitation;
    book: WishesBook;
    wishes: Wish[];
};

type Filter = 'all' | WishStatus;

type Settings = Pick<WishesBook, 'enabled' | 'public' | 'moderated'>;

const STATUS_LABELS: Record<WishStatus, string> = {
    pending: 'Por aprobar',
    approved: 'Aprobado',
    hidden: 'Oculto',
};

const FILTER_LABELS: Record<WishStatus, string> = {
    pending: 'Por aprobar',
    approved: 'Aprobados',
    hidden: 'Ocultos',
};

const SETTINGS: { key: keyof Settings; label: string; description: string }[] =
    [
        {
            key: 'enabled',
            label: 'Mostrar el libro en la invitación',
            description:
                'Los invitados ven una sección para dejarles un mensaje.',
        },
        {
            key: 'public',
            label: 'Mostrar los mensajes en la invitación',
            description:
                'Los mensajes aprobados se leen en la invitación. Si no, solo los ven aquí y en el PDF.',
        },
        {
            key: 'moderated',
            label: 'Revisar los mensajes antes de publicarlos',
            description:
                'Los mensajes nuevos esperan tu aprobación. Los que ya llegaron no cambian.',
        },
    ];

/**
 * The wishes book of an invitation: whether the invitation shows it, whether the messages show there and whether they
 * wait for approval, and every message the guests left, to approve, hide or delete them and download them in a PDF.
 */
export default function WishesIndex({ invitation, book, wishes }: Props) {
    const [filter, setFilter] = useState<Filter>(
        book.moderated && book.summary.pending > 0 ? 'pending' : 'all',
    );
    const shown = useMemo(
        () =>
            filter === 'all'
                ? wishes
                : wishes.filter((wish) => wish.status === filter),
        [wishes, filter],
    );

    const saveSetting = (key: keyof Settings, value: boolean) =>
        router.put(
            updateSettings(invitation.slug),
            {
                enabled: book.enabled,
                public: book.public,
                moderated: book.moderated,
                [key]: value,
            },
            { preserveScroll: true },
        );

    return (
        <>
            <Head title={`Libro de buenos deseos · ${invitation.title}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Libro de buenos deseos"
                        description={invitation.title}
                    />

                    {book.summary.total > book.summary.hidden && (
                        <Button variant="outline" asChild>
                            <a href={download.url(invitation.slug)} download>
                                <DownloadIcon />
                                Descargar PDF
                            </a>
                        </Button>
                    )}
                </div>

                {book.purged ? (
                    <Alert>
                        <TriangleAlertIcon />
                        <AlertTitle>Los mensajes ya se eliminaron</AlertTitle>
                        <AlertDescription>
                            Se borraron junto con los datos de los invitados,
                            después del evento.
                        </AlertDescription>
                    </Alert>
                ) : (
                    book.purges_at &&
                    book.summary.total > 0 && (
                        <Alert>
                            <TriangleAlertIcon />
                            <AlertTitle>
                                Descarga el PDF antes del{' '}
                                {formatDate(book.purges_at)}
                            </AlertTitle>
                            <AlertDescription>
                                Ese día los mensajes se eliminan junto con los
                                datos de los invitados.
                            </AlertDescription>
                        </Alert>
                    )
                )}

                <section className="border-sidebar-border/70 dark:border-sidebar-border space-y-4 rounded-xl border p-4">
                    <div>
                        <h2 className="font-medium">Configuración</h2>
                        <p className="text-muted-foreground text-sm">
                            {book.closes_at
                                ? `Recibe mensajes hasta el ${formatDate(book.closes_at)}.`
                                : 'Recibe mensajes hasta unos días después del evento, cuando la invitación tenga fecha.'}
                        </p>
                    </div>
                    {SETTINGS.map(({ key, label, description }) => (
                        <div key={key} className="flex items-start gap-3">
                            <Checkbox
                                id={`wishes-${key}`}
                                checked={book[key]}
                                disabled={key !== 'enabled' && !book.enabled}
                                onCheckedChange={(checked) =>
                                    saveSetting(key, checked === true)
                                }
                            />
                            <div className="grid gap-1">
                                <Label htmlFor={`wishes-${key}`}>{label}</Label>
                                <p className="text-muted-foreground text-sm">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        label="Mensajes"
                        value={book.summary.total}
                        hint={`Máximo ${book.max_messages}`}
                    />
                    <StatCard label="Aprobados" value={book.summary.approved} />
                    <StatCard
                        label="Por aprobar"
                        value={book.summary.pending}
                    />
                    <StatCard label="Ocultos" value={book.summary.hidden} />
                </dl>

                {wishes.length === 0 ? (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center text-sm">
                        <BookHeartIcon className="size-6" aria-hidden />
                        Aquí aparecerán los mensajes que dejen los invitados.
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
                                Todos
                            </ToggleGroupItem>
                            {(['pending', 'approved', 'hidden'] as const).map(
                                (status) => (
                                    <ToggleGroupItem
                                        key={status}
                                        value={status}
                                        className="px-3"
                                    >
                                        {FILTER_LABELS[status]}
                                    </ToggleGroupItem>
                                ),
                            )}
                        </ToggleGroup>

                        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {shown.map((wish) => (
                                <WishCard
                                    key={wish.id}
                                    invitation={invitation}
                                    wish={wish}
                                />
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </>
    );
}

function WishCard({
    invitation,
    wish,
}: {
    invitation: Invitation;
    wish: Wish;
}) {
    const setStatus = (status: WishStatus) =>
        router.patch(
            update([invitation.slug, wish.id]),
            { status },
            { preserveScroll: true },
        );

    const remove = () =>
        new Promise((resolve) =>
            router.delete(destroy([invitation.slug, wish.id]), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <li
            className={`border-sidebar-border/70 dark:border-sidebar-border flex flex-col gap-3 rounded-xl border p-4 ${wish.status === 'hidden' ? 'opacity-60' : ''}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate font-medium">{wish.author_name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                        {wish.guest_name && wish.guest_name !== wish.author_name
                            ? `Enlace de ${wish.guest_name} · `
                            : ''}
                        {formatDateTime(wish.created_at)}
                    </p>
                </div>
                <Badge
                    variant={
                        wish.status === 'approved' ? 'default' : 'secondary'
                    }
                >
                    {STATUS_LABELS[wish.status]}
                </Badge>
            </div>
            <p className="flex-1 text-sm whitespace-pre-line">
                “{wish.message}”
            </p>
            <div className="flex gap-1">
                {wish.status === 'approved' ? (
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
                        {wish.status === 'pending' ? 'Aprobar' : 'Mostrar'}
                    </Button>
                )}
                <ConfirmDialog
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar mensaje"
                        >
                            <TrashIcon />
                        </Button>
                    }
                    title="¿Eliminar este mensaje?"
                    description="Se borra para siempre y no saldrá en el PDF. Si solo quieres quitarlo de la invitación, ocúltalo."
                    confirmLabel="Eliminar"
                    variant="destructive"
                    onConfirm={remove}
                />
            </div>
        </li>
    );
}

WishesIndex.layout = (props: Props & { auth: Auth }) => ({
    breadcrumbs: invitationBreadcrumbs(props.auth.user.role, props.invitation, {
        title: 'Libro de buenos deseos',
        href: index(props.invitation.slug),
    }),
});
