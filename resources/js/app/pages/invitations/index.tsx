import { Head, Link } from '@inertiajs/react';
import {
    ClipboardCheckIcon,
    ExternalLinkIcon,
    FileTextIcon,
    PencilIcon,
    PlusIcon,
    UsersIcon,
} from 'lucide-react';
import { show as showClient } from '@/actions/App/Http/Controllers/Admin/ClientController';
import { index as guestsIndex } from '@/actions/App/Http/Controllers/Admin/GuestController';
import { edit as editContent } from '@/actions/App/Http/Controllers/Admin/InvitationContentController';
import {
    create,
    edit,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/InvitationController';
import { index as rsvpsIndex } from '@/actions/App/Http/Controllers/Admin/RsvpController';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import InvitationSectionLinks from '@/components/invitation-sections';
import Pagination from '@/components/pagination';
import RowActionsMenu from '@/components/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import UrlModal from '@/components/url-modal';
import { formatDate } from '@/lib/format';
import { invitationSections } from '@/lib/invitation-sections';
import { invitationStatusLabels } from '@/lib/labels';
import type { Invitation, InvitationTemplate, Order, Paginated } from '@/types';
import InvitationForm from './components/invitation-form';

export default function InvitationsIndex({
    invitations,
    modal,
    invitation,
    templates,
    orders,
}: {
    invitations: Paginated<Invitation>;
    modal: 'create' | 'edit' | null;
    invitation: Invitation | null;
    templates: InvitationTemplate[];
    orders: Order[];
}) {
    return (
        <>
            <Head title="Invitaciones" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Invitaciones"
                        description="Cada invitación usa una plantilla de resources/js/invitations/templates"
                    />

                    <Button asChild>
                        <Link href={create()} preserveScroll preserveState>
                            <PlusIcon />
                            Nueva invitación
                        </Link>
                    </Button>
                </div>

                <DataTable
                    columns={[
                        'Invitación',
                        { label: 'Cliente', desktop: true },
                        { label: 'Evento', desktop: true },
                        'Estado',
                        '',
                    ]}
                    empty="Aún no hay invitaciones."
                    isEmpty={invitations.data.length === 0}
                >
                    {invitations.data.map((invitation) => (
                        <InvitationRow
                            key={invitation.id}
                            invitation={invitation}
                        />
                    ))}
                </DataTable>

                <Pagination meta={invitations.meta} />
            </div>

            <UrlModal
                content={modal === 'edit' ? invitation : modal}
                closeHref={index()}
                title={(shown) =>
                    shown === 'create'
                        ? 'Nueva invitación'
                        : 'Editar invitación'
                }
                className="sm:max-w-2xl"
            >
                {(shown) =>
                    shown !== 'create' ? (
                        <InvitationForm
                            key={shown.id}
                            formRequest={update.form(shown.slug)}
                            submitLabel="Guardar"
                            templates={templates}
                            orders={orders}
                            defaultValues={shown}
                        />
                    ) : (
                        <InvitationForm
                            formRequest={store.form()}
                            submitLabel="Crear invitación"
                            templates={templates}
                            orders={orders}
                        />
                    )
                }
            </UrlModal>
        </>
    );
}

/** On small screens the client and the date collapse under the title and the actions into a menu. */
function InvitationRow({ invitation }: { invitation: Invitation }) {
    const sections = invitationSections(invitation);

    return (
        <tr>
            <td className="px-2 py-3 font-medium md:px-4">
                {invitation.title}
                <div className="text-muted-foreground text-xs font-normal break-all">
                    /i/{invitation.slug} · {invitation.template_label}
                </div>
                <div className="text-muted-foreground text-xs font-normal md:hidden">
                    {invitation.client?.name ?? 'Demo'}
                    {invitation.event_date &&
                        ` · ${formatDate(invitation.event_date)}`}
                </div>
            </td>
            <td className="hidden px-4 py-3 md:table-cell">
                {invitation.client ? (
                    <Link
                        href={showClient(invitation.client.id)}
                        className="hover:underline"
                    >
                        {invitation.client.name}
                    </Link>
                ) : (
                    <span className="text-muted-foreground">Demo</span>
                )}
            </td>
            <td className="hidden px-4 py-3 whitespace-nowrap md:table-cell">
                {formatDate(invitation.event_date)}
            </td>
            <td className="px-2 py-3 md:px-4">
                <Badge variant="outline">
                    {invitationStatusLabels[invitation.status]}
                </Badge>
            </td>
            <td className="px-2 py-3 text-right md:px-4">
                <div className="hidden items-center justify-end gap-2 md:flex">
                    {invitation.kind && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={editContent(invitation.slug)}>
                                <FileTextIcon />
                                Contenido
                            </Link>
                        </Button>
                    )}
                    <InvitationSectionLinks invitation={invitation} />
                    <Button variant="outline" size="icon" asChild>
                        <a
                            href={invitation.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir ${invitation.title}`}
                        >
                            <ExternalLinkIcon />
                        </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <Link
                            href={edit(invitation.slug)}
                            preserveScroll
                            preserveState
                            aria-label={`Editar ${invitation.title}`}
                        >
                            <PencilIcon />
                        </Link>
                    </Button>
                </div>

                <RowActionsMenu label={`Acciones de ${invitation.title}`}>
                    {invitation.kind && (
                        <DropdownMenuItem asChild>
                            <Link href={editContent(invitation.slug)}>
                                <FileTextIcon />
                                Contenido
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {sections.guests && (
                        <DropdownMenuItem asChild>
                            <Link href={guestsIndex(invitation.slug)}>
                                <UsersIcon />
                                Invitados
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {sections.rsvps && (
                        <DropdownMenuItem asChild>
                            <Link href={rsvpsIndex(invitation.slug)}>
                                <ClipboardCheckIcon />
                                Confirmaciones
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <a
                            href={invitation.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <ExternalLinkIcon />
                            Abrir
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={edit(invitation.slug)}
                            preserveScroll
                            preserveState
                        >
                            <PencilIcon />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                </RowActionsMenu>
            </td>
        </tr>
    );
}

InvitationsIndex.layout = {
    breadcrumbs: [{ title: 'Invitaciones', href: index() }],
};
