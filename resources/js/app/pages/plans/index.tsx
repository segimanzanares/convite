import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import {
    create,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/PlanController';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import UrlModal from '@/components/url-modal';
import type { Plan, PlanFeature } from '@/types';
import PlanForm from './components/plan-form';
import PlanRow from './components/plan-row';

export default function PlansIndex({
    plans,
    modal,
    plan,
    features,
}: {
    plans: Plan[];
    modal: 'create' | 'edit' | null;
    plan: Plan | null;
    features: PlanFeature[];
}) {
    return (
        <>
            <Head title="Planes" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Planes"
                        description="Paquetes que se venden a los clientes. Los activos se muestran con su precio en la página principal."
                    />

                    <Button asChild>
                        <Link href={create()} preserveScroll preserveState>
                            <PlusIcon />
                            Nuevo plan
                        </Link>
                    </Button>
                </div>

                <DataTable
                    columns={[
                        'Plan',
                        { label: 'Precio', desktop: true },
                        { label: 'Invitados', desktop: true },
                        { label: 'Funciones', desktop: true },
                        'Estado',
                        '',
                    ]}
                    empty="Aún no hay planes."
                    isEmpty={plans.length === 0}
                >
                    {plans.map((plan) => (
                        <PlanRow key={plan.id} plan={plan} />
                    ))}
                </DataTable>
            </div>

            <UrlModal
                content={modal === 'edit' ? plan : modal}
                closeHref={index()}
                title={(shown) =>
                    shown === 'create' ? 'Nuevo plan' : 'Editar plan'
                }
                description={(shown) =>
                    shown === 'create'
                        ? 'Registra un paquete para vender a los clientes.'
                        : 'Los cambios no afectan las contrataciones ya vendidas.'
                }
            >
                {(shown) =>
                    shown !== 'create' ? (
                        <PlanForm
                            key={shown.id}
                            formRequest={update.form(shown.id)}
                            submitLabel="Guardar"
                            features={features}
                            defaultValues={shown}
                        />
                    ) : (
                        <PlanForm
                            formRequest={store.form()}
                            submitLabel="Crear plan"
                            features={features}
                        />
                    )
                }
            </UrlModal>
        </>
    );
}

PlansIndex.layout = {
    breadcrumbs: [{ title: 'Planes', href: index() }],
};
