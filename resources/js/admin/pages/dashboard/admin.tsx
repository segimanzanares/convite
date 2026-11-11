import { Head, Link } from '@inertiajs/react';
import {
    BanknoteIcon,
    CalendarDaysIcon,
    HandCoinsIcon,
    ReceiptIcon,
} from 'lucide-react';
import { show as showClient } from '@/actions/App/Http/Controllers/Admin/ClientController';
import { edit as editContent } from '@/actions/App/Http/Controllers/Admin/InvitationContentController';
import { show as showOrder } from '@/actions/App/Http/Controllers/Admin/OrderController';
import BarChart from '@/components/bar-chart';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import {
    formatDate,
    formatDaysAway,
    formatMoney,
    formatMonth,
} from '@/lib/format';
import { invitationStatusLabels, orderStatusLabels } from '@/lib/labels';
import { dashboard } from '@/routes';
import type { AdminTotals, Invitation, MonthlyRevenue, Order } from '@/types';

type Props = {
    totals: AdminTotals;
    revenue: MonthlyRevenue[];
    upcomingEvents: Invitation[];
    upcomingEventDays: number;
    ordersWithBalance: Order[];
};

/** Days from today (in the browser) to a "Y-m-d" date. */
function daysUntil(date: string): number {
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    return Math.round(
        (Date.parse(`${date}T00:00:00Z`) - today) / (24 * 60 * 60 * 1000),
    );
}

export default function AdminDashboard({
    totals,
    revenue,
    upcomingEvents,
    upcomingEventDays,
    ordersWithBalance,
}: Props) {
    const previousMonth = revenue.at(-2);

    return (
        <>
            <Head title="Panel" />

            <div className="space-y-10 p-4">
                <div>
                    <Heading
                        title="Panel"
                        description="Ventas, cobros y eventos de Convite"
                    />

                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Ventas del mes"
                            value={formatMoney(totals.sales_this_month)}
                            icon={ReceiptIcon}
                            hint={
                                previousMonth &&
                                `${formatMoney(previousMonth.sales)} el mes pasado`
                            }
                        />
                        <StatCard
                            label="Cobrado en el mes"
                            value={formatMoney(totals.collected_this_month)}
                            icon={BanknoteIcon}
                            hint={
                                previousMonth &&
                                `${formatMoney(previousMonth.collected)} el mes pasado`
                            }
                        />
                        <StatCard
                            label="Saldo por cobrar"
                            value={formatMoney(totals.balance_due)}
                            icon={HandCoinsIcon}
                            hint={`${ordersWithBalance.length} contrataciones con saldo`}
                        />
                        <StatCard
                            label="Eventos próximos"
                            value={totals.upcoming_events}
                            icon={CalendarDaysIcon}
                            hint={`En los próximos ${upcomingEventDays} días`}
                        />
                    </dl>
                </div>

                <section className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                    <BarChart
                        title={`Ventas y cobros de los últimos ${revenue.length} meses`}
                        series={[
                            { name: 'Ventas', className: 'bg-chart-3' },
                            { name: 'Cobrado', className: 'bg-chart-2' },
                        ]}
                        data={revenue.map((month) => ({
                            label: formatMonth(month.month),
                            values: [
                                Number(month.sales),
                                Number(month.collected),
                            ],
                        }))}
                        format={formatMoney}
                    />
                </section>

                <section className="space-y-4">
                    <Heading
                        variant="small"
                        title="Eventos próximos"
                        description={`Invitaciones de clientes con evento en los próximos ${upcomingEventDays} días`}
                    />
                    <DataTable
                        columns={['Fecha', 'Invitación', 'Cliente', 'Estado']}
                        empty="No hay eventos en los próximos días."
                        isEmpty={upcomingEvents.length === 0}
                    >
                        {upcomingEvents.map((invitation) => (
                            <tr key={invitation.id}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {formatDate(invitation.event_date)}
                                    <div className="text-muted-foreground text-xs">
                                        {formatDaysAway(
                                            daysUntil(invitation.event_date!),
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    <Link
                                        href={editContent(invitation.slug)}
                                        className="hover:underline"
                                    >
                                        {invitation.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">
                                    {invitation.client ? (
                                        <Link
                                            href={showClient(
                                                invitation.client.id,
                                            )}
                                            className="hover:underline"
                                        >
                                            {invitation.client.name}
                                        </Link>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge
                                        variant={
                                            invitation.status === 'published'
                                                ? 'outline'
                                                : 'destructive'
                                        }
                                    >
                                        {
                                            invitationStatusLabels[
                                                invitation.status
                                            ]
                                        }
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>

                <section className="space-y-4">
                    <Heading
                        variant="small"
                        title="Saldos pendientes"
                        description="Contrataciones activas o entregadas que aún no se pagan completas"
                    />
                    <DataTable
                        columns={[
                            'Cliente',
                            'Plan',
                            'Estado',
                            'Precio',
                            'Pagado',
                            'Saldo',
                        ]}
                        empty="Todas las contrataciones están pagadas."
                        isEmpty={ordersWithBalance.length === 0}
                    >
                        {ordersWithBalance.map((order) => (
                            <tr key={order.id}>
                                <td className="px-4 py-3 font-medium">
                                    <Link
                                        href={showOrder(order.id)}
                                        className="hover:underline"
                                    >
                                        {order.client?.name}
                                    </Link>
                                    <div className="text-muted-foreground text-xs font-normal">
                                        Desde el {formatDate(order.created_at)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">{order.plan.name}</td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline">
                                        {orderStatusLabels[order.status]}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 tabular-nums">
                                    {formatMoney(order.price)}
                                </td>
                                <td className="px-4 py-3 tabular-nums">
                                    {formatMoney(order.amount_paid ?? 0)}
                                </td>
                                <td className="px-4 py-3 font-medium tabular-nums">
                                    {formatMoney(order.balance ?? 0)}
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Panel', href: dashboard() }],
};
