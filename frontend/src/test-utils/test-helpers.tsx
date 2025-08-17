// src/test-utils/test-helpers.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { mockReactRouterDom } from './test-mocks';
import '../test-utils/test-setup';

// Define a custom render function that includes common providers if needed
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> {
  // Setup any providers your components need here
  // For example, a UserContext provider, ThemeProvider, etc.
  return render(ui, { ...options });
}

// Set up the mocks for React Router DOM
export function setupRouterTest(): void {
  mockReactRouterDom();
}

// Add more helper functions as needed for common test patterns
export function waitForAsync(): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
