import { usePage } from '@inertiajs/react';
import { buildWhatsappUrl } from '@/lib/contact';

/** The discount of a visitor who came with a client's referral link (see App\Services\ReferralService). */
export type LandingReferral = {
    code: string;
    discount_percent: number;
};

export function useReferral(): LandingReferral | null {
    return usePage<{ referral?: LandingReferral | null }>().props.referral ?? null;
}

/**
 * Builds the landing's WhatsApp links. A referred visitor's messages carry their referral code, so the admin can
 * apply the discount and record who recommended them on the order.
 */
export function useWhatsappLink(): (message: string) => string {
    const referral = useReferral();

    return (message) =>
        buildWhatsappUrl(referral ? `${message}\n\nTengo el código de referido ${referral.code}.` : message);
}
