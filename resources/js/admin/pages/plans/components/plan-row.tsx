import { Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import {
    destroy,
    edit,
} from '@/actions/App/Http/Controllers/Admin/PlanController';
import ConfirmDialog from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/format';
import { planFeatureLabels } from '@/lib/labels';
import type { Plan } from '@/types';

export default function PlanRow({ plan }: { plan: Plan }) {
    const isSold = (plan.orders_count ?? 0) > 0;

    const onConfirmDelete = () =>
        new Promise((resolve) =>
            router.delete(destroy(plan.id), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <tr>
            <td className="px-4 py-3 font-medium">
                {plan.name}
                <div className="text-muted-foreground text-xs font-normal">
                    {plan.slug}
                </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                {formatMoney(plan.price)}
            </td>
            <td className="text-muted-foreground px-4 py-3">
                {plan.max_guests ?? '—'}
            </td>
            <td className="px-4 py-3">
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
            <td className="px-4 py-3">
                <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                    {plan.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
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
                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label={`Eliminar ${plan.name}`}
                                >
                                    <TrashIcon />
                                </Button>
                            }
                            title={`¿Eliminar el plan ${plan.name}?`}
                            description="El plan aún no tiene contrataciones. Esta acción no se puede deshacer."
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
