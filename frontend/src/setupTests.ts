// src/setupTests.ts
import '@testing-library/jest-dom';

// Add additional setup for testing environment
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});