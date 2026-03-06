// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { cleanup } from '@testing-library/react';

// Mock import.meta for Vite compatibility
(global as any).import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000',
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef',
      DEV: true,
      MODE: 'test',
    },
  },
};

// Make jest available globally
(global as any).jest = jest;

// Run cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Firebase with ESM-friendly patterns
(jest as any).unstable_mockModule('firebase/app', () => ({
  initializeApp: (jest as any).fn(() => ({})),
  getApps: (jest as any).fn(() => []),
  getApp: (jest as any).fn(() => ({})),
  terminate: (jest as any).fn(() => Promise.resolve()),
}));

(jest as any).unstable_mockModule('firebase/auth', () => ({
  getAuth: (jest as any).fn(() => ({
    currentUser: null,
    onAuthStateChanged: (jest as any).fn(() => (jest as any).fn()),
  })),
  signInWithEmailAndPassword: (jest as any).fn(),
  createUserWithEmailAndPassword: (jest as any).fn(),
  signOut: (jest as any).fn(),
}));

(jest as any).unstable_mockModule('firebase/storage', () => ({
  getStorage: (jest as any).fn(() => ({})),
  ref: (jest as any).fn(),
  uploadBytes: (jest as any).fn(),
  getDownloadURL: (jest as any).fn(),
}));

(jest as any).unstable_mockModule('firebase/firestore', () => ({
  getFirestore: (jest as any).fn(() => ({})),
  collection: (jest as any).fn(),
  doc: (jest as any).fn(),
  getDoc: (jest as any).fn(),
  getDocs: (jest as any).fn(),
  setDoc: (jest as any).fn(),
  addDoc: (jest as any).fn(),
}));

import React from 'react';

// Global mock for framer-motion to prevent animation leaks
(jest as any).unstable_mockModule('framer-motion', () => {
  const motionComponents = new Map();

  const motion = new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop !== 'string') return undefined;

        if (!motionComponents.has(prop)) {
          const Component = React.forwardRef(({ children, ...props }: any, ref: any) => {
            const {
              transition,
              animate,
              initial,
              whileHover,
              whileTap,
              whileInView,
              variants,
              layout,
              exit,
              onAnimationStart,
              onAnimationComplete,
              onUpdate,
              ...domProps
            } = props;
            return React.createElement(prop, { ...domProps, ref }, children);
          });
          Component.displayName = `motion.${prop}`;
          motionComponents.set(prop, Component);
        }
        return motionComponents.get(prop);
      },
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
    }),
    useReducedMotion: () => false,
    useInView: () => true,
    useScroll: () => ({ scrollY: { get: () => 0 }, scrollYProgress: { get: () => 0 } }),
    useTransform: () => ({ get: () => 0 }),
    useSpring: () => ({ get: () => 0 }),
    variants: {},
    LayoutGroup: ({ children }: any) => children,
  };
});

// Ensure fetch is always mocked
if (!global.fetch) {
  (global as any).fetch = (jest as any).fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
} else if ((global.fetch as any).mockImplementation) {
  // Already a mock, reuse
} else {
  (global as any).fetch = (jest as any).fn();
}

// Ensure clean state after each test
afterEach(() => {
  cleanup();
  if ((global.fetch as any).mockClear) (global.fetch as any).mockClear();
  (jest as any).clearAllTimers();
});

// Mock window.matchMedia for Material-UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: any) => ({
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
  observe() {}
  unobserve() {}
  disconnect() {}
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
