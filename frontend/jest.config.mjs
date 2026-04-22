export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  testTimeout: 30000,
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@careercopilot/ui$': '<rootDir>/packages/ui/src/index.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^axios$': '<rootDir>/src/__mocks__/axios.ts',
    '^lucide-react$': '<rootDir>/src/__mocks__/lucide-react.ts',
    '^framer-motion$': '<rootDir>/src/__mocks__/framer-motion.ts',
    '^html2canvas$': '<rootDir>/src/__mocks__/html2canvas.cjs',
    '^jspdf$': '<rootDir>/src/__mocks__/jspdf.ts',
    '^docx$': '<rootDir>/src/__mocks__/docx.ts',
    '^file-saver$': '<rootDir>/src/__mocks__/file-saver.ts',
    '^tailwind-merge$': '<rootDir>/src/__mocks__/tailwind-merge.ts',
    '^firebase/auth$': '<rootDir>/src/__mocks__/firebase-auth.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        diagnostics: {
          warnOnly: true,
        },
        useESM: true,
        sourceMap: false,
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    DEV: true,
                    PROD: false,
                    MODE: 'test',
                    VITE_API_URL: 'http://localhost:8000',
                    VITE_FIREBASE_API_KEY: 'test-api-key',
                    VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
                    VITE_FIREBASE_PROJECT_ID: 'test-project',
                    VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
                    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
                    VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((@mui|@babel|@emotion|@testing-library|@radix-ui|clsx|react-hook-form|uuid|ansi-regex|strip-ansi|ansi-styles|chalk|@mui/lab|firebase|@firebase|lucide-react|@lucide|zustand|tailwind-merge|html2pdf)/|.*\\.mjs$))',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: false,
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/components_OLD/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/setupTests.ts',
    '!src/test-utils.tsx',
    '!src/components/layout/fix-button-variants.ts',
    '!src/**/__tests__-legacy/**',
    '!src/**/stories-legacy/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/.backup-*/**',
    '!src/**/backup/**',
    '!src/**/archive/**',
    '!src/**/archived/**',
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
