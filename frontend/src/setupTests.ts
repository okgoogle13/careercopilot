// src/setupTests.ts
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import 'vitest-dom/extend-expect';

// Set up a global error handler to catch unhandled promise rejections
beforeAll(() => {
  // Configure global settings
  vi.useFakeTimers();
  
  // Error handling for unhandled rejections
  const consoleError = console.error;
  console.error = (...args) => {
    // Filter out React DOM-specific warnings that are not relevant for tests
    const suppressedWarnings = [
      'Warning: ReactDOM.render is no longer supported',
      'Warning: useLayoutEffect does nothing on the server',
    ];
    
    if (typeof args[0] === 'string' && suppressedWarnings.some(warning => args[0].includes(warning))) {
      return;
    }
    
    consoleError(...args);
  };
});

// Automatically clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Clean up after all tests
afterAll(() => {
  vi.useRealTimers();
});