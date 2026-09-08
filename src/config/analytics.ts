const GA_ID = import.meta.env.VITE_GA_ID?.trim();

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function initAnalytics() {
  if (!import.meta.env.PROD || !GA_ID) return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_ID);
}
