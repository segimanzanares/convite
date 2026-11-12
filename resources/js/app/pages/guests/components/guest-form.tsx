import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInertiaFormValidation } from '@/hooks/use-inertia-form-validation';
import { email, max, maxLength, min, required } from '@/lib/validators';
import type { Guest, ValidationSchema } from '@/types';
import type { RouteFormDefinition } from '@/wayfinder';

/** The most seats a guest may have when the plan sets no lower limit. */
const MAX_SEATS = 50;

function guestSchema(maxSeats: number): ValidationSchema {
    return {
        name: [required('El nombre es obligatorio.'), maxLength(255)],
        seats: [
            required('Indica cuántos lugares tiene.'),
            min(1, 'Debe tener al menos un lugar.'),
            max(
                maxSeats,
                `Tu plan permite hasta ${maxSeats} lugares por invitación.`,
            ),
        ],
        phone: [maxLength(30)],
        email: [email(), maxLength(255)],
        table_label: [maxLength(50)],
    };
}

export default function GuestForm({
    formRequest,
    submitLabel,
    defaultValues,
    maxSeats = MAX_SEATS,
}: {
    formRequest: RouteFormDefinition<'post'>;
    submitLabel: string;
    defaultValues?: Guest;
    /** The plan's limit of seats per guest. */
    maxSeats?: number;
}) {
    const { formRef, onBefore, onChange } = useInertiaFormValidation(
        guestSchema(maxSeats),
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
                        <InputError message={errors.guests} />

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                autoComplete="off"
                                placeholder="Juan Pérez y familia"
                                defaultValue={defaultValues?.name}
                            />
                            <p className="text-muted-foreground text-xs">
                                Una persona, pareja o familia que recibe un
                                solo enlace.
                            </p>
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="seats">Lugares</Label>
                                <Input
                                    id="seats"
                                    name="seats"
                                    type="number"
                                    min="1"
                                    max={maxSeats}
                                    defaultValue={defaultValues?.seats ?? 1}
                                />
                                <InputError message={errors.seats} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="table_label">Mesa</Label>
                                <Input
                                    id="table_label"
                                    name="table_label"
                                    autoComplete="off"
                                    defaultValue={
                                        defaultValues?.table_label ?? undefined
                                    }
                                />
                                <InputError message={errors.table_label} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="off"
                                    defaultValue={
                                        defaultValues?.phone ?? undefined
                                    }
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    defaultValue={
                                        defaultValues?.email ?? undefined
                                    }
                                />
                                <InputError message={errors.email} />
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
