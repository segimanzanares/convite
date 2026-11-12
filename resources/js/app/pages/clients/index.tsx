import { Form, Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
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
                    columns={['Nombre', 'Contacto', 'Contrataciones', '']}
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

function ClientRow({ client }: { client: Client }) {
    const onConfirmDelete = () =>
        new Promise((resolve) =>
            router.delete(destroy(client.id), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <tr>
            <td className="px-4 py-3 font-medium">
                <Link href={show(client.id)} className="hover:underline">
                    {client.name}
                </Link>
            </td>
            <td className="text-muted-foreground px-4 py-3">
                {client.email ?? '—'}
                {client.phone && <div className="text-xs">{client.phone}</div>}
            </td>
            <td className="text-muted-foreground px-4 py-3">
                {client.orders_count ?? 0}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
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

                    {!client.orders_count && (
                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label={`Eliminar ${client.name}`}
                                >
                                    <TrashIcon />
                                </Button>
                            }
                            title={`¿Eliminar a ${client.name}?`}
                            description="Se eliminarán también sus cuentas de acceso al panel. Esta acción no se puede deshacer."
                            confirmLabel="Eliminar"
                            variant="destructive"
                            onConfirm={onConfirmDelete}
                        />
                    )}
                </div>
            </td>
        </tr>
    );
}

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
