import { Head, Link, router } from '@inertiajs/react';
import { KeyRoundIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import {
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/Admin/ClientController';
import {
    create as createAccess,
    destroy as destroyAccess,
} from '@/actions/App/Http/Controllers/Admin/ClientUserController';
import { edit as editInvitation } from '@/actions/App/Http/Controllers/Admin/InvitationController';
import {
    create as createOrder,
    show as showOrder,
} from '@/actions/App/Http/Controllers/Admin/OrderController';
import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UrlModal from '@/components/url-modal';
import { formatDate, formatMoney } from '@/lib/format';
import { invitationStatusLabels, orderStatusLabels } from '@/lib/labels';
import type { Client, ClientUser, Invitation, Order, Plan } from '@/types';
import ClientAccessForm from './components/client-access-form';
import OrderCreateForm from './components/order-create-form';

type Props = {
    client: Client;
    orders: Order[];
    users: ClientUser[];
    invitations: Invitation[];
    canHavePanelAccess: boolean;
    plans: Plan[];
    modal: 'order' | 'access' | null;
};

export default function ClientShow({
    client,
    orders,
    users,
    invitations,
    canHavePanelAccess,
    plans,
    modal,
}: Props) {
    const removeAccess = (user: ClientUser) =>
        new Promise((resolve) =>
            router.delete(
                destroyAccess({ client: client.id, user: user.id }),
                { preserveScroll: true, onFinish: resolve },
            ),
        );

    return (
        <>
            <Head title={client.name} />

            <div className="space-y-10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Heading
                            title={client.name}
                            description={
                                [client.email, client.phone]
                                    .filter(Boolean)
                                    .join(' · ') || 'Sin datos de contacto'
                            }
                        />
                        {client.notes && (
                            <p className="text-muted-foreground -mt-6 max-w-prose text-sm whitespace-pre-line">
                                {client.notes}
                            </p>
                        )}
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={edit(client.id)}>
                            <PencilIcon />
                            Editar
                        </Link>
                    </Button>
                </div>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Heading variant="small" title="Contrataciones" />
                        <Button size="sm" asChild>
                            <Link
                                href={createOrder(client.id)}
                                preserveScroll
                                preserveState
                            >
                                <PlusIcon />
                                Nueva contratación
                            </Link>
                        </Button>
                    </div>

                    <DataTable
                        columns={['Plan', 'Precio', 'Pagado', 'Saldo', 'Estado']}
                        empty="Aún no hay contrataciones."
                        isEmpty={orders.length === 0}
                    >
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-4 py-3 font-medium">
                                    <Link
                                        href={showOrder(order.id)}
                                        className="hover:underline"
                                    >
                                        {order.plan.name}
                                    </Link>
                                    <div className="text-muted-foreground text-xs font-normal">
                                        {formatDate(order.created_at)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {formatMoney(order.price)}
                                </td>
                                <td className="px-4 py-3">
                                    {formatMoney(order.amount_paid ?? 0)}
                                </td>
                                <td className="px-4 py-3">
                                    {formatMoney(order.balance ?? 0)}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline">
                                        {orderStatusLabels[order.status]}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Heading
                            variant="small"
                            title="Acceso al panel"
                            description={
                                canHavePanelAccess
                                    ? 'Cuentas con las que el cliente administra sus invitados y confirmaciones.'
                                    : 'Disponible cuando una contratación incluye lista de invitados o confirmaciones en línea.'
                            }
                        />
                        {canHavePanelAccess && (
                            <Button size="sm" asChild>
                                <Link
                                    href={createAccess(client.id)}
                                    preserveScroll
                                    preserveState
                                >
                                    <KeyRoundIcon />
                                    Dar acceso
                                </Link>
                            </Button>
                        )}
                    </div>

                    {users.length > 0 && (
                        <DataTable
                            columns={['Nombre', 'Correo electrónico', '']}
                            empty=""
                            isEmpty={false}
                        >
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <ConfirmDialog
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    aria-label={`Quitar acceso a ${user.name}`}
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            }
                                            title={`¿Quitar el acceso a ${user.name}?`}
                                            description="Se eliminará su cuenta y ya no podrá entrar al panel."
                                            confirmLabel="Quitar acceso"
                                            variant="destructive"
                                            onConfirm={() => removeAccess(user)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </DataTable>
                    )}
                </section>

                <section className="space-y-4">
                    <Heading
                        variant="small"
                        title="Invitaciones"
                        description="Se ligan a una contratación desde la sección Invitaciones."
                    />

                    <DataTable
                        columns={['Invitación', 'Evento', 'Estado', '']}
                        empty="Aún no hay invitaciones ligadas a este cliente."
                        isEmpty={invitations.length === 0}
                    >
                        {invitations.map((invitation) => (
                            <tr key={invitation.id}>
                                <td className="px-4 py-3 font-medium">
                                    {invitation.title}
                                    <a
                                        href={invitation.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground block text-xs font-normal hover:underline"
                                    >
                                        /i/{invitation.slug}
                                    </a>
                                </td>
                                <td className="px-4 py-3">
                                    {formatDate(invitation.event_date)}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline">
                                        {invitationStatusLabels[invitation.status]}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="outline" size="icon" asChild>
                                        <Link
                                            href={editInvitation(invitation.slug)}
                                            aria-label={`Editar ${invitation.title}`}
                                        >
                                            <PencilIcon />
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>
            </div>

            <UrlModal
                content={modal}
                closeHref={show(client.id)}
                title={(shown) =>
                    shown === 'order' ? 'Nueva contratación' : 'Dar acceso al panel'
                }
                description={(shown) =>
                    shown === 'order'
                        ? 'El precio se toma del plan y se puede ajustar.'
                        : 'Le enviaremos un correo para que elija su contraseña.'
                }
            >
                {(shown) =>
                    shown === 'order' ? (
                        <OrderCreateForm client={client} plans={plans} />
                    ) : (
                        <ClientAccessForm client={client} />
                    )
                }
            </UrlModal>
        </>
    );
}

ClientShow.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Clientes', href: index() },
        { title: props.client.name, href: show(props.client.id) },
    ],
});
