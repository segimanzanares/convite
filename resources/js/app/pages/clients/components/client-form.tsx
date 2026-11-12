import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInertiaFormValidation } from '@/hooks/use-inertia-form-validation';
import { email, maxLength, required } from '@/lib/validators';
import type { Client, ValidationSchema } from '@/types';
import type { RouteFormDefinition } from '@/wayfinder';

const schema: ValidationSchema = {
    name: [required('El nombre es obligatorio.'), maxLength(255)],
    phone: [maxLength(30)],
    email: [email(), maxLength(255)],
};

export default function ClientForm({
    formRequest,
    submitLabel,
    defaultValues,
}: {
    formRequest: RouteFormDefinition<'post'>;
    submitLabel: string;
    defaultValues?: Client;
}) {
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
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                autoComplete="off"
                                placeholder="Nombre del cliente o de la pareja"
                                defaultValue={defaultValues?.name}
                            />
                            <InputError message={errors.name} />
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

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notas internas</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                defaultValue={defaultValues?.notes ?? undefined}
                            />
                            <InputError message={errors.notes} />
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
