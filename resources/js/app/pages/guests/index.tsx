import { Head, Link, router, usePoll } from '@inertiajs/react';
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
    UndoIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    destroy as undoCheckIn,
    store as checkIn,
} from '@/actions/App/Http/Controllers/Admin/CheckInController';
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
import RowActionsMenu from '@/components/row-actions-menu';
import {
    invitationBreadcrumbs,
    invitationSections,
} from '@/lib/invitation-sections';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import UrlModal from '@/components/url-modal';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatDay } from '@/lib/format';
import type { Auth, Guest, GuestCheckIn, Invitation } from '@/types';
import CheckInPanel from './components/check-in-panel';
import GuestForm from './components/guest-form';
import GuestImportForm from './components/guest-import-form';

type Props = {
    invitation: Invitation;
    guests: Guest[];
    /** How many more guests the plan allows, or null without a limit. */
    remaining: number | null;
    modal: 'create' | 'edit' | 'import' | null;
    guest: Guest | null;
    /** Null when the plan does not include check-in at the door. */
    check_in: GuestCheckIn | null;
};

/** How often the list refreshes while guests are arriving, since the door checks them in from other phones. */
const CHECK_IN_REFRESH_MS = 30_000;

export default function GuestsIndex({
    invitation,
    guests,
    remaining,
    modal,
    guest,
    check_in: checkInSettings,
}: Props) {
    const [search, setSearch] = useState('');
    const [copiedUrl, copy] = useClipboard();
    const showsRsvps = invitationSections(invitation).rsvps;
    const isFull = remaining === 0;
    // Guests can only open a published invitation, so drafts and archived ones are not sent
    const canSend = invitation.status === 'published';
    const checkInIsOpen = checkInSettings?.is_open ?? false;

    usePoll(
        CHECK_IN_REFRESH_MS,
        { only: ['guests', 'check_in'] },
        { autoStart: checkInIsOpen, mode: 'rest', background: 'pause' },
    );

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

    // From the panel a guest is checked in with their whole pass; the door can register part of a group
    const registerArrival = (guest: Guest) =>
        router.post(
            checkIn([invitation.slug, guest.id]),
            { seats: guest.seats },
            { preserveScroll: true },
        );

    const undoArrival = (guest: Guest) =>
        new Promise((resolve) =>
            router.delete(undoCheckIn([invitation.slug, guest.id]), {
                preserveScroll: true,
                onFinish: resolve,
            }),
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

                {checkInSettings && (
                    <CheckInPanel
                        invitation={invitation}
                        checkIn={checkInSettings}
                    />
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
                        { label: 'Lugares', desktop: true },
                        { label: 'Mesa', desktop: true },
                        ...(showsRsvps
                            ? [{ label: 'Respuesta', desktop: true }]
                            : []),
                        ...(checkInSettings ? ['Llegada'] : []),
                        { label: 'Enlace y envío', desktop: true },
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
                        <GuestRow
                            key={guest.id}
                            invitation={invitation}
                            guest={guest}
                            canSend={canSend}
                            showsRsvps={showsRsvps}
                            showsArrival={checkInSettings !== null}
                            checkInIsOpen={checkInIsOpen}
                            isCopied={copiedUrl === guest.url}
                            onCopy={() => copy(guest.url)}
                            onWhatsappSend={() => recordWhatsappSend(guest)}
                            onEmailSend={() => sendEmail(guest)}
                            onRegisterArrival={() => registerArrival(guest)}
                            onUndoArrival={() => undoArrival(guest)}
                            onRemove={() => removeGuest(guest)}
                        />
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

/**
 * On small screens the seats, table, answer and delivery collapse under the
 * name, and the link, sending and editing actions into a menu.
 */
function GuestRow({
    invitation,
    guest,
    canSend,
    showsRsvps,
    showsArrival,
    checkInIsOpen,
    isCopied,
    onCopy,
    onWhatsappSend,
    onEmailSend,
    onRegisterArrival,
    onUndoArrival,
    onRemove,
}: {
    invitation: Invitation;
    guest: Guest;
    canSend: boolean;
    showsRsvps: boolean;
    showsArrival: boolean;
    checkInIsOpen: boolean;
    isCopied: boolean;
    onCopy: () => void;
    onWhatsappSend: () => void;
    onEmailSend: () => Promise<unknown>;
    onRegisterArrival: () => void;
    onUndoArrival: () => Promise<unknown>;
    onRemove: () => Promise<unknown>;
}) {
    const [confirming, setConfirming] = useState<'email' | 'remove' | null>(
        null,
    );
    const canEmail = canSend && guest.email !== null;

    const seatsAndTable = [
        `${guest.seats} ${guest.seats === 1 ? 'lugar' : 'lugares'}`,
        guest.table_label && `Mesa ${guest.table_label}`,
    ].filter(Boolean);

    return (
        <tr>
            <td className="px-2 py-3 font-medium md:px-4">
                {guest.name}
                {(guest.phone || guest.email) && (
                    <div className="text-muted-foreground text-xs font-normal break-all">
                        {[guest.phone, guest.email].filter(Boolean).join(' · ')}
                    </div>
                )}
                <div className="space-y-1 font-normal md:hidden">
                    <div className="text-muted-foreground text-xs">
                        {seatsAndTable.join(' · ')}
                    </div>
                    {showsRsvps && <RsvpBadge guest={guest} />}
                    <DeliveryStatus guest={guest} />
                </div>
            </td>
            <td className="hidden px-4 py-3 md:table-cell">{guest.seats}</td>
            <td className="hidden px-4 py-3 md:table-cell">
                {guest.table_label ?? '—'}
            </td>
            {showsRsvps && (
                <td className="hidden px-4 py-3 md:table-cell">
                    <RsvpBadge guest={guest} />
                </td>
            )}
            {showsArrival && (
                <td className="px-2 py-3 md:px-4">
                    <ArrivalCell
                        guest={guest}
                        isOpen={checkInIsOpen}
                        onRegister={onRegisterArrival}
                        onUndo={onUndoArrival}
                    />
                </td>
            )}
            <td className="hidden px-4 py-3 md:table-cell">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCopy}
                        aria-label={`Copiar el enlace de ${guest.name}`}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
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
                        <Button variant="ghost" size="icon" asChild>
                            <a
                                href={guest.whatsapp_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={onWhatsappSend}
                                aria-label={`Enviar por WhatsApp a ${guest.name}`}
                                title="Enviar por WhatsApp"
                            >
                                <MessageCircleIcon />
                            </a>
                        </Button>
                    )}
                    {canEmail && (
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Enviar por correo a ${guest.name}`}
                            title="Enviar por correo"
                            onClick={() => setConfirming('email')}
                        >
                            <MailIcon />
                        </Button>
                    )}
                </div>
                <DeliveryStatus guest={guest} />
            </td>
            <td className="px-2 py-3 text-right md:px-4">
                <div className="hidden items-center justify-end gap-2 md:flex">
                    <Button variant="outline" size="icon" asChild>
                        <Link
                            href={edit([invitation.slug, guest.id])}
                            preserveScroll
                            preserveState
                            aria-label={`Editar ${guest.name}`}
                        >
                            <PencilIcon />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Eliminar ${guest.name}`}
                        onClick={() => setConfirming('remove')}
                    >
                        <TrashIcon />
                    </Button>
                </div>

                <RowActionsMenu label={`Acciones de ${guest.name}`}>
                    <DropdownMenuItem
                        onSelect={(event) => {
                            // Stays open so the check shows the link was copied
                            event.preventDefault();
                            onCopy();
                        }}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                        {isCopied ? 'Enlace copiado' : 'Copiar enlace'}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <a href={guest.url} target="_blank" rel="noreferrer">
                            <ExternalLinkIcon />
                            Abrir invitación
                        </a>
                    </DropdownMenuItem>
                    {canSend && (
                        <DropdownMenuItem asChild>
                            <a
                                href={guest.whatsapp_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={onWhatsappSend}
                            >
                                <MessageCircleIcon />
                                Enviar por WhatsApp
                            </a>
                        </DropdownMenuItem>
                    )}
                    {canEmail && (
                        <DropdownMenuItem
                            onSelect={() => setConfirming('email')}
                        >
                            <MailIcon />
                            Enviar por correo
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href={edit([invitation.slug, guest.id])}
                            preserveScroll
                            preserveState
                        >
                            <PencilIcon />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setConfirming('remove')}
                    >
                        <TrashIcon />
                        Eliminar
                    </DropdownMenuItem>
                </RowActionsMenu>

                {canEmail && (
                    <ConfirmDialog
                        open={confirming === 'email'}
                        onOpenChange={(open) =>
                            setConfirming(open ? 'email' : null)
                        }
                        title={`¿Enviar la invitación a ${guest.email}?`}
                        description={
                            guest.sent_at
                                ? 'Este invitado ya la recibió; se le enviará de nuevo.'
                                : undefined
                        }
                        confirmLabel="Enviar"
                        onConfirm={onEmailSend}
                    />
                )}
                <ConfirmDialog
                    open={confirming === 'remove'}
                    onOpenChange={(open) =>
                        setConfirming(open ? 'remove' : null)
                    }
                    title={`¿Eliminar a ${guest.name}?`}
                    description="También se borra su respuesta, y su enlace mostrará la invitación general."
                    confirmLabel="Eliminar"
                    variant="destructive"
                    onConfirm={onRemove}
                />
            </td>
        </tr>
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

function ArrivalCell({
    guest,
    isOpen,
    onRegister,
    onUndo,
}: {
    guest: Guest;
    isOpen: boolean;
    onRegister: () => void;
    onUndo: () => Promise<unknown>;
}) {
    if (!guest.checked_in_at) {
        return isOpen ? (
            <Button variant="outline" size="sm" onClick={onRegister}>
                Registrar
            </Button>
        ) : (
            <span className="text-muted-foreground">—</span>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <Badge
                variant={
                    guest.checked_in_seats < guest.seats ? 'outline' : 'default'
                }
                title={`Llegó a las ${new Date(guest.checked_in_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`}
            >
                Llegó · {guest.checked_in_seats}/{guest.seats}
            </Badge>
            {isOpen && (
                <ConfirmDialog
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Deshacer la llegada de ${guest.name}`}
                        >
                            <UndoIcon />
                        </Button>
                    }
                    title={`¿Deshacer la llegada de ${guest.name}?`}
                    confirmLabel="Deshacer"
                    onConfirm={onUndo}
                />
            )}
        </div>
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
