export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  testTimeout: 30000,
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)', '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        diagnostics: {
          warnOnly: true,
        },
        useESM: true,
        sourceMap: false,
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((@mui|@babel|@emotion|@testing-library|@radix-ui|clsx|react-hook-form|uuid|ansi-regex|strip-ansi|ansi-styles|chalk|@mui/lab)/|.*\\.mjs$))',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/components_OLD/',
    '<rootDir>/src/features/',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/setupTests.ts',
    '!src/test-utils.tsx',
    '!src/components/layout/fix-button-variants.ts',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  verbose: true,
  bail: false,
  cache: false,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
      },
    ],
  ],
};
