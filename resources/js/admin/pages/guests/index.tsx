import { Head, Link, router } from '@inertiajs/react';
import {
    CheckIcon,
    ClipboardCheckIcon,
    CopyIcon,
    ExternalLinkIcon,
    FileUpIcon,
    MailIcon,
    MessageCircleIcon,
    PencilIcon,
    PlusIcon,
    PrinterIcon,
    SearchIcon,
    SendIcon,
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
import {
    email as emailGuest,
    emailPending,
    markSent,
} from '@/actions/App/Http/Controllers/Admin/GuestDeliveryController';
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
import { formatDay } from '@/lib/format';
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
    // Guests can only open a published invitation, so drafts and archived ones are not sent
    const canSend = invitation.status === 'published';

    const shown = useMemo(() => {
        const term = search.trim().toLocaleLowerCase('es');

        return term
            ? guests.filter((guest) =>
                  guest.name.toLocaleLowerCase('es').includes(term),
              )
            : guests;
    }, [guests, search]);

    const seats = guests.reduce((total, guest) => total + guest.seats, 0);
    const pendingEmails = guests.filter(
        (guest) => guest.email && !guest.sent_at,
    ).length;

    // The wa.me link opens in a new tab on its own; this only records the send
    const recordWhatsappSend = (guest: Guest) =>
        router.post(
            markSent([invitation.slug, guest.id]),
            {},
            { preserveScroll: true },
        );

    const sendEmail = (guest: Guest) =>
        new Promise((resolve) =>
            router.post(
                emailGuest([invitation.slug, guest.id]),
                {},
                { preserveScroll: true, onFinish: resolve },
            ),
        );

    const sendPendingEmails = () =>
        new Promise((resolve) =>
            router.post(
                emailPending(invitation.slug),
                {},
                { preserveScroll: true, onFinish: resolve },
            ),
        );

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
                        {canSend && pendingEmails > 0 && (
                            <ConfirmDialog
                                trigger={
                                    <Button variant="outline">
                                        <SendIcon />
                                        Enviar por correo ({pendingEmails})
                                    </Button>
                                }
                                title="¿Enviar la invitación por correo?"
                                description={`Se enviará a ${pendingEmails === 1 ? 'el invitado que tiene' : `los ${pendingEmails} invitados que tienen`} correo y aún no la han recibido. Cada quien recibe su enlace personalizado.`}
                                confirmLabel="Enviar"
                                onConfirm={sendPendingEmails}
                            />
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

                {!canSend && (
                    <p className="text-muted-foreground text-sm">
                        {invitation.status === 'draft'
                            ? 'La invitación aún es un borrador: los enlaces solo abren como vista previa para el equipo, y el envío se habilita cuando se publique.'
                            : 'La invitación está archivada: los invitados ya no pueden abrirla y no se puede enviar.'}
                    </p>
                )}

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
                        'Enlace y envío',
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
                                    {canSend && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <a
                                                href={guest.whatsapp_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() =>
                                                    recordWhatsappSend(guest)
                                                }
                                                aria-label={`Enviar por WhatsApp a ${guest.name}`}
                                                title="Enviar por WhatsApp"
                                            >
                                                <MessageCircleIcon />
                                            </a>
                                        </Button>
                                    )}
                                    {canSend && guest.email && (
                                        <ConfirmDialog
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Enviar por correo a ${guest.name}`}
                                                    title="Enviar por correo"
                                                >
                                                    <MailIcon />
                                                </Button>
                                            }
                                            title={`¿Enviar la invitación a ${guest.email}?`}
                                            description={
                                                guest.sent_at
                                                    ? 'Este invitado ya la recibió; se le enviará de nuevo.'
                                                    : undefined
                                            }
                                            confirmLabel="Enviar"
                                            onConfirm={() => sendEmail(guest)}
                                        />
                                    )}
                                </div>
                                <DeliveryStatus guest={guest} />
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                    >
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

function DeliveryStatus({ guest }: { guest: Guest }) {
    const status = [
        guest.sent_at && `Enviada el ${formatDay(guest.sent_at)}`,
        guest.first_opened_at && 'Abierta',
    ].filter(Boolean);

    return status.length > 0 ? (
        <div className="text-muted-foreground text-xs">
            {status.join(' · ')}
        </div>
    ) : null;
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
