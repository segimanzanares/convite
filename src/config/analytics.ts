const GA_ID = import.meta.env.VITE_GA_ID?.trim();

export const CONSENT_STORAGE_KEY = 'cookie_consent';
export type ConsentChoice = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// gtag.js distinguishes an `arguments` object from a plain array when it
// parses consent commands during bootstrap; pushing a real array (e.g. via
// rest params) makes it silently ignore `consent` calls and drop every hit.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept only so callers are typed.
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params -- gtag.js requires `arguments`, not an array.
  window.dataLayer.push(arguments);
}

export function getStoredConsent(): ConsentChoice | null {
  const value = localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === 'granted' || value === 'denied' ? value : null;
}

export function initAnalytics() {
  if (!import.meta.env.PROD || !GA_ID) return;

  window.dataLayer = window.dataLayer || [];

  // Google tag has Consent Mode enabled for this property: analytics_storage
  // must default to denied and only flips to granted once the visitor
  // accepts via the cookie banner, otherwise gtag.js drops every hit.
  gtag('consent', 'default', {
    analytics_storage: getStoredConsent() === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_ID);
}

export function updateAnalyticsConsent(choice: ConsentChoice) {
  localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'update', { analytics_storage: choice });

  // The `config` call already ran (and was dropped) while consent was
  // denied, and a bare `event` command doesn't reactivate the tag. Re-run
  // `config` itself so gtag.js reinitializes with the new consent state
  // and sends the automatic page_view.
  if (choice === 'granted' && GA_ID) {
    gtag('config', GA_ID);
  }
}
