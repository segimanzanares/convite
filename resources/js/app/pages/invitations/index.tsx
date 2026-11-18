import { Head, Link, router } from '@inertiajs/react';
import {
    BookHeartIcon,
    ClipboardCheckIcon,
    ExternalLinkIcon,
    FileTextIcon,
    ImagesIcon,
    PencilIcon,
    PlusIcon,
    UsersIcon,
    XIcon,
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
import { index as galleryIndex } from '@/actions/App/Http/Controllers/Admin/LiveGalleryController';
import { index as rsvpsIndex } from '@/actions/App/Http/Controllers/Admin/RsvpController';
import { index as wishesIndex } from '@/actions/App/Http/Controllers/Admin/WishController';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import InvitationSectionLinks from '@/components/invitation-sections';
import Pagination from '@/components/pagination';
import RowActionsMenu from '@/components/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UrlModal from '@/components/url-modal';
import { useListQuery } from '@/hooks/use-list-query';
import { formatDate } from '@/lib/format';
import { invitationSections } from '@/lib/invitation-sections';
import { invitationKindLabels, invitationStatusLabels } from '@/lib/labels';
import type {
    Invitation,
    InvitationKind,
    InvitationStatus,
    InvitationTemplate,
    Order,
    Paginated,
} from '@/types';
import InvitationForm from './components/invitation-form';

/** The query string keys of the list, kept while its modals are open. */
const LIST_QUERY = ['client', 'type', 'kind', 'status', 'page'] as const;

/** Radix Select items cannot have an empty value, so "no filter" uses this one. */
const ALL = 'all';

type InvitationType = 'demo' | 'order';

type Filters = {
    client: number | null;
    type: InvitationType | null;
    kind: InvitationKind | null;
    status: InvitationStatus | null;
};

const invitationTypeLabels: Record<InvitationType, string> = {
    demo: 'Demos',
    order: 'Con pedido',
};

export default function InvitationsIndex({
    invitations,
    filters,
    clients,
    modal,
    invitation,
    templates,
    orders,
}: {
    invitations: Paginated<Invitation>;
    filters: Filters;
    clients: { id: number; name: string }[];
    modal: 'create' | 'edit' | null;
    invitation: Invitation | null;
    templates: InvitationTemplate[];
    orders: Order[];
}) {
    const query = useListQuery(LIST_QUERY);
    const isFiltered = Object.values(filters).some((value) => value !== null);

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
                        <Link
                            href={create({ query })}
                            preserveScroll
                            preserveState
                        >
                            <PlusIcon />
                            Nueva invitación
                        </Link>
                    </Button>
                </div>

                <InvitationFilters filters={filters} clients={clients} />

                <DataTable
                    columns={[
                        'Invitación',
                        { label: 'Cliente', desktop: true },
                        { label: 'Evento', desktop: true },
                        'Estado',
                        '',
                    ]}
                    empty={
                        isFiltered
                            ? 'Ninguna invitación coincide con los filtros.'
                            : 'Aún no hay invitaciones.'
                    }
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
                closeHref={index({ query })}
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
                            formRequest={update.form(shown.slug, { query })}
                            submitLabel="Guardar"
                            templates={templates}
                            orders={orders}
                            defaultValues={shown}
                        />
                    ) : (
                        <InvitationForm
                            formRequest={store.form({ query })}
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

/** Filters by client, type (demos or sold through an order), kind of event and status. Changing one goes back to the first page. */
function InvitationFilters({
    filters,
    clients,
}: {
    filters: Filters;
    clients: { id: number; name: string }[];
}) {
    const apply = (changes: Partial<Record<keyof Filters, string | null>>) => {
        const next = {
            ...filters,
            ...Object.fromEntries(
                Object.entries(changes).map(([key, value]) => [
                    key,
                    value === ALL ? null : value,
                ]),
            ),
        };

        router.get(
            index({ query: next }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const isFiltered = Object.values(filters).some((value) => value !== null);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select
                value={filters.client ? String(filters.client) : ALL}
                onValueChange={(client) => apply({ client })}
            >
                <SelectTrigger aria-label="Cliente" className="w-full sm:w-56">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>Todos los clientes</SelectItem>
                    {clients.map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                            {client.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.type ?? ALL}
                onValueChange={(type) => apply({ type })}
            >
                <SelectTrigger aria-label="Tipo" className="w-full sm:w-44">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>Todos los tipos</SelectItem>
                    {Object.entries(invitationTypeLabels).map(
                        ([type, label]) => (
                            <SelectItem key={type} value={type}>
                                {label}
                            </SelectItem>
                        ),
                    )}
                </SelectContent>
            </Select>

            <Select
                value={filters.kind ?? ALL}
                onValueChange={(kind) => apply({ kind })}
            >
                <SelectTrigger
                    aria-label="Categoría"
                    className="w-full sm:w-48"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>Todas las categorías</SelectItem>
                    {Object.entries(invitationKindLabels).map(
                        ([kind, label]) => (
                            <SelectItem key={kind} value={kind}>
                                {label}
                            </SelectItem>
                        ),
                    )}
                </SelectContent>
            </Select>

            <Select
                value={filters.status ?? ALL}
                onValueChange={(status) => apply({ status })}
            >
                <SelectTrigger aria-label="Estado" className="w-full sm:w-44">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>Todos los estados</SelectItem>
                    {Object.entries(invitationStatusLabels).map(
                        ([status, label]) => (
                            <SelectItem key={status} value={status}>
                                {label}
                            </SelectItem>
                        ),
                    )}
                </SelectContent>
            </Select>

            {isFiltered && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        apply({
                            client: null,
                            type: null,
                            kind: null,
                            status: null,
                        })
                    }
                >
                    <XIcon />
                    Quitar filtros
                </Button>
            )}
        </div>
    );
}

/** On small screens the client and the date collapse under the title and the actions into a menu. */
function InvitationRow({ invitation }: { invitation: Invitation }) {
    const query = useListQuery(LIST_QUERY);
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
                            href={edit(invitation.slug, { query })}
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
                    {sections.gallery && (
                        <DropdownMenuItem asChild>
                            <Link href={galleryIndex(invitation.slug)}>
                                <ImagesIcon />
                                Galería en vivo
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {sections.wishes && (
                        <DropdownMenuItem asChild>
                            <Link href={wishesIndex(invitation.slug)}>
                                <BookHeartIcon />
                                Libro de deseos
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
                            href={edit(invitation.slug, { query })}
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
