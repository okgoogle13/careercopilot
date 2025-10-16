/* global beforeAll, afterAll */
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import path from "path";

// Load Firestore rules from the file
const rules = readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8");

// Initialize test environment with project ID and rules
export const setupTestEnvironment = async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: "careercopilot-test",
    firestore: {
      rules,
      host: "localhost",
      port: 8080,
    },
  });

  return testEnv;
};

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
});

// Global test teardown
afterAll(async () => {
  // Clean up any resources
});

export const getAuthedFirestore = (auth?: Record<string, unknown>) => {
  return initializeTestEnvironment({
    projectId: "careercopilot-test",
    firestore: { rules },
  }).then((context) => context.authenticatedContext(auth).firestore());
};
