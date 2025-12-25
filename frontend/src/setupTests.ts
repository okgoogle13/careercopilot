// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { cleanup } from '@testing-library/react';

// Make jest available globally
(global as any).jest = jest;

// Run cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Firebase
// Mock Firebase (using manual mocks in __mocks__)
jest.mock('firebase/auth');
jest.mock('firebase/app');
jest.mock('./config/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  storage: {},
}));

// Mock window.matchMedia for Material-UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

window.ResizeObserver = ResizeObserver;

// Mock next/navigation
jest.mock(
  'next/navigation',
  () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: jest.fn(),
    }),
    usePathname: () => '/',
  }),
  { virtual: true }
);

// Mock next-auth/react
jest.mock(
  'next-auth/react',
  () => ({
    useSession: jest.fn(() => ({
      data: null,
      status: 'unauthenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  { virtual: true }
);

// Mock console methods to reduce test noise
const consoleError = console.error;
const consoleWarn = console.warn;

beforeAll(() => {
  console.error = (message) => {
    if (
      typeof message !== 'string' ||
      !message.includes('ReactDOM.render is no longer supported')
    ) {
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
