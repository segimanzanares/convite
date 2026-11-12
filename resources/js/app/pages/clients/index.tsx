import { Form, Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    show,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/ClientController';
import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import RowActionsMenu from '@/components/row-actions-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import UrlModal from '@/components/url-modal';
import type { Client, Paginated } from '@/types';
import ClientForm from './components/client-form';

export default function ClientsIndex({
    clients,
    filters,
    modal,
    client,
}: {
    clients: Paginated<Client>;
    filters: { search: string | null };
    modal: 'create' | 'edit' | null;
    client: Client | null;
}) {
    return (
        <>
            <Head title="Clientes" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Clientes"
                        description="Personas a las que se les vende una invitación"
                    />

                    <Button asChild>
                        <Link href={create()} preserveScroll preserveState>
                            <PlusIcon />
                            Nuevo cliente
                        </Link>
                    </Button>
                </div>

                <Form
                    {...index.form()}
                    options={{ preserveState: true }}
                    className="flex max-w-md gap-2"
                >
                    <Input
                        name="search"
                        type="search"
                        placeholder="Buscar por nombre, correo o teléfono"
                        defaultValue={filters.search ?? ''}
                    />
                    <Button variant="outline" size="icon" aria-label="Buscar">
                        <SearchIcon />
                    </Button>
                </Form>

                <DataTable
                    columns={[
                        'Nombre',
                        { label: 'Contacto', desktop: true },
                        { label: 'Contrataciones', desktop: true },
                        '',
                    ]}
                    empty={
                        filters.search
                            ? 'Ningún cliente coincide con la búsqueda.'
                            : 'Aún no hay clientes.'
                    }
                    isEmpty={clients.data.length === 0}
                >
                    {clients.data.map((client) => (
                        <ClientRow key={client.id} client={client} />
                    ))}
                </DataTable>

                <Pagination meta={clients.meta} />
            </div>

            <UrlModal
                content={modal === 'edit' ? client : modal}
                closeHref={index({ query: { search: filters.search } })}
                title={(shown) =>
                    shown === 'create' ? 'Nuevo cliente' : 'Editar cliente'
                }
            >
                {(shown) =>
                    shown !== 'create' ? (
                        <ClientForm
                            key={shown.id}
                            formRequest={update.form(shown.id)}
                            submitLabel="Guardar"
                            defaultValues={shown}
                        />
                    ) : (
                        <ClientForm
                            formRequest={store.form()}
                            submitLabel="Crear cliente"
                        />
                    )
                }
            </UrlModal>
        </>
    );
}

/** On small screens the contact and the orders collapse under the name and the actions into a menu. */
function ClientRow({ client }: { client: Client }) {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const ordersCount = client.orders_count ?? 0;

    const onConfirmDelete = () =>
        new Promise((resolve) =>
            router.delete(destroy(client.id), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    const details = [
        client.email,
        client.phone,
        `${ordersCount} ${ordersCount === 1 ? 'contratación' : 'contrataciones'}`,
    ].filter(Boolean);

    return (
        <tr>
            <td className="px-2 py-3 font-medium md:px-4">
                <Link href={show(client.id)} className="hover:underline">
                    {client.name}
                </Link>
                <div className="text-muted-foreground text-xs font-normal break-all md:hidden">
                    {details.join(' · ')}
                </div>
            </td>
            <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {client.email ?? '—'}
                {client.phone && <div className="text-xs">{client.phone}</div>}
            </td>
            <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {ordersCount}
            </td>
            <td className="px-2 py-3 text-right md:px-4">
                <div className="hidden items-center justify-end gap-2 md:flex">
                    <Button variant="outline" size="icon" asChild>
                        <Link
                            href={edit(client.id)}
                            preserveScroll
                            preserveState
                            aria-label={`Editar ${client.name}`}
                        >
                            <PencilIcon />
                        </Link>
                    </Button>

                    {!ordersCount && (
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Eliminar ${client.name}`}
                            onClick={() => setIsConfirmingDelete(true)}
                        >
                            <TrashIcon />
                        </Button>
                    )}
                </div>

                <RowActionsMenu label={`Acciones de ${client.name}`}>
                    <DropdownMenuItem asChild>
                        <Link
                            href={edit(client.id)}
                            preserveScroll
                            preserveState
                        >
                            <PencilIcon />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    {!ordersCount && (
                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setIsConfirmingDelete(true)}
                        >
                            <TrashIcon />
                            Eliminar
                        </DropdownMenuItem>
                    )}
                </RowActionsMenu>

                <ConfirmDialog
                    open={isConfirmingDelete}
                    onOpenChange={setIsConfirmingDelete}
                    title={`¿Eliminar a ${client.name}?`}
                    description="Se eliminarán también sus cuentas de acceso al panel. Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    variant="destructive"
                    onConfirm={onConfirmDelete}
                />
            </td>
        </tr>
    );
}

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
