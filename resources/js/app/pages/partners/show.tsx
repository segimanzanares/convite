import { Head, Link, router } from "@inertiajs/react";
import {
    CheckIcon,
    CopyIcon,
    DownloadIcon,
    HandCoinsIcon,
    PencilIcon,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { show as showOrder } from "@/actions/App/Http/Controllers/Admin/OrderController";
import { payEarned } from "@/actions/App/Http/Controllers/Admin/PartnerCommissionController";
import {
    edit,
    index,
    show,
} from "@/actions/App/Http/Controllers/Admin/PartnerController";
import CommissionAction from "@/components/commission-action";
import ConfirmDialog from "@/components/confirm-dialog";
import DataTable from "@/components/data-table";
import DetailButton from "@/components/detail-button";
import Heading from "@/components/heading";
import StatCard from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { formatDate, formatMoney } from "@/lib/format";
import {
    commissionStatusLabels,
    orderStatusLabels,
    partnerKindLabels,
} from "@/lib/labels";
import type { Order, Partner } from "@/types";

type Props = {
    partner: Partner;
    orders: Order[];
    /** Where the short link lands, with the UTM parameters Google Analytics reads. */
    landingUrl: string;
};

export default function PartnerShow({ partner, orders, landingUrl }: Props) {
    const [copiedText, copy] = useClipboard();
    const qrRef = useRef<HTMLCanvasElement>(null);
    const summary = partner.summary;
    const owed = Number(summary?.commission_earned ?? 0);

    const downloadQr = () => {
        const link = document.createElement("a");
        link.href = qrRef.current?.toDataURL("image/png") ?? "";
        link.download = `qr-aliado-${partner.code.toLowerCase()}.png`;
        link.click();
    };

    const onPayEarned = () =>
        new Promise((resolve) =>
            router.post(
                payEarned(partner.id),
                {},
                { preserveScroll: true, onFinish: resolve },
            ),
        );

    return (
        <>
            <Head title={partner.name} />

            <div className="space-y-10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Heading
                            title={partner.name}
                            description={[
                                partnerKindLabels[partner.kind],
                                partner.email,
                                partner.phone,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        />
                        <div className="-mt-6 flex flex-wrap gap-2">
                            {!partner.is_active && (
                                <Badge variant="secondary">
                                    Inactivo: su enlace ya no aplica
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {Number(partner.commission_percent)}% de
                                comisión
                            </Badge>
                            {partner.discount_percent > 0 && (
                                <Badge variant="outline">
                                    {partner.discount_percent}% de descuento a
                                    sus clientes
                                </Badge>
                            )}
                        </div>
                        {partner.notes && (
                            <p className="text-muted-foreground mt-3 max-w-prose text-sm whitespace-pre-line">
                                {partner.notes}
                            </p>
                        )}
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={edit(partner.id)}>
                            <PencilIcon />
                            Editar
                        </Link>
                    </Button>
                </div>

                <section className="border-sidebar-border/70 dark:border-sidebar-border flex flex-wrap items-start gap-6 rounded-xl border p-4">
                    <QRCodeCanvas
                        ref={qrRef}
                        value={partner.link}
                        size={512}
                        marginSize={2}
                        // The canvas draws at 512 px for the PNG download, and shows smaller
                        style={{ width: 128, height: 128 }}
                        className="shrink-0 rounded-md border bg-white"
                    />
                    <div className="min-w-0 flex-1 space-y-3">
                        <div>
                            <h2 className="font-medium">Su enlace</h2>
                            <p className="text-muted-foreground text-sm">
                                Para su bio, sus historias o impreso como QR.
                                Quien entre con él ve{" "}
                                {partner.discount_percent > 0
                                    ? `su ${partner.discount_percent}% de descuento`
                                    : "la página"}{" "}
                                y su código{" "}
                                <span className="font-mono font-semibold">
                                    {partner.code}
                                </span>{" "}
                                va en el mensaje de WhatsApp; la visita se
                                cuenta en Google Analytics con el medio
                                «aliado».
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <code className="bg-muted max-w-full truncate rounded px-2 py-1 text-xs">
                                {partner.link}
                            </code>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copy(partner.link)}
                            >
                                {copiedText === partner.link ? (
                                    <CheckIcon />
                                ) : (
                                    <CopyIcon />
                                )}
                                Copiar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={downloadQr}
                            >
                                <DownloadIcon />
                                Descargar QR
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-xs break-all">
                            Lleva a {landingUrl}
                        </p>
                    </div>
                </section>

                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Ventas"
                        value={summary?.sales_count ?? 0}
                        hint={`${formatMoney(summary?.sales_total ?? 0)} vendidos`}
                    />
                    <StatCard
                        label="Comisión pendiente"
                        value={formatMoney(summary?.commission_pending ?? 0)}
                        hint="De contrataciones aún no liquidadas"
                    />
                    <StatCard
                        label="Por pagar"
                        value={formatMoney(owed)}
                        hint={
                            owed > 0 ? (
                                <ConfirmDialog
                                    trigger={
                                        <button
                                            type="button"
                                            className="text-foreground inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
                                        >
                                            <HandCoinsIcon className="size-3" />
                                            Marcar todo como pagado
                                        </button>
                                    }
                                    title="¿Marcar todas sus comisiones como pagadas?"
                                    description={`Registra que ya se le pagaron ${formatMoney(owed)} al aliado.`}
                                    confirmLabel="Marcar pagadas"
                                    onConfirm={onPayEarned}
                                />
                            ) : (
                                "De contrataciones ya liquidadas"
                            )
                        }
                    />
                    <StatCard
                        label="Pagada"
                        value={formatMoney(summary?.commission_paid ?? 0)}
                    />
                </dl>

                <section className="space-y-4">
                    <Heading
                        variant="small"
                        title="Contrataciones"
                        description="Se ligan al aliado desde la contratación, en «¿Cómo nos conoció?». La comisión se le paga cuando el cliente liquida."
                    />

                    <DataTable
                        columns={[
                            "Cliente",
                            { label: "Precio", desktop: true },
                            "Comisión",
                            { label: "Estado", desktop: true },
                            "",
                        ]}
                        empty="Aún no hay contrataciones de este aliado."
                        isEmpty={orders.length === 0}
                    >
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-2 py-3 font-medium md:px-4">
                                    <Link
                                        href={showOrder(order.id)}
                                        className="hover:underline"
                                    >
                                        {order.client?.name}
                                    </Link>
                                    <div className="text-muted-foreground text-xs font-normal">
                                        Plan {order.plan.name} ·{" "}
                                        {formatDate(order.created_at)}
                                    </div>
                                    <div className="text-muted-foreground text-xs font-normal md:hidden">
                                        {formatMoney(order.price)} ·{" "}
                                        {orderStatusLabels[order.status]}
                                    </div>
                                </td>
                                <td className="hidden px-4 py-3 md:table-cell">
                                    {formatMoney(order.price)}
                                    <div className="text-muted-foreground text-xs">
                                        Saldo {formatMoney(order.balance ?? 0)}
                                    </div>
                                </td>
                                <td className="px-2 py-3 md:px-4">
                                    <span className="font-medium whitespace-nowrap">
                                        {formatMoney(
                                            order.commission_amount ?? 0,
                                        )}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        {" "}
                                        ({Number(order.commission_percent)}%)
                                    </span>
                                    {order.commission_status && (
                                        <div>
                                            <Badge
                                                variant={
                                                    order.commission_status ===
                                                    "earned"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className="mt-1"
                                            >
                                                {
                                                    commissionStatusLabels[
                                                        order.commission_status
                                                    ]
                                                }
                                            </Badge>
                                        </div>
                                    )}
                                </td>
                                <td className="hidden px-4 py-3 md:table-cell">
                                    <Badge variant="outline">
                                        {orderStatusLabels[order.status]}
                                    </Badge>
                                </td>
                                <td className="px-2 py-3 text-right md:px-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <CommissionAction order={order} />
                                        <DetailButton
                                            href={showOrder(order.id)}
                                            label={`Ver detalle de la contratación de ${order.client?.name ?? "este cliente"}`}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </DataTable>
                </section>
            </div>
        </>
    );
}

PartnerShow.layout = (props: Props) => ({
    breadcrumbs: [
        { title: "Aliados", href: index() },
        { title: props.partner.name, href: show(props.partner.id) },
    ],
});
