import {initializeTestEnvironment, RulesTestEnvironment} from "@firebase/rules-unit-testing";
import {readFileSync} from "fs";
import path from "path";

// Load Firestore rules from the file
const rules = readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8");

let testEnv: RulesTestEnvironment | null = null;

// Initialize test environment with project ID and rules
export const setupTestEnvironment = async () => {
  if (testEnv) {
    return testEnv;
  }

  testEnv = await initializeTestEnvironment({
    projectId: "careercopilot-test",
    firestore: {
      rules,
      host: "localhost",
      port: 8080,
    },
  });

  return testEnv;
};

export const getAuthedFirestore = async (auth?: Record<string, unknown>) => {
  const env = await setupTestEnvironment();
  const context = auth ? env.authenticatedContext(auth as any) : env.unauthenticatedContext();
  return context.firestore();
};

export const cleanupTestEnvironment = async () => {
  if (testEnv) {
    await testEnv.cleanup();
    testEnv = null;
  }
};
