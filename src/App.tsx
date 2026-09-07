import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';
import { invitations } from './invitations/registry';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {Object.entries(invitations).map(([slug, { Component }]) => (
            <Route key={slug} path={`/i/${slug}`} element={<Component />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
