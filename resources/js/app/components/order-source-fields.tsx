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
import type { OrderSource, PartnerOption } from '@/types';

const NO_SOURCE = 'none';
const NO_PARTNER = 'none';

/**
 * How the client found Convite, for the order forms. A referral asks for the referral code of the client who
 * recommended them, which arrives in their first WhatsApp message when they came through a referral link. While the
 * referral program is off, the referral option is left out unless the order already is one. A partner's
 * recommendation asks which partner ("aliado"), whose code arrives in the client's first WhatsApp message when they
 * came through the partner's link; a vendor outside the program may be left without one, and then no commission is
 * owed.
 */
export default function OrderSourceFields({
    source: initialSource = null,
    referralCode = '',
    partnerId: initialPartnerId = null,
    allowReferral,
    partners,
    errors,
}: {
    source?: OrderSource | null;
    referralCode?: string;
    partnerId?: number | null;
    allowReferral: boolean;
    partners: PartnerOption[];
    errors: Partial<Record<'source' | 'referral_code' | 'partner_id', string>>;
}) {
    const [source, setSource] = useState<string>(initialSource ?? NO_SOURCE);
    const [partnerId, setPartnerId] = useState<string>(
        initialPartnerId ? String(initialPartnerId) : NO_PARTNER,
    );

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid min-w-0 gap-2">
                <Label htmlFor="source">¿Cómo nos conoció?</Label>
                <Select value={source} onValueChange={setSource}>
                    <SelectTrigger id="source" className="w-full min-w-0">
                        <SelectValue className="min-w-0" />
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
                                    <span className="truncate">{label}</span>
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
                <div className="grid min-w-0 gap-2">
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

            {source === 'partner' && (
                <div className="grid min-w-0 gap-2">
                    <Label htmlFor="partner_id">Aliado</Label>
                    <Select value={partnerId} onValueChange={setPartnerId}>
                        <SelectTrigger id="partner_id" className="w-full min-w-0">
                            <SelectValue className="min-w-0" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={NO_PARTNER}>
                                <span className="truncate">
                                    Sin aliado (no genera comisión)
                                </span>
                            </SelectItem>
                            {partners.map((partner) => (
                                <SelectItem
                                    key={partner.id}
                                    value={String(partner.id)}
                                >
                                    <span className="truncate">
                                        {partner.name} · {partner.code}
                                        {!partner.is_active && ' (inactivo)'}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input
                        type="hidden"
                        name="partner_id"
                        value={partnerId === NO_PARTNER ? '' : partnerId}
                    />
                    <InputError message={errors.partner_id} />
                </div>
            )}
        </div>
    );
}
