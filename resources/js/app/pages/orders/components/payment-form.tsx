import { Form } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/Admin/PaymentController';
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
import { paymentMethodLabels } from '@/lib/labels';
import { min, numeric, required } from '@/lib/validators';
import type { Order, PaymentMethod, ValidationSchema } from '@/types';

const schema: ValidationSchema = {
    amount: [
        required('El monto es obligatorio.'),
        numeric(),
        min(0.01, 'El monto debe ser mayor a cero.'),
    ],
    paid_at: [required('La fecha de pago es obligatoria.')],
    method: [required('Elige el método de pago.')],
};

/** Today's date in the browser's time zone, as "Y-m-d". */
function today(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 10);
}

export default function PaymentForm({
    order,
    paymentMethods,
}: {
    order: Order;
    paymentMethods: PaymentMethod[];
}) {
    const { formRef, onBefore, onChange } = useInertiaFormValidation(schema);
    const balance = Number(order.balance ?? 0);

    return (
        <Form
            ref={formRef}
            onBefore={onBefore}
            onChange={onChange}
            {...store.form(order.id)}
            options={{ preserveScroll: true }}
            className="flex min-h-0 flex-1 flex-col gap-4"
        >
            {({ processing, errors }) => (
                <>
                    <DialogBody className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Monto (MXN)</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    defaultValue={
                                        balance > 0 ? order.balance : undefined
                                    }
                                />
                                <InputError message={errors.amount} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="paid_at">Fecha de pago</Label>
                                <Input
                                    id="paid_at"
                                    name="paid_at"
                                    type="date"
                                    defaultValue={today()}
                                />
                                <InputError message={errors.paid_at} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="method">Método</Label>
                            <Select name="method" defaultValue="transfer">
                                <SelectTrigger id="method" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {paymentMethodLabels[method]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.method} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea id="notes" name="notes" rows={2} />
                            <InputError message={errors.notes} />
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button disabled={processing}>Registrar pago</Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}
