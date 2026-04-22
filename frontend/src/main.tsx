import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

document.documentElement.dataset.theme = 'solidarity';

const queryClient = new QueryClient();

// KeralaRage KrSolidarity consolidated theme (Gold Standard v7.0)
import './globals.css';

import * as Sentry from '@sentry/react';
import App from './App';

import { AuthProvider } from './context/AuthContext';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
if (gaMeasurementId && typeof window !== 'undefined' && typeof document !== 'undefined') {
  const existing = document.querySelector(`script[data-ga-id="${gaMeasurementId}"]`);
  if (!existing) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    script.dataset.gaId = gaMeasurementId;
    document.head.appendChild(script);
  }

  const win = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  win.dataLayer = win.dataLayer || [];
  win.gtag = function gtag(...args: unknown[]) {
    win.dataLayer?.push(args);
  };
  win.gtag('js', new Date());
  win.gtag('config', gaMeasurementId, { send_page_view: true });
}

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
