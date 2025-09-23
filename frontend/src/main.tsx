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
