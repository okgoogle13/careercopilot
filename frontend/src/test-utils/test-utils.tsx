/**
 * kerala-rage kr-solidarity: TEST UTILITIES
 *
 * Testing utilities for React Testing Library with kerala-rage kr-solidarity design system support.
 * Replaces MUI ThemeProvider with design system context.
 */

import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
