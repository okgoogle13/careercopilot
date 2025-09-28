module.exports = {
  ...require('./jest.config.js'),
  testMatch: ['**/__tests__/rules/**/*.test.ts'],
  globalSetup: '<rootDir>/test/rules/setup.ts',
  globalTeardown: '<rootDir>/test/rules/teardown.ts',
  testEnvironment: 'node',
  testTimeout: 30000, // Longer timeout for Firestore emulator
};
