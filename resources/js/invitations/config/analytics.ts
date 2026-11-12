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

/** Invitation pages whose path segment after the slug is kept; any other is a guest's token, or a mistyped one. */
const INVITATION_PAGES: Record<string, string> = {
  '': 'Invitación',
  tarjeta: 'Tarjeta impresa',
  pases: 'Pases de invitados',
};

/**
 * The page as Google Analytics gets it. Under /i/{slug} the guests' tokens (their personalized links, which open the
 * invitation as them) are left out of the path, and the title (the couple's or celebrant's names) becomes the kind of
 * page. Only the campaign parameters (utm_*) of the query string are kept.
 */
export function analyticsPage(location: Location = window.location, title = document.title) {
  const query = new URLSearchParams(
    [...new URLSearchParams(location.search)].filter(([key]) => key.startsWith('utm_')),
  ).toString();
  const invitation = location.pathname.match(/^\/i\/([^/]+)(?:\/([^/]*))?/);
  let path = location.pathname;
  let pageTitle = title;

  if (invitation) {
    const page = invitation[2] ?? '';
    const isKnownPage = Object.hasOwn(INVITATION_PAGES, page) && location.pathname.split('/').length <= 4;

    path = `/i/${invitation[1]}${isKnownPage && page ? `/${page}` : ''}`;
    pageTitle = isKnownPage ? INVITATION_PAGES[page] : 'Invitación personalizada';
  }

  const pagePath = query ? `${path}?${query}` : path;

  return { page_location: location.origin + pagePath, page_path: pagePath, page_title: pageTitle };
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
  // Set on the config, not only on the page view, so the automatic events
  // (scrolls, outbound clicks, engagement) carry the same cleaned page
  gtag('config', GA_ID, analyticsPage());
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
    gtag('config', GA_ID, analyticsPage());
  }
}
