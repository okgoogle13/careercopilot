import React from 'react';
import { afterEach, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';

// Extend Vitest's expect with jest-dom matchers
Object.entries(matchers).forEach(([key, value]) => {
  if (key.startsWith('expect')) {
    expect.extend(value);
  }
});

// Run cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock console methods to reduce test noise
const consoleError = console.error;
const consoleWarn = console.warn;

beforeAll(() => {
  console.error = (message) => {
    if (typeof message !== 'string' || !message.includes('ReactDOM.render is no longer supported')) {
      consoleError(message);
    }
  };
  
  console.warn = (message) => {
    if (typeof message !== 'string' || !message.includes('DeprecationWarning:')) {
      consoleWarn(message);
    }
  };
});

afterAll(() => {
  console.error = consoleError;
  console.warn = consoleWarn;
});
