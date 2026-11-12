import { Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import {
    destroy,
    edit,
} from '@/actions/App/Http/Controllers/Admin/PlanController';
import ConfirmDialog from '@/components/confirm-dialog';
import RowActionsMenu from '@/components/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { formatMoney } from '@/lib/format';
import { planFeatureLabels } from '@/lib/labels';
import type { Plan } from '@/types';

/** On small screens the price, invitations and features collapse under the name and the actions into a menu. */
export default function PlanRow({ plan }: { plan: Plan }) {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const isSold = (plan.orders_count ?? 0) > 0;

    const onConfirmDelete = () =>
        new Promise((resolve) =>
            router.delete(destroy(plan.id), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    const details = [
        formatMoney(plan.price),
        plan.max_guests && `${plan.max_guests} invitaciones`,
        plan.max_seats_per_guest &&
            `hasta ${plan.max_seats_per_guest} lugares c/u`,
    ].filter(Boolean);

    return (
        <tr>
            <td className="px-2 py-3 font-medium md:px-4">
                {plan.name}
                <div className="text-muted-foreground text-xs font-normal">
                    {plan.slug}
                </div>
                <div className="text-muted-foreground text-xs font-normal md:hidden">
                    {details.join(' · ')}
                </div>
                {plan.features.length > 0 && (
                    <div className="text-muted-foreground text-xs font-normal md:hidden">
                        {plan.features
                            .map((feature) => planFeatureLabels[feature])
                            .join(', ')}
                    </div>
                )}
            </td>
            <td className="hidden px-4 py-3 whitespace-nowrap md:table-cell">
                {formatMoney(plan.price)}
            </td>
            <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                {plan.max_guests ?? '—'}
                {plan.max_seats_per_guest && (
                    <div className="text-xs">
                        hasta {plan.max_seats_per_guest} lugares c/u
                    </div>
                )}
            </td>
            <td className="hidden px-4 py-3 md:table-cell">
                <div className="flex flex-wrap gap-1">
                    {plan.features.length === 0 && (
                        <span className="text-muted-foreground">—</span>
                    )}
                    {plan.features.map((feature) => (
                        <Badge key={feature} variant="outline">
                            {planFeatureLabels[feature]}
                        </Badge>
                    ))}
                </div>
            </td>
            <td className="px-2 py-3 md:px-4">
                <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                    {plan.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
            </td>
            <td className="px-2 py-3 text-right md:px-4">
                <div className="hidden items-center justify-end gap-2 md:flex">
                    <Button variant="outline" size="icon" asChild>
                        <Link
                            href={edit(plan.id)}
                            preserveScroll
                            preserveState
                            aria-label={`Editar ${plan.name}`}
                        >
                            <PencilIcon />
                        </Link>
                    </Button>

                    {!isSold && (
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Eliminar ${plan.name}`}
                            onClick={() => setIsConfirmingDelete(true)}
                        >
                            <TrashIcon />
                        </Button>
                    )}
                </div>

                <RowActionsMenu label={`Acciones de ${plan.name}`}>
                    <DropdownMenuItem asChild>
                        <Link href={edit(plan.id)} preserveScroll preserveState>
                            <PencilIcon />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    {!isSold && (
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
                    title={`¿Eliminar el plan ${plan.name}?`}
                    description="El plan aún no tiene contrataciones. Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    variant="destructive"
                    onConfirm={onConfirmDelete}
                />
            </td>
        </tr>
    );
}
