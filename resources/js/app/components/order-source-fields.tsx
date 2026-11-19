import { useState } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { orderSourceLabels } from '@/lib/labels';
import type { OrderSource } from '@/types';

const NO_SOURCE = 'none';

/**
 * How the client found Convite, for the order forms. A referral asks for the referral code of the client who
 * recommended them, which arrives in their first WhatsApp message when they came through a referral link. While the
 * referral program is off, the referral option is left out unless the order already is one.
 */
export default function OrderSourceFields({
    source: initialSource = null,
    referralCode = '',
    allowReferral,
    errors,
}: {
    source?: OrderSource | null;
    referralCode?: string;
    allowReferral: boolean;
    errors: Partial<Record<'source' | 'referral_code', string>>;
}) {
    const [source, setSource] = useState<string>(initialSource ?? NO_SOURCE);

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="source">¿Cómo nos conoció?</Label>
                <Select value={source} onValueChange={setSource}>
                    <SelectTrigger id="source" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={NO_SOURCE}>Sin registrar</SelectItem>
                        {(
                            Object.entries(orderSourceLabels) as [
                                OrderSource,
                                string,
                            ][]
                        )
                            .filter(
                                ([value]) =>
                                    allowReferral || value !== 'referral',
                            )
                            .map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                <input
                    type="hidden"
                    name="source"
                    value={source === NO_SOURCE ? '' : source}
                />
                <InputError message={errors.source} />
            </div>

            {source === 'referral' && (
                <div className="grid gap-2">
                    <Label htmlFor="referral_code">Código de referido</Label>
                    <Input
                        id="referral_code"
                        name="referral_code"
                        defaultValue={referralCode}
                        autoComplete="off"
                        className="uppercase"
                        placeholder="Ej. MARIA7K2Q"
                    />
                    <InputError message={errors.referral_code} />
                </div>
            )}
        </div>
    );
}
