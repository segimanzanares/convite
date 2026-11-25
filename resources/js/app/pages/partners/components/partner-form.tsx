import { Form } from "@inertiajs/react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInertiaFormValidation } from "@/hooks/use-inertia-form-validation";
import { partnerKindLabels } from "@/lib/labels";
import {
    email,
    max,
    maxLength,
    min,
    numeric,
    required,
} from "@/lib/validators";
import type { Partner, PartnerKind, ValidationSchema } from "@/types";
import type { RouteFormDefinition } from "@/wayfinder";

const schema: ValidationSchema = {
    name: [required("El nombre es obligatorio."), maxLength(255)],
    phone: [maxLength(30)],
    email: [email(), maxLength(255)],
    code: [maxLength(20)],
    commission_percent: [
        required("La comisión es obligatoria."),
        numeric(),
        min(0),
        max(100),
    ],
    discount_percent: [
        required("El descuento es obligatorio."),
        numeric(),
        min(0),
        max(100),
    ],
};

export default function PartnerForm({
    formRequest,
    submitLabel,
    kinds,
    defaultValues,
}: {
    formRequest: RouteFormDefinition<"post">;
    submitLabel: string;
    kinds: PartnerKind[];
    defaultValues?: Partner;
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
                        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Persona o negocio"
                                    defaultValue={defaultValues?.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kind">Tipo</Label>
                                <Select
                                    name="kind"
                                    defaultValue={
                                        defaultValues?.kind ?? "wedding_planner"
                                    }
                                >
                                    <SelectTrigger
                                        id="kind"
                                        className="w-full sm:w-44"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kinds.map((kind) => (
                                            <SelectItem key={kind} value={kind}>
                                                {partnerKindLabels[kind]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kind} />
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
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>
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
                            <Label htmlFor="code">Código</Label>
                            <Input
                                id="code"
                                name="code"
                                autoComplete="off"
                                className="font-mono uppercase"
                                placeholder={
                                    defaultValues
                                        ? undefined
                                        : "Se genera con su nombre si lo dejas vacío"
                                }
                                defaultValue={defaultValues?.code}
                            />
                            <p className="text-muted-foreground text-xs">
                                Solo letras y números. Va en su enlace
                                (/a/CÓDIGO) y en los mensajes de WhatsApp de sus
                                clientes.
                                {defaultValues &&
                                    " Si lo cambias, el enlace que ya compartió deja de funcionar."}
                            </p>
                            <InputError message={errors.code} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="commission_percent">
                                    Comisión (%)
                                </Label>
                                <Input
                                    id="commission_percent"
                                    name="commission_percent"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    defaultValue={
                                        defaultValues?.commission_percent ??
                                        "10"
                                    }
                                />
                                <p className="text-muted-foreground text-xs">
                                    Del precio de cada contratación que traiga.
                                    Cambiarla no afecta las ya asignadas.
                                </p>
                                <InputError
                                    message={errors.commission_percent}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="discount_percent">
                                    Descuento para sus clientes (%)
                                </Label>
                                <Input
                                    id="discount_percent"
                                    name="discount_percent"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    defaultValue={
                                        defaultValues?.discount_percent ?? 0
                                    }
                                />
                                <p className="text-muted-foreground text-xs">
                                    Se anuncia en la página a quien llegue con
                                    su enlace; se aplica a mano en el precio.
                                </p>
                                <InputError message={errors.discount_percent} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notas internas</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                placeholder="Datos para pagarle (banco, CLABE), acuerdos..."
                                defaultValue={defaultValues?.notes ?? undefined}
                            />
                            <InputError message={errors.notes} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                value="1"
                                defaultChecked={
                                    defaultValues?.is_active ?? true
                                }
                            />
                            <Label htmlFor="is_active">
                                Activo: su enlace y su descuento funcionan
                            </Label>
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
