module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/rules/"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        types: ["jest", "node"],
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts", "!**/node_modules/**"],
  coverageReporters: ["text", "lcov", "cobertura"],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testTimeout: 10000,
};
