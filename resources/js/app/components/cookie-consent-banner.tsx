import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getStoredConsent, updateAnalyticsConsent } from '@/lib/analytics';

export function CookieConsentBanner() {
    const [visible, setVisible] = useState(() => getStoredConsent() === null);

    if (!visible) return null;

    const respond = (choice: 'granted' | 'denied') => {
        updateAnalyticsConsent(choice);
        setVisible(false);
    };

    return (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-primary/95 px-5 py-4 text-white shadow-[0_20px_50px_-15px_rgba(42,26,43,0.6)] backdrop-blur-md sm:bottom-5 print:hidden">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
                <p className="flex-1 text-center text-sm leading-relaxed text-white/80 sm:text-left">
                    Usamos cookies de análisis para entender cómo se usa este sitio. Puedes aceptarlas o rechazarlas.
                </p>
                <div className="flex shrink-0 gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-white/75 hover:bg-white/10 hover:text-white"
                        onClick={() => respond('denied')}
                    >
                        Rechazar
                    </Button>
                    <Button size="sm" className="rounded-full bg-gold px-5 text-ink hover:bg-gold-light" onClick={() => respond('granted')}>
                        Aceptar
                    </Button>
                </div>
            </div>
        </div>
    );
}
