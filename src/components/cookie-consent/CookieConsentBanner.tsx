import { useState } from 'react';
import { getStoredConsent, updateAnalyticsConsent } from '../../config/analytics';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => getStoredConsent() === null);

  if (!visible) return null;

  const respond = (choice: 'granted' | 'denied') => {
    updateAnalyticsConsent(choice);
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-ink text-white px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="font-jost text-[13px] leading-[1.7] text-white/85 flex-1 text-center sm:text-left">
          Usamos cookies de análisis para entender cómo se usa este sitio. Puedes aceptarlas o rechazarlas.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            className="font-jost text-[11px] tracking-[0.2em] uppercase text-white/70 py-3 px-5 cursor-pointer hover:text-white transition-colors"
            onClick={() => respond('denied')}
          >
            Rechazar
          </button>
          <button
            type="button"
            className="font-jost text-[11px] tracking-[0.2em] uppercase text-ink bg-gold py-3 px-6 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
            onClick={() => respond('granted')}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
