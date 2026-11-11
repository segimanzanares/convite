import { Head, Link, router } from '@inertiajs/react';
import {
    CheckIcon,
    ClipboardCheckIcon,
    CopyIcon,
    ExternalLinkIcon,
    FileUpIcon,
    PencilIcon,
    PlusIcon,
    PrinterIcon,
    SearchIcon,
    TrashIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/GuestController';
import { create as importGuests } from '@/actions/App/Http/Controllers/Admin/GuestImportController';
import { index as rsvpsIndex } from '@/actions/App/Http/Controllers/Admin/RsvpController';
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
import UrlModal from '@/components/url-modal';
import { useClipboard } from '@/hooks/use-clipboard';
import type { Auth, Guest, Invitation } from '@/types';
import GuestForm from './components/guest-form';
import GuestImportForm from './components/guest-import-form';

type Props = {
    invitation: Invitation;
    guests: Guest[];
    /** How many more guests the plan allows, or null without a limit. */
    remaining: number | null;
    modal: 'create' | 'edit' | 'import' | null;
    guest: Guest | null;
};

export default function GuestsIndex({
    invitation,
    guests,
    remaining,
    modal,
    guest,
}: Props) {
    const [search, setSearch] = useState('');
    const [copiedUrl, copy] = useClipboard();
    const showsRsvps = invitationSections(invitation).rsvps;
    const isFull = remaining === 0;

    const shown = useMemo(() => {
        const term = search.trim().toLocaleLowerCase('es');

        return term
            ? guests.filter((guest) =>
                  guest.name.toLocaleLowerCase('es').includes(term),
              )
            : guests;
    }, [guests, search]);

    const seats = guests.reduce((total, guest) => total + guest.seats, 0);

    const removeGuest = (guest: Guest) =>
        new Promise((resolve) =>
            router.delete(destroy([invitation.slug, guest.id]), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <>
            <Head title={`Invitados · ${invitation.title}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Invitados"
                        description={`${invitation.title} · ${guests.length}${invitation.max_guests ? ` de ${invitation.max_guests}` : ''} invitados, ${seats} lugares`}
                    />

                    <div className="flex flex-wrap gap-2">
                        {invitation.guest_passes_url && (
                            <Button variant="outline" asChild>
                                <a
                                    href={invitation.guest_passes_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <PrinterIcon />
                                    Pases
                                </a>
                            </Button>
                        )}
                        {showsRsvps && (
                            <Button variant="outline" asChild>
                                <Link href={rsvpsIndex(invitation.slug)}>
                                    <ClipboardCheckIcon />
                                    Confirmaciones
                                </Link>
                            </Button>
                        )}
                        {!isFull && (
                            <>
                                <Button variant="outline" asChild>
                                    <Link
                                        href={importGuests(invitation.slug)}
                                        preserveScroll
                                        preserveState
                                    >
                                        <FileUpIcon />
                                        Importar
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link
                                        href={create(invitation.slug)}
                                        preserveScroll
                                        preserveState
                                    >
                                        <PlusIcon />
                                        Agregar invitado
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isFull && (
                    <p className="text-muted-foreground text-sm">
                        La lista está completa: tu plan permite{' '}
                        {invitation.max_guests} invitados.
                    </p>
                )}

                <div className="relative max-w-sm">
                    <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        placeholder="Buscar por nombre"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="pl-9"
                    />
                </div>

                <DataTable
                    columns={[
                        'Invitado',
                        'Lugares',
                        'Mesa',
                        ...(showsRsvps ? ['Respuesta'] : []),
                        'Enlace',
                        '',
                    ]}
                    empty={
                        guests.length === 0
                            ? 'Aún no hay invitados. Agrégalos uno por uno o importa tu lista.'
                            : 'Ningún invitado coincide con la búsqueda.'
                    }
                    isEmpty={shown.length === 0}
                >
                    {shown.map((guest) => (
                        <tr key={guest.id}>
                            <td className="px-4 py-3 font-medium">
                                {guest.name}
                                {(guest.phone || guest.email) && (
                                    <div className="text-muted-foreground text-xs font-normal">
                                        {[guest.phone, guest.email]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-3">{guest.seats}</td>
                            <td className="px-4 py-3">
                                {guest.table_label ?? '—'}
                            </td>
                            {showsRsvps && (
                                <td className="px-4 py-3">
                                    <RsvpBadge guest={guest} />
                                </td>
                            )}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copy(guest.url)}
                                        aria-label={`Copiar el enlace de ${guest.name}`}
                                    >
                                        {copiedUrl === guest.url ? (
                                            <CheckIcon />
                                        ) : (
                                            <CopyIcon />
                                        )}
                                    </Button>
                                    <Button variant="ghost" size="icon" asChild>
                                        <a
                                            href={guest.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Abrir la invitación de ${guest.name}`}
                                        >
                                            <ExternalLinkIcon />
                                        </a>
                                    </Button>
                                    {guest.first_opened_at && (
                                        <span className="text-muted-foreground text-xs">
                                            Abierta
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" size="icon" asChild>
                                        <Link
                                            href={edit([
                                                invitation.slug,
                                                guest.id,
                                            ])}
                                            preserveScroll
                                            preserveState
                                            aria-label={`Editar ${guest.name}`}
                                        >
                                            <PencilIcon />
                                        </Link>
                                    </Button>
                                    <ConfirmDialog
                                        trigger={
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label={`Eliminar ${guest.name}`}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        }
                                        title={`¿Eliminar a ${guest.name}?`}
                                        description="También se borra su respuesta, y su enlace mostrará la invitación general."
                                        confirmLabel="Eliminar"
                                        variant="destructive"
                                        onConfirm={() => removeGuest(guest)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </DataTable>
            </div>

            <UrlModal
                content={modal === 'edit' ? guest : modal}
                closeHref={index(invitation.slug)}
                title={(content) =>
                    content === 'create'
                        ? 'Agregar invitado'
                        : content === 'import'
                          ? 'Importar invitados'
                          : 'Editar invitado'
                }
                className={modal === 'import' ? 'sm:max-w-2xl' : undefined}
            >
                {(content) =>
                    content === 'create' ? (
                        <GuestForm
                            formRequest={store.form(invitation.slug)}
                            submitLabel="Agregar invitado"
                        />
                    ) : content === 'import' ? (
                        <GuestImportForm invitation={invitation} />
                    ) : (
                        <GuestForm
                            key={content.id}
                            formRequest={update.form([
                                invitation.slug,
                                content.id,
                            ])}
                            submitLabel="Guardar"
                            defaultValues={content}
                        />
                    )
                }
            </UrlModal>
        </>
    );
}

function RsvpBadge({ guest }: { guest: Guest }) {
    if (!guest.rsvp) {
        return <Badge variant="outline">Pendiente</Badge>;
    }

    return guest.rsvp.attending ? (
        <Badge>Asistirá · {guest.rsvp.seats_confirmed}</Badge>
    ) : (
        <Badge variant="secondary">No asistirá</Badge>
    );
}

GuestsIndex.layout = (props: Props & { auth: Auth }) => ({
    breadcrumbs: invitationBreadcrumbs(props.auth.user.role, props.invitation, {
        title: 'Invitados',
        href: index(props.invitation.slug),
    }),
});
