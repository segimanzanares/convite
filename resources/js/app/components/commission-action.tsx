import { router } from "@inertiajs/react";
import { CheckIcon, Undo2Icon } from "lucide-react";
import {
    destroy,
    store,
} from "@/actions/App/Http/Controllers/Admin/PartnerCommissionController";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { Order } from "@/types";

/**
 * Marks a partner's commission on an order as paid once it is owed (the order is paid in full), or undoes it. Convite
 * pays the commission outside the system, so this only records it.
 */
export default function CommissionAction({ order }: { order: Order }) {
    const amount = formatMoney(order.commission_amount ?? 0);
    const send = (request: ReturnType<typeof store | typeof destroy>) =>
        new Promise((resolve) =>
            router.visit(request, { preserveScroll: true, onFinish: resolve }),
        );

    if (order.commission_status === "earned") {
        return (
            <ConfirmDialog
                trigger={
                    <Button size="sm" variant="outline">
                        <CheckIcon />
                        Marcar pagada
                    </Button>
                }
                title="¿Marcar la comisión como pagada?"
                description={`Registra que ya se le pagaron ${amount} al aliado.`}
                confirmLabel="Marcar pagada"
                onConfirm={() => send(store(order.id))}
            />
        );
    }

    if (order.commission_status === "paid") {
        return (
            <ConfirmDialog
                trigger={
                    <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Deshacer el pago de la comisión"
                    >
                        <Undo2Icon />
                        Deshacer
                    </Button>
                }
                title="¿Marcar la comisión como no pagada?"
                description={`La comisión de ${amount} vuelve a quedar por pagar.`}
                confirmLabel="Marcar no pagada"
                onConfirm={() => send(destroy(order.id))}
            />
        );
    }

    return null;
}
