import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { AuthProvider } from '../contexts/AuthProvider';

// Jest mock function types
type MockFunction = {
  mockReturnValue: (value: unknown) => MockFunction;
} & ((...args: unknown[]) => unknown);

// Jest type declaration for test utilities
declare const jest: {
  fn: (implementation?: (...args: unknown[]) => unknown) => MockFunction;
};

// Mock auth context for testing
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockAuthValue = {
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      token: 'mock-jwt-token',
    },
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    getAuthToken: jest.fn(() => 'mock-jwt-token'),
  };

  return <AuthProvider value={mockAuthValue}>{children}</AuthProvider>;
};

// Custom wrapper for testing AI components
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MockAuthProvider>
          {children}
          <Toaster />
        </MockAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test utilities for AI services
export const mockApiResponse = <T,>(data: T, delay = 100) => {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message: string, delay = 100) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Utility to wait for async operations
export const waitForAsync = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock file upload
export const createMockFile = (name = 'test.pdf', type = 'application/pdf', size = 1024) => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock intersection observer for lazy loading
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Mock clipboard API
export const mockClipboard = () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
      readText: jest.fn(() => Promise.resolve('mock clipboard content')),
    },
  });
};

// Accessibility testing helpers
export const getByLabelText = (container: HTMLElement, text: string) => {
  return (
    container.querySelector(`[aria-label="${text}"]`) ||
    container.querySelector(`label:contains("${text}")`)
  );
};

export const hasAriaLabel = (element: HTMLElement, label: string) => {
  return element.getAttribute('aria-label') === label;
};

export const hasRole = (element: HTMLElement, role: string) => {
  return element.getAttribute('role') === role;
};
