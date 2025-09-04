import '@testing-library/jest-dom';

// Define global for testing environment
declare const global: {
  import: {
    meta: {
      env: Record<string, string | boolean>;
    };
  };
  TextEncoder: typeof TextEncoder;
  TextDecoder: typeof TextDecoder;
};

// Mock import.meta for Jest
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        DEV: false,
        NODE_ENV: 'test',
      },
    },
  },
});

// Add TextEncoder/TextDecoder polyfills
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Add jest global for tests
declare global {
  const jest: {
    fn: (implementation?: (...args: unknown[]) => unknown) => unknown;
  };
}
