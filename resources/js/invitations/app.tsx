import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import './index.css';
import './styles/variables.css';
import { initAnalytics } from './config/analytics';
import { CookieConsentBanner } from './components/cookie-consent/CookieConsentBanner';
import { PreviewBanner } from './components/preview/PreviewBanner';

// Only the invitations: each template's pages under ./templates/<template>,
// plus the 404 and 410 pages under ./pages. The server names them by path,
// e.g. "templates/boda-clasica/PrintCardPage" or "pages/not-found/NotFoundPage"
// (see app/Http/Controllers). The landing page and the door of the event
// belong to the main app (resources/js/app).
const pages = import.meta.glob(['./pages/**/*Page.tsx', './templates/*/*Page.tsx']);

initAnalytics();

createInertiaApp({
  resolve: async (name) => {
    const page = pages[`./${name}.tsx`];
    if (!page) throw new Error(`Inertia page not found: ${name}`);
    return ((await page()) as { default: never }).default;
  },
  setup({ el, App, props }) {
    createRoot(el!).render(
      <StrictMode>
        <App {...props} />
        <PreviewBanner initialProps={props.initialPage.props} />
        <CookieConsentBanner />
      </StrictMode>,
    );
  },
  progress: {
    color: '#b97a1f',
  },
});
