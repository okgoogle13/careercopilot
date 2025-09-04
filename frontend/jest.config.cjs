module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.(test|spec).[jt]s?(x)'],

  // Transform settings
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      babelConfig: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', {
            runtime: 'automatic',
            importSource: 'react'
          }]
        ]
      }
    }]
  },

  // Module name mapper
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^react($|/.+)': '<rootDir>/node_modules/react$1',
    '^@testing-library/react((/.*)?)$': ['@testing-library/react$1', '!@testing-library/react/dont-cleanup-after-each'],
  },

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(?:@testing-library|@babel|@react|@mui|react-router|react-router-dom|@emotion)/)',
  ],

  // Test environment setup
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    url: 'http://localhost',
  },

  // Reset mocks between tests
  resetMocks: true,

  // Clear mock calls between tests
  clearMocks: true,

  // Coverage settings
  collectCoverage: false, // Disable coverage for faster test runs
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/App.tsx',
    '!src/setupTests.ts',
    '!src/reportWebVitals.ts',
  ],

  // Global test timeout
  testTimeout: 10000
};
