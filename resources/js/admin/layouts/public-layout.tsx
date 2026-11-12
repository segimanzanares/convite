import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { initAnalytics } from '@/lib/analytics';

/**
 * Frame of the pages outside the panel (the landing page and the door of the event), served with the brand theme by
 * resources/views/public.blade.php: Google Analytics and its cookie banner, without the panel's chrome.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        initAnalytics();
    }, []);

    return (
        <>
            {children}
            <CookieConsentBanner />
        </>
    );
}
