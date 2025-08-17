// src/test-utils/test-setup.ts
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// This file provides a minimal test setup for component tests
// It creates the necessary DOM environment for testing

// Set up mock window and document if not already defined
if (typeof window === 'undefined') {
  vi.stubGlobal('window', {});
}

if (typeof document === 'undefined') {
  vi.stubGlobal('document', {
    createElement: vi.fn(() => ({
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      },
      appendChild: vi.fn(),
      style: {}
    })),
    createElementNS: vi.fn(() => ({
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      },
      appendChild: vi.fn(),
      style: {}
    })),
    createTextNode: vi.fn(() => ({})),
    getElementById: vi.fn(() => ({
      appendChild: vi.fn()
    })),
    querySelector: vi.fn(() => ({
      appendChild: vi.fn()
    })),
    querySelectorAll: vi.fn(() => []),
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn()
    },
    head: {
      appendChild: vi.fn()
    }
  });
}

// Clean up after each test
afterEach(() => {
  cleanup();
});
