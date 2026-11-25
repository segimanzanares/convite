import { Form, Head, Link, router } from "@inertiajs/react";
import { EyeIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
    create,
    destroy,
    edit,
    index,
    show,
    store,
    update,
} from "@/actions/App/Http/Controllers/Admin/PartnerController";
import ConfirmDialog from "@/components/confirm-dialog";
import DataTable from "@/components/data-table";
import DetailButton from "@/components/detail-button";
import Heading from "@/components/heading";
import Pagination from "@/components/pagination";
import RowActionsMenu from "@/components/row-actions-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import UrlModal from "@/components/url-modal";
import { useListQuery } from "@/hooks/use-list-query";
import { formatMoney } from "@/lib/format";
import { partnerKindLabels } from "@/lib/labels";
import type { Paginated, Partner, PartnerKind } from "@/types";
import PartnerForm from "./components/partner-form";

/** The query string keys of the list, kept while its modals are open. */
const LIST_QUERY = ["search", "page"] as const;

export default function PartnersIndex({
    partners,
    filters,
    kinds,
    modal,
    partner,
}: {
    partners: Paginated<Partner>;
    filters: { search: string | null };
    kinds: PartnerKind[];
    modal: "create" | "edit" | null;
    partner: Partner | null;
}) {
    const query = useListQuery(LIST_QUERY);

    return (
        <>
            <Head title="Aliados" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Aliados"
                        description="Wedding planners, influencers y otros aliados que nos traen clientes a cambio de una comisión"
                    />

                    <Button asChild>
                        <Link
                            href={create({ query })}
                            preserveScroll
                            preserveState
                        >
                            <PlusIcon />
                            Nuevo aliado
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
                        placeholder="Buscar por nombre, código, correo o teléfono"
                        defaultValue={filters.search ?? ""}
                    />
                    <Button variant="outline" size="icon" aria-label="Buscar">
                        <SearchIcon />
                    </Button>
                </Form>

                <DataTable
                    columns={[
                        "Aliado",
                        { label: "Código", desktop: true },
                        { label: "Comisión", desktop: true },
                        { label: "Ventas", desktop: true },
                        "Por pagar",
                        "",
                    ]}
                    empty={
                        filters.search
                            ? "Ningún aliado coincide con la búsqueda."
                            : "Aún no hay aliados."
                    }
                    isEmpty={partners.data.length === 0}
                >
                    {partners.data.map((partner) => (
                        <PartnerRow key={partner.id} partner={partner} />
                    ))}
                </DataTable>

                <Pagination meta={partners.meta} />
            </div>

            <UrlModal
                content={modal === "edit" ? partner : modal}
                closeHref={index({ query })}
                title={(shown) =>
                    shown === "create" ? "Nuevo aliado" : "Editar aliado"
                }
            >
                {(shown) =>
                    shown !== "create" ? (
                        <PartnerForm
                            key={shown.id}
                            formRequest={update.form(shown.id, { query })}
                            submitLabel="Guardar"
                            kinds={kinds}
                            defaultValues={shown}
                        />
                    ) : (
                        <PartnerForm
                            formRequest={store.form()}
                            submitLabel="Crear aliado"
                            kinds={kinds}
                        />
                    )
                }
            </UrlModal>
        </>
    );
}

/** On small screens the code, commission and sales collapse under the name and the actions into a menu. */
function PartnerRow({ partner }: { partner: Partner }) {
    const query = useListQuery(LIST_QUERY);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const summary = partner.summary;
    const salesCount = summary?.sales_count ?? 0;
    const owed = Number(summary?.commission_earned ?? 0);
    // Quotes are not sales, but they still keep the partner from being deleted
    const canDelete = (partner.orders_count ?? 0) === 0;

    const onConfirmDelete = () =>
        new Promise((resolve) =>
            router.delete(destroy(partner.id, { query }), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <tr>
            <td className="px-2 py-3 font-medium md:px-4">
                <Link href={show(partner.id)} className="hover:underline">
                    {partner.name}
                </Link>
                {!partner.is_active && (
                    <Badge variant="secondary" className="ml-2">
                        Inactivo
                    </Badge>
                )}
                <div className="text-muted-foreground text-xs font-normal">
                    {partnerKindLabels[partner.kind]}
                    <span className="md:hidden">
                        {" · "}
                        {partner.code} · {Number(partner.commission_percent)}% ·{" "}
                        {salesCount} {salesCount === 1 ? "venta" : "ventas"}
                    </span>
                </div>
            </td>
            <td className="hidden px-4 py-3 font-mono text-sm md:table-cell">
                {partner.code}
            </td>
            <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {Number(partner.commission_percent)}%
                {partner.discount_percent > 0 && (
                    <div className="text-xs">
                        {partner.discount_percent}% de descuento a sus clientes
                    </div>
                )}
            </td>
            <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {salesCount}
                {salesCount > 0 && (
                    <div className="text-xs">
                        {formatMoney(summary?.sales_total ?? 0)}
                    </div>
                )}
            </td>
            <td className="px-2 py-3 whitespace-nowrap md:px-4">
                {owed > 0 ? (
                    <span className="font-medium">{formatMoney(owed)}</span>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </td>
            <td className="px-2 py-3 text-right md:px-4">
                <div className="hidden items-center justify-end gap-2 md:flex">
                    <DetailButton
                        href={show(partner.id)}
                        label={`Ver detalle de ${partner.name}`}
                    />
                    <Button variant="outline" size="icon" asChild>
                        <Link
                            href={edit(partner.id, { query })}
                            preserveScroll
                            preserveState
                            aria-label={`Editar ${partner.name}`}
                        >
                            <PencilIcon />
                        </Link>
                    </Button>

                    {canDelete && (
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Eliminar ${partner.name}`}
                            onClick={() => setIsConfirmingDelete(true)}
                        >
                            <TrashIcon />
                        </Button>
                    )}
                </div>

                <RowActionsMenu label={`Acciones de ${partner.name}`}>
                    <DropdownMenuItem asChild>
                        <Link href={show(partner.id)}>
                            <EyeIcon />
                            Ver detalle
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={edit(partner.id, { query })}
                            preserveScroll
                            preserveState
                        >
                            <PencilIcon />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    {canDelete && (
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
                    title={`¿Eliminar a ${partner.name}?`}
                    description="Su enlace dejará de funcionar. Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    variant="destructive"
                    onConfirm={onConfirmDelete}
                />
            </td>
        </tr>
    );
}

PartnersIndex.layout = {
    breadcrumbs: [{ title: "Aliados", href: index() }],
};
