import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
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

/**
 * Sales close over WhatsApp, so opening a chat is the public pages' conversion: one listener covers every button and
 * sends Google Analytics a lead.
 */
export function useWhatsappLeadTracking(): void {
    const referral = useReferral();

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = event.target instanceof Element ? event.target.closest('a[href^="https://wa.me/"]') : null;

            if (link) {
                trackEvent('generate_lead', { method: 'whatsapp', referral: referral !== null });
            }
        };

        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, [referral]);
}
