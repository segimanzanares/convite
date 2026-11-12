import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInertiaFormValidation } from '@/hooks/use-inertia-form-validation';
import { planFeatureLabels } from '@/lib/labels';
import { max, maxLength, min, numeric, required } from '@/lib/validators';
import type { Plan, PlanFeature, ValidationSchema } from '@/types';
import type { RouteFormDefinition } from '@/wayfinder';

type Props = {
    formRequest: RouteFormDefinition<'post'>;
    submitLabel: string;
    features: PlanFeature[];
    defaultValues?: Plan;
};

const schema: ValidationSchema = {
    name: [required('El nombre es obligatorio.'), maxLength(255)],
    slug: [required('El identificador es obligatorio.'), maxLength(255)],
    price: [required('El precio es obligatorio.'), numeric(), min(0)],
    max_guests: [numeric(), min(1)],
    sort_order: [required('El orden es obligatorio.'), numeric(), min(0), max(1000)],
};

export default function PlanForm({
    formRequest,
    submitLabel,
    features,
    defaultValues,
}: Props) {
    const { formRef, onBefore, onChange } = useInertiaFormValidation(schema);

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
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Estándar"
                                    defaultValue={defaultValues?.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Identificador</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="estandar"
                                    defaultValue={defaultValues?.slug}
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Precio (MXN)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue={defaultValues?.price}
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="max_guests">
                                    Límite de invitados
                                </Label>
                                <Input
                                    id="max_guests"
                                    name="max_guests"
                                    type="number"
                                    min="1"
                                    placeholder="Sin lista de invitados"
                                    defaultValue={
                                        defaultValues?.max_guests ?? undefined
                                    }
                                />
                                <InputError message={errors.max_guests} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                                defaultValue={
                                    defaultValues?.description ?? undefined
                                }
                            />
                            <InputError message={errors.description} />
                        </div>

                        <fieldset className="grid gap-3">
                            <legend className="mb-3 text-sm font-medium">
                                Funciones
                            </legend>
                            {features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3"
                                >
                                    <Checkbox
                                        id={`feature-${feature}`}
                                        name="features[]"
                                        value={feature}
                                        defaultChecked={defaultValues?.features.includes(
                                            feature,
                                        )}
                                    />
                                    <Label htmlFor={`feature-${feature}`}>
                                        {planFeatureLabels[feature]}
                                    </Label>
                                </div>
                            ))}
                            <p className="text-muted-foreground text-xs">
                                Con «Lista de invitados» o «Confirmaciones en
                                línea», el cliente puede tener acceso al panel.
                            </p>
                            <InputError message={errors.features} />
                        </fieldset>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">Orden</Label>
                                <Input
                                    id="sort_order"
                                    name="sort_order"
                                    type="number"
                                    min="0"
                                    defaultValue={defaultValues?.sort_order ?? 0}
                                />
                                <InputError message={errors.sort_order} />
                            </div>

                            <div className="flex items-center gap-3 sm:pt-6">
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    value="1"
                                    defaultChecked={
                                        defaultValues?.is_active ?? true
                                    }
                                />
                                <Label htmlFor="is_active">
                                    Se ofrece a nuevos clientes
                                </Label>
                            </div>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button disabled={processing}>{submitLabel}</Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}
