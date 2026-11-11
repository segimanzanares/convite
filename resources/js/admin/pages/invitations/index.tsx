import { Head, Link } from '@inertiajs/react';
import {
    ExternalLinkIcon,
    FileTextIcon,
    PencilIcon,
    PlusIcon,
} from 'lucide-react';
import { edit as editContent } from '@/actions/App/Http/Controllers/Admin/InvitationContentController';
import { show as showClient } from '@/actions/App/Http/Controllers/Admin/ClientController';
import {
    create,
    edit,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/InvitationController';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import InvitationSectionLinks from '@/components/invitation-sections';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UrlModal from '@/components/url-modal';
import { formatDate } from '@/lib/format';
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
                        description="Cada invitación usa una plantilla de resources/js/site/templates"
                    />

                    <Button asChild>
                        <Link href={create()} preserveScroll preserveState>
                            <PlusIcon />
                            Nueva invitación
                        </Link>
                    </Button>
                </div>

                <DataTable
                    columns={['Invitación', 'Cliente', 'Evento', 'Estado', '']}
                    empty="Aún no hay invitaciones."
                    isEmpty={invitations.data.length === 0}
                >
                    {invitations.data.map((invitation) => (
                        <tr key={invitation.id}>
                            <td className="px-4 py-3 font-medium">
                                {invitation.title}
                                <div className="text-muted-foreground text-xs font-normal">
                                    /i/{invitation.slug} · {invitation.template_label}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                {invitation.client ? (
                                    <Link
                                        href={showClient(invitation.client.id)}
                                        className="hover:underline"
                                    >
                                        {invitation.client.name}
                                    </Link>
                                ) : (
                                    <span className="text-muted-foreground">
                                        Demo
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                {formatDate(invitation.event_date)}
                            </td>
                            <td className="px-4 py-3">
                                <Badge variant="outline">
                                    {invitationStatusLabels[invitation.status]}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {invitation.kind && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={editContent(
                                                    invitation.slug,
                                                )}
                                            >
                                                <FileTextIcon />
                                                Contenido
                                            </Link>
                                        </Button>
                                    )}
                                    <InvitationSectionLinks
                                        invitation={invitation}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                    >
                                        <a
                                            href={invitation.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Abrir ${invitation.title}`}
                                        >
                                            <ExternalLinkIcon />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                    >
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
                            </td>
                        </tr>
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

InvitationsIndex.layout = {
    breadcrumbs: [{ title: 'Invitaciones', href: index() }],
};
