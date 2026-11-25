import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { buildWhatsappUrl } from '@/lib/contact';

/**
 * The discount of a visitor who came with a client's referral link (see App\Services\ReferralService) or a partner's
 * link (see App\Services\PartnerService). A visitor has at most one: the server keeps only the latest link.
 */
export type LandingReferral = {
    code: string;
    discount_percent: number;
};

export function useReferral(): LandingReferral | null {
    return usePage<{ referral?: LandingReferral | null }>().props.referral ?? null;
}

/** The partner ("aliado") whose link brought the visitor. */
export function usePartner(): LandingReferral | null {
    return usePage<{ partner?: LandingReferral | null }>().props.partner ?? null;
}

/**
 * The discount the landing announces, from a partner's link or a client's referral link. A partner may offer none.
 */
export function useLandingDiscount(): LandingReferral | null {
    const partner = usePartner();
    const referral = useReferral();
    const discount = partner ?? referral;

    return discount && discount.discount_percent > 0 ? discount : null;
}

/**
 * Builds the landing's WhatsApp links. A referred visitor's messages carry the code of the client or partner who sent
 * them, so the admin can apply the discount and record who recommended them on the order (and the partner's
 * commission).
 */
export function useWhatsappLink(): (message: string) => string {
    const partner = usePartner();
    const referral = useReferral();
    const code = (partner ?? referral)?.code;

    return (message) => buildWhatsappUrl(code ? `${message}\n\nTengo el código ${code}.` : message);
}

/**
 * Sales close over WhatsApp, so opening a chat is the public pages' conversion: one listener covers every button and
 * sends Google Analytics a lead. A lead from a partner carries their code (`partner_code`, to register in Google
 * Analytics as an event-scoped custom dimension), even when the visitor came back days after opening their link.
 */
export function useWhatsappLeadTracking(): void {
    const referral = useReferral();
    const partner = usePartner();

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = event.target instanceof Element ? event.target.closest('a[href^="https://wa.me/"]') : null;

            if (link) {
                trackEvent('generate_lead', {
                    method: 'whatsapp',
                    referral: referral !== null,
                    ...(partner && { partner_code: partner.code }),
                });
            }
        };

        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, [referral, partner]);
}
