import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import './index.css';
import './styles/variables.css';
import { initAnalytics } from './config/analytics';
import { CookieConsentBanner } from './components/cookie-consent/CookieConsentBanner';

// Page components live in two places: site pages under ./pages and each
// invitation's own pages under ./invitations/<template>. The server names
// them by path, e.g. "pages/landing/LandingPage" or
// "invitations/demo/PrintCardPage" (see app/Http/Controllers).
const pages = import.meta.glob(['./pages/**/*Page.tsx', './invitations/*/*Page.tsx']);

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
        <CookieConsentBanner />
      </StrictMode>,
    );
  },
  progress: {
    color: '#b97a1f',
  },
});
