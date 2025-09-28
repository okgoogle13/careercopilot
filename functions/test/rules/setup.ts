import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import path from 'path';

let testEnv: RulesTestEnvironment;

// Load Firestore rules from the file
const rules = readFileSync(path.resolve(__dirname, '../../../firestore.rules'), 'utf8');

// Set up the test environment before any tests run
module.exports = async function globalSetup() {
  testEnv = await initializeTestEnvironment({
    projectId: 'careercopilot-test',
    firestore: {
      rules,
      host: 'localhost',
      port: 8080,
    },
  });

  // Add any initial test data here
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    // Add any test data that should exist before tests run
    await db.collection('testData').doc('testDoc').set({ test: true });
  });

  // Store the test environment in the global object
  (global as any).testEnv = testEnv;
};
