import { Form } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/Admin/ClientUserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInertiaFormValidation } from '@/hooks/use-inertia-form-validation';
import { email, maxLength, required } from '@/lib/validators';
import type { Client, ValidationSchema } from '@/types';

const schema: ValidationSchema = {
    name: [required('El nombre es obligatorio.'), maxLength(255)],
    email: [
        required('El correo electrónico es obligatorio.'),
        email(),
        maxLength(255),
    ],
};

export default function ClientAccessForm({ client }: { client: Client }) {
    const { formRef, onBefore, onChange } = useInertiaFormValidation(schema);

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
                        <InputError message={errors.client} />

                        <div className="grid gap-2">
                            <Label htmlFor="access-name">Nombre</Label>
                            <Input
                                id="access-name"
                                name="name"
                                autoComplete="off"
                                defaultValue={client.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="access-email">
                                Correo electrónico
                            </Label>
                            <Input
                                id="access-email"
                                name="email"
                                type="email"
                                autoComplete="off"
                                defaultValue={client.email ?? undefined}
                            />
                            <InputError message={errors.email} />
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button disabled={processing}>Dar acceso</Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}
