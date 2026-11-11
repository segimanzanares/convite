import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import {
    index as clientsIndex,
    show as showClient,
} from '@/actions/App/Http/Controllers/Admin/ClientController';
import {
    destroy,
    edit,
    show,
} from '@/actions/App/Http/Controllers/Admin/OrderController';
import {
    create as createPayment,
    destroy as destroyPayment,
} from '@/actions/App/Http/Controllers/Admin/PaymentController';
import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UrlModal from '@/components/url-modal';
import { formatDate, formatMoney } from '@/lib/format';
import {
    orderStatusLabels,
    paymentMethodLabels,
    planFeatureLabels,
} from '@/lib/labels';
import type { Order, Payment, PaymentMethod } from '@/types';
import OrderEditForm from './components/order-edit-form';
import PaymentForm from './components/payment-form';

type Props = {
    order: Order;
    paymentMethods: PaymentMethod[];
    modal: 'edit' | 'payment' | null;
};

export default function OrderShow({ order, paymentMethods, modal }: Props) {
    const payments = order.payments ?? [];
    const invitations = order.invitations ?? [];

    const onConfirmDelete = () =>
        new Promise((resolve) =>
            router.delete(destroy(order.id), { onFinish: resolve }),
        );

    const removePayment = (payment: Payment) =>
        new Promise((resolve) =>
            router.delete(destroyPayment(payment.id), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <>
            <Head title={`Contratación de ${order.client?.name}`} />

            <div className="space-y-10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title={`Plan ${order.plan.name}`}
                        description={`${order.client?.name} · ${formatDate(order.created_at)}`}
                    />

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(order.id)} preserveScroll preserveState>
                                <PencilIcon />
                                Editar
                            </Link>
                        </Button>
                        {payments.length === 0 && (
                            <ConfirmDialog
                                trigger={
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        aria-label="Eliminar contratación"
                                    >
                                        <TrashIcon />
                                    </Button>
                                }
                                title="¿Eliminar la contratación?"
                                description="Sus invitaciones quedarán sin contratación. Esta acción no se puede deshacer."
                                confirmLabel="Eliminar"
                                variant="destructive"
                                onConfirm={onConfirmDelete}
                            />
                        )}
                    </div>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Summary label="Precio" value={formatMoney(order.price)} />
                    <Summary
                        label="Pagado"
                        value={formatMoney(order.amount_paid ?? 0)}
                    />
                    <Summary
                        label="Saldo pendiente"
                        value={formatMoney(order.balance ?? 0)}
                    />
                    <Summary
                        label="Estado"
                        value={orderStatusLabels[order.status]}
                    />
                </dl>

                <section className="space-y-3">
                    <Heading
                        variant="small"
                        title="Condiciones contratadas"
                        description="Copia del plan al momento de la venta; no cambia si el plan se edita."
                    />
                    <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="secondary">
                            {order.plan.max_guests
                                ? `Hasta ${order.plan.max_guests} invitados`
                                : 'Sin lista de invitados'}
                        </Badge>
                        {order.plan.features.map((feature) => (
                            <Badge key={feature} variant="outline">
                                {planFeatureLabels[feature]}
                            </Badge>
                        ))}
                    </div>
                    {order.notes && (
                        <p className="text-muted-foreground max-w-prose text-sm whitespace-pre-line">
                            {order.notes}
                        </p>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Heading variant="small" title="Pagos" />
                        <Button size="sm" asChild>
                            <Link
                                href={createPayment(order.id)}
                                preserveScroll
                                preserveState
                            >
                                <PlusIcon />
                                Registrar pago
                            </Link>
                        </Button>
                    </div>

                    <DataTable
                        columns={['Fecha', 'Monto', 'Método', 'Notas', '']}
                        empty="Aún no hay pagos registrados."
                        isEmpty={payments.length === 0}
                    >
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="px-4 py-3">
                                    {formatDate(payment.paid_at)}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {formatMoney(payment.amount)}
                                </td>
                                <td className="text-muted-foreground px-4 py-3">
                                    {paymentMethodLabels[payment.method]}
                                </td>
                                <td className="text-muted-foreground px-4 py-3">
                                    {payment.notes ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <ConfirmDialog
                                        trigger={
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="Eliminar pago"
                                            >
                                                <TrashIcon />
                                            </Button>
                                        }
                                        title="¿Eliminar el pago?"
                                        description={`Pago de ${formatMoney(payment.amount)} del ${formatDate(payment.paid_at)}.`}
                                        confirmLabel="Eliminar"
                                        variant="destructive"
                                        onConfirm={() => removePayment(payment)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>

                {invitations.length > 0 && (
                    <section className="space-y-3">
                        <Heading variant="small" title="Invitaciones" />
                        <ul className="space-y-1 text-sm">
                            {invitations.map((invitation) => (
                                <li key={invitation.id}>
                                    <a
                                        href={invitation.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:underline"
                                    >
                                        {invitation.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <UrlModal
                content={modal}
                closeHref={show(order.id)}
                title={(shown) =>
                    shown === 'edit' ? 'Editar contratación' : 'Registrar pago'
                }
            >
                {(shown) =>
                    shown === 'edit' ? (
                        <OrderEditForm order={order} />
                    ) : (
                        <PaymentForm
                            order={order}
                            paymentMethods={paymentMethods}
                        />
                    )
                }
            </UrlModal>
        </>
    );
}

function Summary({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="mt-1 text-lg font-semibold">{value}</dd>
        </div>
    );
}

OrderShow.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Clientes', href: clientsIndex() },
        {
            title: props.order.client?.name ?? 'Cliente',
            href: showClient(props.order.client_id),
        },
        { title: `Plan ${props.order.plan.name}`, href: show(props.order.id) },
    ],
});
