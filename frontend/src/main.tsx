/**
 * @file The main entry point for the CareerCopilot React application.
 *
 * This file is responsible for:
 * 1. Importing the root React component, `App`.
 * 2. Importing necessary providers like `ThemeProvider` for MUI theming and `ErrorBoundary` for catching runtime errors.
 * 3. Rendering the entire application into the DOM element with the ID 'root'.
 *
 * The component tree is structured as follows:
 * - ErrorBoundary: Catches JavaScript errors anywhere in its child component tree.
 * - ThemeProvider: Injects the custom MUI theme into the application.
 * - CssBaseline: Provides a consistent baseline of CSS styles across browsers.
 * - App: The root component of the application.
 */
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { theme } from './theme/theme';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </ErrorBoundary>
);
