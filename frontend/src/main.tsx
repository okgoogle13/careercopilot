import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// import * as Sentry from '@sentry/react';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { theme } from './theme/theme';

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

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    {/* <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}> */}
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
    {/* </Sentry.ErrorBoundary> */}
  </ErrorBoundary>
);

// Trigger workflow run
