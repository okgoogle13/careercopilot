import { RulesTestEnvironment } from '@firebase/rules-unit-testing';

// Clean up the test environment after all tests complete
module.exports = async function globalTeardown() {
  const testEnv: RulesTestEnvironment = (global as any).testEnv;
  
  if (testEnv) {
    // Clean up any test data
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      // Delete test collections
      const collections = await db.listCollections();
      const batch = db.batch();
      
      for (const collection of collections) {
        const snapshot = await collection.get();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }
      
      await batch.commit();
    });
    
    // Clean up the test environment
    await testEnv.cleanup();
  }
};
