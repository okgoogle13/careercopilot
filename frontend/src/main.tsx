import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// M3 Expressive Design Tokens
import './styles/m3-design-tokens.css';

// Electric Alchemist Design System
import './styles/electric-alchemist.css';

// import * as Sentry from '@sentry/react';
import { AuthProvider } from './context/AuthContext';
import AppWrapper from './components/layout/AppWrapper';
import { AppRouter } from './components/layout/AppRouter';

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

// Add Material Icons font
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(link);

// Add M3 Expressive fonts
const fontsLink = document.createElement('link');
fontsLink.rel = 'stylesheet';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
document.head.appendChild(fontsLink);

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppWrapper>
            <AppRouter />
          </AppWrapper>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
