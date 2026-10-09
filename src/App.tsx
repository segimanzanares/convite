import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';
import { invitations, type InvitationEntry } from './invitations/registry';
import { CookieConsentBanner } from './components/cookie-consent/CookieConsentBanner';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {Object.entries(invitations).map(([slug, entry]) => (
            <Route key={slug} path={`/i/${slug}`} element={<entry.Component />} />
          ))}
          {Object.entries<InvitationEntry>(invitations).map(([slug, { PrintCard }]) =>
            PrintCard ? <Route key={`${slug}-tarjeta`} path={`/i/${slug}/tarjeta`} element={<PrintCard />} /> : null,
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
