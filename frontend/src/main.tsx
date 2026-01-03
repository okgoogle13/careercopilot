import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';

const queryClient = new QueryClient();

// Tailwind v4 with Electric Alchemist Design System
import './index.css';

// M3 Theme for MUI components
import { m3Theme } from './theme/mui-theme';

// import * as Sentry from '@sentry/react';
import App from './App';

// // Initialize Sentry for error monitoring and session replay
// Sentry.init({
//   dsn: 'YOUR_SENTRY_DSN_HERE',
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration({
//       maskAllText: false,
//       blockAllMedia: false,
//     }),
//   ],
//   tracesSampleRate: 1.0,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
// });

import { AuthProvider } from './context/AuthContext';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={m3Theme}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
