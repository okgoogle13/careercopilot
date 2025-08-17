// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Set up MSW server
export const server = setupServer(...handlers);

// Note: The setup, reset, and cleanup are now handled in setupTests.ts
// This file now only exports the server instance
