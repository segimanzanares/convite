import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
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
import { invitationStatusLabels } from '@/lib/labels';
import { maxLength, required } from '@/lib/validators';
import type {
    Invitation,
    InvitationStatus,
    Order,
    ValidationSchema,
} from '@/types';
import type { RouteFormDefinition } from '@/wayfinder';

/** Radix Select items cannot have an empty value, so "no order" uses this one. */
const NO_ORDER = 'none';

const schema: ValidationSchema = {
    slug: [required('El identificador es obligatorio.'), maxLength(255)],
    template: [required('Elige una plantilla.')],
    title: [required('El título es obligatorio.'), maxLength(255)],
    description: [required('La descripción es obligatoria.'), maxLength(500)],
};

type Props = {
    formRequest: RouteFormDefinition<'post'>;
    submitLabel: string;
    templates: string[];
    orders: Order[];
    defaultValues?: Invitation;
};

export default function InvitationForm({
    formRequest,
    submitLabel,
    templates,
    orders,
    defaultValues,
}: Props) {
    const { formRef, onBefore, onChange } = useInertiaFormValidation(schema);
    const [orderId, setOrderId] = useState(
        defaultValues?.order_id ? String(defaultValues.order_id) : NO_ORDER,
    );

    return (
        <Form
            ref={formRef}
            onBefore={onBefore}
            onChange={onChange}
            {...formRequest}
            options={{ preserveScroll: true }}
            className="flex min-h-0 flex-1 flex-col gap-4"
        >
            {({ processing, errors }) => (
                <>
                    <DialogBody className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Enlace</Label>
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground text-sm">
                                        /i/
                                    </span>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        placeholder="ana-y-luis"
                                        defaultValue={defaultValues?.slug}
                                    />
                                </div>
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="template">Plantilla</Label>
                                <Select
                                    name="template"
                                    defaultValue={defaultValues?.template}
                                >
                                    <SelectTrigger id="template" className="w-full">
                                        <SelectValue placeholder="Elige una plantilla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map((template) => (
                                            <SelectItem
                                                key={template}
                                                value={template}
                                            >
                                                {template}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.template} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="order_id">Contratación</Label>
                            <Select value={orderId} onValueChange={setOrderId}>
                                <SelectTrigger id="order_id" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NO_ORDER}>
                                        Sin contratación (demo)
                                    </SelectItem>
                                    {orders.map((order) => (
                                        <SelectItem
                                            key={order.id}
                                            value={String(order.id)}
                                        >
                                            {order.client?.name} · Plan{' '}
                                            {order.plan.name} (#{order.id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                name="order_id"
                                value={orderId === NO_ORDER ? '' : orderId}
                            />
                            <p className="text-muted-foreground text-xs">
                                La invitación pertenece al cliente de la
                                contratación, y sus páginas imprimibles dependen
                                del plan contratado.
                            </p>
                            <InputError message={errors.order_id} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="event_date">
                                    Fecha del evento
                                </Label>
                                <Input
                                    id="event_date"
                                    name="event_date"
                                    type="date"
                                    defaultValue={
                                        defaultValues?.event_date ?? undefined
                                    }
                                />
                                <InputError message={errors.event_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rsvp_deadline">
                                    Confirmar antes del
                                </Label>
                                <Input
                                    id="rsvp_deadline"
                                    name="rsvp_deadline"
                                    type="date"
                                    defaultValue={
                                        defaultValues?.rsvp_deadline ?? undefined
                                    }
                                />
                                <InputError message={errors.rsvp_deadline} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <Select
                                    name="status"
                                    defaultValue={defaultValues?.status ?? 'draft'}
                                >
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(
                                            Object.entries(
                                                invitationStatusLabels,
                                            ) as [InvitationStatus, string][]
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

                        <fieldset className="grid gap-4">
                            <legend className="mb-4 text-sm font-medium">
                                Vista previa al compartir el enlace
                            </legend>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Ana & Luis — Nuestra Boda"
                                    defaultValue={defaultValues?.title}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={2}
                                    defaultValue={defaultValues?.description}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="og_image">Imagen</Label>
                                <Input
                                    id="og_image"
                                    name="og_image"
                                    placeholder="/invitations/plantilla/og-image.jpg"
                                    defaultValue={
                                        defaultValues?.og_image ?? undefined
                                    }
                                />
                                <InputError message={errors.og_image} />
                            </div>
                        </fieldset>
                    </DialogBody>

                    <DialogFooter>
                        <Button disabled={processing}>{submitLabel}</Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}
