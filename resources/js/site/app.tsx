import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import './index.css';
import './styles/variables.css';
import { initAnalytics } from './config/analytics';
import { CookieConsentBanner } from './components/cookie-consent/CookieConsentBanner';
import { PreviewBanner } from './components/preview/PreviewBanner';

// Page components live in two places: site pages under ./pages and each
// template's pages under ./templates/<template>. The server names
// them by path, e.g. "pages/landing/LandingPage" or
// "templates/boda-clasica/PrintCardPage" (see app/Http/Controllers).
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
