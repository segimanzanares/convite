import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/Admin/OrderController';
import InputError from '@/components/input-error';
import OrderSourceFields from '@/components/order-source-fields';
import { Button } from '@/components/ui/button';
import { DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInertiaFormValidation } from '@/hooks/use-inertia-form-validation';
import { formatMoney } from '@/lib/format';
import {
    invitationKindLabels,
    orderStatusLabels,
    planTypeLabels,
} from '@/lib/labels';
import { min, numeric, required } from '@/lib/validators';
import type {
    Client,
    InvitationKind,
    OrderStatus,
    PartnerOption,
    Plan,
    ValidationSchema,
} from '@/types';

const schema: ValidationSchema = {
    plan_id: [required('Elige un plan.')],
    price: [required('El precio es obligatorio.'), numeric(), min(0)],
};

export default function OrderCreateForm({
    client,
    plans,
    referralsEnabled,
    partners,
    videoKinds,
}: {
    client: Client;
    plans: Plan[];
    referralsEnabled: boolean;
    partners: PartnerOption[];
    videoKinds: InvitationKind[];
}) {
    const { formRef, onBefore, onChange } = useInertiaFormValidation(schema);
    const [price, setPrice] = useState('');
    const [planId, setPlanId] = useState('');
    // A video invitation's order creates its invitation, so the form asks for the event
    const sellsVideo =
        plans.find((plan) => String(plan.id) === planId)?.type ===
        'video_invitation';

    const onPlanChange = (id: string) => {
        setPlanId(id);
        setPrice(plans.find((plan) => String(plan.id) === id)?.price ?? '');
    };

    return (
        <Form
            ref={formRef}
            onBefore={onBefore}
            onChange={onChange}
            {...store.form(client.id)}
            options={{ preserveScroll: true }}
            className="flex min-h-0 flex-1 flex-col gap-4"
        >
            {({ processing, errors }) => (
                <>
                    <DialogBody className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="plan_id">Plan</Label>
                            <Select name="plan_id" onValueChange={onPlanChange}>
                                <SelectTrigger id="plan_id" className="w-full">
                                    <SelectValue placeholder="Elige un plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem
                                            key={plan.id}
                                            value={String(plan.id)}
                                        >
                                            {plan.type !== 'web_invitation' &&
                                                `${planTypeLabels[plan.type]} · `}
                                            {plan.name} ·{' '}
                                            {formatMoney(plan.price)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.plan_id} />
                        </div>

                        {sellsVideo && (
                            <div className="space-y-4 rounded-lg border p-4">
                                <p className="text-muted-foreground text-sm">
                                    Se crea la invitación del video. Después
                                    capturas su contenido y lo generas.
                                </p>
                                <div className="grid gap-2">
                                    <Label htmlFor="event_kind">
                                        Tipo de evento
                                    </Label>
                                    <Select name="event_kind">
                                        <SelectTrigger
                                            id="event_kind"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Elige el tipo de evento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {videoKinds.map((kind) => (
                                                <SelectItem
                                                    key={kind}
                                                    value={kind}
                                                >
                                                    {invitationKindLabels[kind]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.event_kind} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="event_date">
                                            Fecha del evento
                                        </Label>
                                        <Input
                                            id="event_date"
                                            name="event_date"
                                            type="date"
                                        />
                                        <InputError
                                            message={errors.event_date}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="event_time">Hora</Label>
                                        <Input
                                            id="event_time"
                                            name="event_time"
                                            type="time"
                                        />
                                        <InputError
                                            message={errors.event_time}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Precio (MXN)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(event.target.value)
                                    }
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <Select name="status" defaultValue="quoted">
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(
                                            Object.entries(orderStatusLabels) as [
                                                OrderStatus,
                                                string,
                                            ][]
                                        ).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>

                        <OrderSourceFields
                            allowReferral={referralsEnabled}
                            partners={partners}
                            errors={errors}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea id="notes" name="notes" rows={3} />
                            <InputError message={errors.notes} />
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button disabled={processing}>Crear contratación</Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}
