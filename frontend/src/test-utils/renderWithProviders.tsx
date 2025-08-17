// src/test-utils/renderWithProviders.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext';

/**
 * Custom render function that wraps components with all necessary providers
 * Use this instead of the plain render from testing-library
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <UserPreferencesProvider>
          {children}
        </UserPreferencesProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Example usage:
 * 
 * import { renderWithProviders } from '../test-utils/renderWithProviders';
 * import MyComponent from './MyComponent';
 * 
 * test('renders correctly', () => {
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *   expect(getByText('My Component')).toBeInTheDocument();
 * });
 */
