import { Head, Link, router } from '@inertiajs/react';
import { DownloadIcon, SearchIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { index as guestsIndex } from '@/actions/App/Http/Controllers/Admin/GuestController';
import {
    destroy,
    exportMethod,
    index,
} from '@/actions/App/Http/Controllers/Admin/RsvpController';
import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import {
    invitationBreadcrumbs,
    invitationSections,
} from '@/lib/invitation-sections';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatDate } from '@/lib/format';
import type { Auth, Guest, Invitation, Rsvp, RsvpSummary } from '@/types';

type Props = {
    invitation: Invitation;
    summary: RsvpSummary;
    guests: Guest[];
    /** Answers sent through the open form, which belong to no guest. */
    openAnswers: Rsvp[];
};

type Filter = 'all' | 'attending' | 'declined' | 'pending';

type Row = {
    key: string;
    name: string;
    /** Null for open answers. */
    guest: Guest | null;
    rsvp: Rsvp | null;
};

function status(row: Row): Exclude<Filter, 'all'> {
    if (!row.rsvp) {
        return 'pending';
    }

    return row.rsvp.attending ? 'attending' : 'declined';
}

export default function RsvpsIndex({
    invitation,
    summary,
    guests,
    openAnswers,
}: Props) {
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');
    const hasGuestList = invitationSections(invitation).guests;

    const rows = useMemo<Row[]>(
        () => [
            ...guests.map((guest) => ({
                key: `guest-${guest.id}`,
                name: guest.name,
                guest,
                rsvp: guest.rsvp ?? null,
            })),
            ...openAnswers.map((rsvp) => ({
                key: `rsvp-${rsvp.id}`,
                name: rsvp.name,
                guest: null,
                rsvp,
            })),
        ],
        [guests, openAnswers],
    );

    const shown = useMemo(() => {
        const term = search.trim().toLocaleLowerCase('es');

        return rows.filter(
            (row) =>
                (filter === 'all' || status(row) === filter) &&
                (!term || row.name.toLocaleLowerCase('es').includes(term)),
        );
    }, [rows, filter, search]);

    const removeAnswer = (rsvp: Rsvp) =>
        new Promise((resolve) =>
            router.delete(destroy([invitation.slug, rsvp.id]), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <>
            <Head title={`Confirmaciones · ${invitation.title}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Confirmaciones"
                        description={invitation.title}
                    />

                    <div className="flex flex-wrap gap-2">
                        {hasGuestList && (
                            <Button variant="outline" asChild>
                                <Link href={guestsIndex(invitation.slug)}>
                                    <UsersIcon />
                                    Invitados
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <a
                                href={exportMethod.url(invitation.slug)}
                                download
                            >
                                <DownloadIcon />
                                Exportar a Excel (CSV)
                            </a>
                        </Button>
                    </div>
                </div>

                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {hasGuestList && (
                        <Summary label="Invitados" value={summary.guests} />
                    )}
                    <Summary label="Asistirán" value={summary.attending} />
                    <Summary label="No asistirán" value={summary.declined} />
                    {hasGuestList && (
                        <Summary label="Pendientes" value={summary.pending} />
                    )}
                    <Summary
                        label="Personas confirmadas"
                        value={summary.people}
                    />
                </dl>

                <div className="flex flex-wrap items-center gap-4">
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        value={filter}
                        onValueChange={(value) =>
                            value && setFilter(value as Filter)
                        }
                    >
                        <ToggleGroupItem value="all">Todos</ToggleGroupItem>
                        <ToggleGroupItem value="attending">
                            Asistirán
                        </ToggleGroupItem>
                        <ToggleGroupItem value="declined">
                            No asistirán
                        </ToggleGroupItem>
                        {hasGuestList && (
                            <ToggleGroupItem value="pending">
                                Pendientes
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>

                    <div className="relative w-full max-w-sm">
                        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Buscar por nombre"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <DataTable
                    columns={[
                        'Nombre',
                        'Respuesta',
                        { label: 'Personas', desktop: true },
                        { label: 'Mensaje', desktop: true },
                        { label: 'Fecha', desktop: true },
                        '',
                    ]}
                    empty={
                        rows.length === 0
                            ? 'Aún no hay respuestas.'
                            : 'Ninguna respuesta coincide con el filtro.'
                    }
                    isEmpty={shown.length === 0}
                >
                    {shown.map((row) => (
                        <tr key={row.key}>
                            <td className="px-2 py-3 font-medium md:px-4">
                                {row.name}
                                <div className="text-muted-foreground text-xs font-normal">
                                    {row.guest
                                        ? `${row.guest.seats} lugares${row.guest.table_label ? ` · Mesa ${row.guest.table_label}` : ''}`
                                        : 'Formulario abierto'}
                                </div>
                                {row.rsvp && (
                                    <div className="text-muted-foreground space-y-1 text-xs font-normal md:hidden">
                                        <div>
                                            {row.rsvp.attending &&
                                                `${row.rsvp.seats_confirmed} ${row.rsvp.seats_confirmed === 1 ? 'persona' : 'personas'} · `}
                                            {formatDate(row.rsvp.responded_at)}
                                        </div>
                                        {row.rsvp.message && (
                                            <p className="text-foreground whitespace-pre-line">
                                                {row.rsvp.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td className="px-2 py-3 align-top md:px-4 md:align-middle">
                                <StatusBadge row={row} />
                            </td>
                            <td className="hidden px-4 py-3 md:table-cell">
                                {row.rsvp?.attending
                                    ? row.rsvp.seats_confirmed
                                    : '—'}
                            </td>
                            <td className="text-muted-foreground hidden max-w-xs px-4 py-3 whitespace-pre-line md:table-cell">
                                {row.rsvp?.message ?? '—'}
                            </td>
                            <td className="hidden px-4 py-3 whitespace-nowrap md:table-cell">
                                {row.rsvp
                                    ? formatDate(row.rsvp.responded_at)
                                    : '—'}
                            </td>
                            <td className="px-2 py-3 text-right align-top md:px-4 md:align-middle">
                                {row.rsvp && (
                                    <ConfirmDialog
                                        trigger={
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label={`Eliminar la respuesta de ${row.name}`}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        }
                                        title="¿Eliminar la respuesta?"
                                        description={
                                            row.guest
                                                ? `${row.name} volverá a quedar pendiente y podrá responder de nuevo.`
                                                : `Respuesta de ${row.name} en el formulario abierto, por ejemplo si está duplicada.`
                                        }
                                        confirmLabel="Eliminar"
                                        variant="destructive"
                                        onConfirm={() =>
                                            removeAnswer(row.rsvp!)
                                        }
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>
        </>
    );
}

function StatusBadge({ row }: { row: Row }) {
    switch (status(row)) {
        case 'attending':
            return <Badge>Asistirá</Badge>;
        case 'declined':
            return <Badge variant="secondary">No asistirá</Badge>;
        default:
            return <Badge variant="outline">Pendiente</Badge>;
    }
}

function Summary({ label, value }: { label: string; value: number }) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{value}</dd>
        </div>
    );
}

RsvpsIndex.layout = (props: Props & { auth: Auth }) => ({
    breadcrumbs: invitationBreadcrumbs(props.auth.user.role, props.invitation, {
        title: 'Confirmaciones',
        href: index(props.invitation.slug),
    }),
});
