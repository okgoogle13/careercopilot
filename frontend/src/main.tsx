import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import * as Sentry from '@sentry/react';
import App from './App';
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    {/* </Sentry.ErrorBoundary> */}
  </ErrorBoundary>
);