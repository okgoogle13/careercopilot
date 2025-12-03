import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme'; // Make sure this path is correct

// Create a custom render function that includes any context providers your app needs
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the render method with our custom renderer
export { customRender as render };
