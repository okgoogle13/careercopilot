import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Northcote Curio consolidated theme
import './theme/northcote.css';

// import * as Sentry from '@sentry/react';
import App from './App';

import { AuthProvider } from './context/AuthContext';

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
