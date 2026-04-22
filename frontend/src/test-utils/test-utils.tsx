/**
 * KeralaRage KrSolidarity: TEST UTILITIES
 *
 * Testing utilities for React Testing Library with provider wrapping.
 * Includes QueryClient (retry: false) and MemoryRouter for isolated unit tests.
 */

import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import React, { ReactElement } from 'react';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], ...renderOptions }: RenderWithProvidersOptions = {}
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
