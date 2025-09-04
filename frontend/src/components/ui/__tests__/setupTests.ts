import '@testing-library/jest-dom';

// Mock import.meta for Jest
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        DEV: false,
        NODE_ENV: 'test'
      }
    }
  }
});

// Add TextEncoder/TextDecoder polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add jest global for tests
declare global {
  const jest: any;
}
