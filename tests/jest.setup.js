/**
 * Jest Setup for Firebase Firestore Rules Testing
 *
 * This file configures Jest for testing Firebase Firestore security rules
 * with proper timeout and error handling.
 */

// Increase timeout for Firebase operations
jest.setTimeout(30000);

// Global test configuration
global.console = {
  ...console,
  // Suppress Firebase emulator logs during tests (optional)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Clean up resources after all tests
afterAll(() => {
  // Any global cleanup can go here
});
