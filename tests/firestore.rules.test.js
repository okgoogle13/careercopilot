/**
 * Firebase Firestore Security Rules Unit Tests
 *
 * This test suite validates the security rules defined in firestore.rules
 * using the Firebase Emulator Suite and Jest.
 */

const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Test configuration
const PROJECT_ID = 'careercopilot-test';
const RULES_FILE = path.join(__dirname, '../firestore.rules');

let testEnv;

/**
 * Setup and teardown for all tests
 */
beforeAll(async () => {
  // Read the Firestore rules file
  const rulesContent = fs.readFileSync(RULES_FILE, 'utf8');

  // Initialize the test environment with the rules
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: rulesContent,
      host: 'localhost',
      port: 8080, // Default Firestore Emulator port
    },
  });
});

afterAll(async () => {
  // Clean up the test environment
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  // Clear all data between tests for isolation
  await testEnv.clearFirestore();
});

/**
 * Helper function to get authenticated context
 */
function getAuthContext(uid) {
  return testEnv.authenticatedContext(uid);
}

/**
 * Helper function to get unauthenticated context
 */
function getUnauthContext() {
  return testEnv.unauthenticatedContext();
}

describe('Firebase Firestore Security Rules Tests', () => {

  describe('User Profiles Rules - /users/{userId}', () => {

    test('Allow: Authenticated user can read their own document', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      // First, create the document (this should succeed)
      const userDocRef = doc(db, 'users', uid);
      await assertSucceeds(setDoc(userDocRef, {
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      }));

      // Then, read the document (this should also succeed)
      await assertSucceeds(getDoc(userDocRef));
    });

    test('Deny: Authenticated user cannot read someone else\'s document', async () => {
      const ownerUid = 'user123';
      const otherUid = 'anotherUser456';

      // Create document as the owner
      const ownerDb = getAuthContext(ownerUid).firestore();
      const userDocRef = doc(ownerDb, 'users', ownerUid);
      await assertSucceeds(setDoc(userDocRef, {
        name: 'John Doe',
        email: 'john@example.com',
      }));

      // Try to read as another user (this should fail)
      const otherDb = getAuthContext(otherUid).firestore();
      const otherUserDocRef = doc(otherDb, 'users', ownerUid);
      await assertFails(getDoc(otherUserDocRef));
    });

    test('Allow: Authenticated user can write to their own document', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();
      const userDocRef = doc(db, 'users', uid);

      // Create document
      await assertSucceeds(setDoc(userDocRef, {
        name: 'John Doe',
        email: 'john@example.com',
      }));

      // Update document
      await assertSucceeds(updateDoc(userDocRef, {
        name: 'John Smith',
      }));
    });

    test('Deny: Authenticated user cannot write to someone else\'s document', async () => {
      const ownerUid = 'user123';
      const otherUid = 'anotherUser456';

      // Create document as owner
      const ownerDb = getAuthContext(ownerUid).firestore();
      const ownerDocRef = doc(ownerDb, 'users', ownerUid);
      await assertSucceeds(setDoc(ownerDocRef, {
        name: 'John Doe',
        email: 'john@example.com',
      }));

      // Try to write as another user (this should fail)
      const otherDb = getAuthContext(otherUid).firestore();
      const otherDocRef = doc(otherDb, 'users', ownerUid);
      await assertFails(updateDoc(otherDocRef, {
        name: 'Hacker Name',
      }));
    });

    test('Deny: Unauthenticated user cannot read any user document', async () => {
      const uid = 'user123';

      // Create document as authenticated user
      const authDb = getAuthContext(uid).firestore();
      const userDocRef = doc(authDb, 'users', uid);
      await assertSucceeds(setDoc(userDocRef, {
        name: 'John Doe',
        email: 'john@example.com',
      }));

      // Try to read as unauthenticated user (this should fail)
      const unauthDb = getUnauthContext().firestore();
      const unauthDocRef = doc(unauthDb, 'users', uid);
      await assertFails(getDoc(unauthDocRef));
    });

    test('Deny: Unauthenticated user cannot write to any user document', async () => {
      const uid = 'user123';
      const unauthDb = getUnauthContext().firestore();
      const userDocRef = doc(unauthDb, 'users', uid);

      await assertFails(setDoc(userDocRef, {
        name: 'Anonymous User',
        email: 'anon@example.com',
      }));
    });
  });

  describe('User Subcollections Rules', () => {

    test('Allow: User can access their own documents subcollection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const docRef = doc(db, 'users', uid, 'documents', 'doc1');
      await assertSucceeds(setDoc(docRef, {
        title: 'My Resume',
        content: 'Resume content...',
      }));

      await assertSucceeds(getDoc(docRef));
    });

    test('Deny: User cannot access someone else\'s documents subcollection', async () => {
      const ownerUid = 'user123';
      const otherUid = 'anotherUser456';

      // Create document as owner
      const ownerDb = getAuthContext(ownerUid).firestore();
      const ownerDocRef = doc(ownerDb, 'users', ownerUid, 'documents', 'doc1');
      await assertSucceeds(setDoc(ownerDocRef, {
        title: 'Private Resume',
        content: 'Confidential content...',
      }));

      // Try to access as another user (this should fail)
      const otherDb = getAuthContext(otherUid).firestore();
      const otherDocRef = doc(otherDb, 'users', ownerUid, 'documents', 'doc1');
      await assertFails(getDoc(otherDocRef));
    });

    test('Allow: User can access their own profiles subcollection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const profileRef = doc(db, 'users', uid, 'profiles', 'profile1');
      await assertSucceeds(setDoc(profileRef, {
        jobTitle: 'Software Engineer',
        experience: 5,
      }));

      await assertSucceeds(getDoc(profileRef));
    });

    test('Allow: User can access their own settings subcollection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const settingsRef = doc(db, 'users', uid, 'settings', 'preferences');
      await assertSucceeds(setDoc(settingsRef, {
        theme: 'dark',
        notifications: true,
      }));

      await assertSucceeds(getDoc(settingsRef));
    });
  });

  describe('Global Collections Rules', () => {

    test('Allow: Authenticated user can read global opportunities', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      // Note: We can't create the opportunity because write is denied,
      // but we can test reading if it existed
      const opportunityRef = doc(db, 'opportunities', 'job1');

      // This should not fail due to authentication (though doc might not exist)
      // The rule allows read for authenticated users
      try {
        await getDoc(opportunityRef);
      } catch (error) {
        // If it fails, it should be due to document not existing, not permissions
        expect(error.code).not.toBe('permission-denied');
      }
    });

    test('Deny: Authenticated user cannot write to global opportunities', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const opportunityRef = doc(db, 'opportunities', 'job1');
      await assertFails(setDoc(opportunityRef, {
        title: 'Software Engineer',
        company: 'Tech Corp',
      }));
    });

    test('Deny: Unauthenticated user cannot read global opportunities', async () => {
      const db = getUnauthContext().firestore();

      const opportunityRef = doc(db, 'opportunities', 'job1');
      await assertFails(getDoc(opportunityRef));
    });

    test('Allow: Authenticated user can read jobs collection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const jobRef = doc(db, 'jobs', 'job1');

      // Test reading (should be allowed for authenticated users)
      try {
        await getDoc(jobRef);
      } catch (error) {
        // If it fails, it should be due to document not existing, not permissions
        expect(error.code).not.toBe('permission-denied');
      }
    });

    test('Deny: Authenticated user cannot write to jobs collection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const jobRef = doc(db, 'jobs', 'job1');
      await assertFails(setDoc(jobRef, {
        title: 'Software Engineer',
        description: 'Great job opportunity',
      }));
    });

    test('Allow: Authenticated user can read templates collection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const templateRef = doc(db, 'templates', 'template1');

      // Test reading (should be allowed for authenticated users)
      try {
        await getDoc(templateRef);
      } catch (error) {
        // If it fails, it should be due to document not existing, not permissions
        expect(error.code).not.toBe('permission-denied');
      }
    });

    test('Deny: Authenticated user cannot write to templates collection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const templateRef = doc(db, 'templates', 'template1');
      await assertFails(setDoc(templateRef, {
        name: 'Resume Template',
        content: 'Template content...',
      }));
    });
  });

  describe('Global Documents Collection Rules', () => {

    test('Allow: User can read/write documents they own (via userId field)', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const docRef = doc(db, 'documents', 'doc1');

      // Create document with userId field
      await assertSucceeds(setDoc(docRef, {
        userId: uid,
        title: 'My Document',
        content: 'Document content...',
      }));

      // Read the document
      await assertSucceeds(getDoc(docRef));

      // Update the document
      await assertSucceeds(updateDoc(docRef, {
        title: 'Updated Document',
      }));
    });

    test('Deny: User cannot read documents owned by others', async () => {
      const ownerUid = 'user123';
      const otherUid = 'anotherUser456';

      // Create document as owner
      const ownerDb = getAuthContext(ownerUid).firestore();
      const docRef = doc(ownerDb, 'documents', 'doc1');
      await assertSucceeds(setDoc(docRef, {
        userId: ownerUid,
        title: 'Private Document',
        content: 'Confidential content...',
      }));

      // Try to read as another user (this should fail)
      const otherDb = getAuthContext(otherUid).firestore();
      const otherDocRef = doc(otherDb, 'documents', 'doc1');
      await assertFails(getDoc(otherDocRef));
    });

    test('Deny: User cannot create documents for other users', async () => {
      const uid = 'user123';
      const otherUid = 'anotherUser456';
      const db = getAuthContext(uid).firestore();

      const docRef = doc(db, 'documents', 'doc1');

      // Try to create document with another user's ID (this should fail)
      await assertFails(setDoc(docRef, {
        userId: otherUid,
        title: 'Malicious Document',
        content: 'This should not be allowed...',
      }));
    });
  });

  describe('System Collections Security', () => {

    test('Deny: Users cannot access analytics collection', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const analyticsRef = doc(db, 'analytics', 'stats1');

      // Both read and write should fail
      await assertFails(getDoc(analyticsRef));
      await assertFails(setDoc(analyticsRef, {
        views: 100,
        users: 50,
      }));
    });

    test('Allow: Users can read configurations', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const configRef = doc(db, 'configurations', 'app-config');

      // Reading should be allowed (though document might not exist)
      try {
        await getDoc(configRef);
      } catch (error) {
        expect(error.code).not.toBe('permission-denied');
      }
    });

    test('Deny: Users cannot write to configurations', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const configRef = doc(db, 'configurations', 'app-config');

      // Writing should fail
      await assertFails(setDoc(configRef, {
        appName: 'Hacked App',
        version: '999.0.0',
      }));
    });
  });

  describe('Job Applications Subcollection Rules', () => {

    test('Allow: User can read/write their own job applications', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      const applicationRef = doc(db, 'jobs', 'job1', 'applications', 'app1');

      // Create application with userId field
      await assertSucceeds(setDoc(applicationRef, {
        userId: uid,
        jobId: 'job1',
        status: 'applied',
        appliedAt: new Date(),
      }));

      // Read the application
      await assertSucceeds(getDoc(applicationRef));

      // Update the application
      await assertSucceeds(updateDoc(applicationRef, {
        status: 'interviewed',
      }));
    });

    test('Deny: User cannot read others\' job applications', async () => {
      const ownerUid = 'user123';
      const otherUid = 'anotherUser456';

      // Create application as owner
      const ownerDb = getAuthContext(ownerUid).firestore();
      const applicationRef = doc(ownerDb, 'jobs', 'job1', 'applications', 'app1');
      await assertSucceeds(setDoc(applicationRef, {
        userId: ownerUid,
        jobId: 'job1',
        status: 'applied',
      }));

      // Try to read as another user (this should fail)
      const otherDb = getAuthContext(otherUid).firestore();
      const otherAppRef = doc(otherDb, 'jobs', 'job1', 'applications', 'app1');
      await assertFails(getDoc(otherAppRef));
    });
  });

  describe('Catch-all Rule', () => {

    test('Deny: Access to undefined collections should be denied', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      // Try to access a collection not defined in the rules
      const unknownRef = doc(db, 'undefined-collection', 'doc1');

      await assertFails(getDoc(unknownRef));
      await assertFails(setDoc(unknownRef, {
        data: 'This should not be allowed',
      }));
    });

    test('Deny: Deeply nested undefined paths should be denied', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      // Try to access a deeply nested path not covered by rules
      const deepRef = doc(db, 'users', uid, 'unknown', 'subcollection', 'deep', 'doc1');

      await assertFails(getDoc(deepRef));
      await assertFails(setDoc(deepRef, {
        data: 'Deep access should be denied',
      }));
    });
  });

  describe('Edge Cases and Security Scenarios', () => {

    test('Deny: User cannot impersonate another user with fake auth', async () => {
      const uid = 'user123';
      const fakeUid = 'admin-user';
      const db = getAuthContext(uid).firestore();

      // Try to create a document in another user's space
      const fakeUserRef = doc(db, 'users', fakeUid);
      await assertFails(setDoc(fakeUserRef, {
        name: 'Fake Admin',
        isAdmin: true,
      }));
    });

    test('Verify: Rule functions work correctly for complex scenarios', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      // Test nested document access with proper ownership
      const nestedDocRef = doc(db, 'users', uid, 'documents', 'doc1', 'analyses', 'analysis1');

      await assertSucceeds(setDoc(nestedDocRef, {
        type: 'resume-analysis',
        score: 85,
        createdAt: new Date(),
      }));

      await assertSucceeds(getDoc(nestedDocRef));
    });

    test('Performance: Rules should handle batch operations correctly', async () => {
      const uid = 'user123';
      const db = getAuthContext(uid).firestore();

      // Test multiple document operations
      const promises = [];

      for (let i = 0; i < 5; i++) {
        const docRef = doc(db, 'users', uid, 'documents', `doc${i}`);
        promises.push(
          assertSucceeds(setDoc(docRef, {
            title: `Document ${i}`,
            index: i,
          }))
        );
      }

      // All operations should succeed
      await Promise.all(promises);
    });
  });
});
