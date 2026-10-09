/** Absolute URL of the digital invitation, from one of its sub-pages
    (e.g. /i/<slug>/tarjeta or /i/<slug>/pases → /i/<slug>). */
export function useInvitationUrl() {
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/\/[^/]+\/?$/, '');
  url.search = '';
  url.hash = '';
  return url.toString();
}
