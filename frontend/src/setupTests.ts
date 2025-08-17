// src/setupTests.ts
import { afterEach, beforeAll, afterAll, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './mocks/server';
// Import top-level hoisted mocks
import './test-utils/global-mocks';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Start the MSW server
beforeAll(() => {
  // Start the interception
  server.listen({ onUnhandledRequest: 'warn' });
  
  // Configure global settings
  // Avoid fake timers in global setup to prevent async tests from stalling
  
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

// Reset MSW handlers after each test
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.clearAllMocks();
  // Don't clear timers here as we didn't enable fake timers globally
});

// Clean up after all tests
afterAll(() => {
  server.close();
  // No fake timers were used globally
});