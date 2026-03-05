import '@testing-library/jest-dom';

Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_FIREBASE_API_KEY: 'test-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'test-domain',
        VITE_FIREBASE_PROJECT_ID: 'test-project',
        VITE_FIREBASE_STORAGE_BUCKET: 'test-bucket',
        VITE_API_URL: 'http://localhost:8000',
      },
    },
  },
});
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
