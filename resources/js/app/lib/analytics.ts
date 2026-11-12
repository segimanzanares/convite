const GA_ID = import.meta.env.VITE_GA_ID?.trim();

export const CONSENT_STORAGE_KEY = 'cookie_consent';
export type ConsentChoice = 'granted' | 'denied';

declare global {
    interface Window {
        dataLayer: unknown[];
    }
}

let isLoaded = false;
let lastTrackedUrl: string | null = null;

// gtag.js distinguishes an `arguments` object from a plain array when it
// parses consent commands during bootstrap; pushing a real array (e.g. via
// rest params) makes it silently ignore `consent` calls and drop every hit.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept only so callers are typed.
function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params -- gtag.js requires `arguments`, not an array.
    window.dataLayer.push(arguments);
}

export function getStoredConsent(): ConsentChoice | null {
    try {
        const value = localStorage.getItem(CONSENT_STORAGE_KEY);

        return value === 'granted' || value === 'denied' ? value : null;
    } catch {
        return null;
    }
}

/**
 * Load gtag.js the first time a tracked page is shown, so the panel never
 * loads it unless the visit started on (or passed through) the landing page.
 * Off outside production builds or without VITE_GA_ID.
 */
function load(): boolean {
    if (!import.meta.env.PROD || !GA_ID) {
        return false;
    }

    if (isLoaded) {
        return true;
    }

    isLoaded = true;
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
    gtag('js', new Date());
    // Page views are sent by trackPageView() on every Inertia navigation
    gtag('config', GA_ID, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    return true;
}

/** Send a page view of the given Inertia URL (path and query). */
export function trackPageView(url: string) {
    if (!load()) {
        return;
    }

    lastTrackedUrl = url;
    gtag('event', 'page_view', {
        page_location: window.location.origin + url,
        page_path: url,
        page_title: document.title,
    });
}

export function updateAnalyticsConsent(choice: ConsentChoice) {
    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
        // Without storage the banner shows again on the next visit
    }

    if (!isLoaded) {
        return;
    }

    gtag('consent', 'update', { analytics_storage: choice });

    // The page view of the current page went out while consent was denied,
    // so it was dropped: send it again now that it counts.
    if (choice === 'granted' && lastTrackedUrl !== null) {
        trackPageView(lastTrackedUrl);
    }
}
