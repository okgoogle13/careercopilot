/* eslint-env jest */
import {getAuthedFirestore} from '../../test/setup';
import {doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, getDocs, writeBatch} from 'firebase/firestore';
import {Firestore} from 'firebase/firestore';

// Test user data
const TEST_USER = {
  uid: 'test-user',
  email: 'test@example.com',
  name: 'Test User',
};

const OTHER_USER = {
  uid: 'other-user',
  email: 'other@example.com',
  name: 'Other User',
};

describe('Firestore Security Rules', () => {
  let testDb: Firestore;
  let otherUserDb: Firestore;
  let adminDb: Firestore;

  beforeAll(async () => {
    // Initialize Firestore with different user contexts
    testDb = await getAuthedFirestore({...TEST_USER});
    otherUserDb = await getAuthedFirestore({...OTHER_USER});
    // Admin has full access for setup/teardown
    adminDb = await getAuthedFirestore({uid: 'admin', admin: true});
 });

  // Clean up test data
  afterEach(async () => {
    const batch = adminDb.batch();
    
    // Clean up test documents
    const testDocs = await getDocs(collection(adminDb, 'users/test-user/documents'));
    testDocs.forEach(doc => {
      batch.delete(doc.ref);
   });
    
    await batch.commit();
 });

  describe('Users Collection', () => {
    it('should allow users to read and write their own profile', async () => {
      const userDoc = doc(testDb, `users/${TEST_USER.uid}`);
      
      // Test write operation
      await expect(
        setDoc(userDoc, {
          name: TEST_USER.name,
          email: TEST_USER.email,
          updatedAt: new Date().toISOString()
       })
      ).resolves.toBeUndefined();
      
      // Test read operation
      const docSnap = await getDoc(userDoc);
      expect(docSnap.exists()).toBe(true);
      expect(docSnap.data()?.email).toBe(TEST_USER.email);
   });

    it('should not allow users to read other users profiles', async () => {
      const otherUserDoc = doc(testDb, `users/${OTHER_USER.uid}`);
      await expect(getDoc(otherUserDoc)).rejects.toThrow();
   });

    it('should not allow users to update other users profiles', async () => {
      const otherUserDoc = doc(testDb, `users/${OTHER_USER.uid}`);
      await expect(
        updateDoc(otherUserDoc, {name: 'Hacked'})
      ).rejects.toThrow();
   });

    it('should not allow users to delete profiles', async () => {
      const userDoc = doc(testDb, `users/${TEST_USER.uid}`);
      await expect(deleteDoc(userDoc)).rejects.toThrow();
   });
 });

  describe('Documents Collection', () => {
    const testDoc = {
      title: 'Test Document',
      content: 'This is a test document',
      owner: TEST_USER.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
   };

    beforeEach(async () => {
      // Create a test document before each test
      const docRef = doc(collection(testDb, `users/${TEST_USER.uid}/documents`));
      await setDoc(docRef, {...testDoc, id: docRef.id});
      return docRef.id;
   });

    it('should allow users to create their own documents', async () => {
      const docRef = doc(collection(testDb, `users/${TEST_USER.uid}/documents`));
      
      await expect(
        setDoc(docRef, {
          ...testDoc,
          id: docRef.id
       })
      ).resolves.toBeUndefined();
   });

    it('should enforce required fields on document creation', async () => {
      const docRef = doc(collection(testDb, `users/${TEST_USER.uid}/documents`));
      
      // Missing required 'title' field
      await expect(
        setDoc(docRef, {
          content: 'Invalid document',
          owner: TEST_USER.uid,
          createdAt: new Date().toISOString()
       })
      ).rejects.toThrow();
   });

    it('should allow users to update their own documents', async () => {
      // Get the first document
      const q = query(collection(testDb, `users/${TEST_USER.uid}/documents`));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;
      
      // Update the document
      await expect(
        updateDoc(docRef, {
          title: 'Updated Title',
          updatedAt: new Date().toISOString()
       })
      ).resolves.toBeUndefined();
      
      // Verify the update
      const updatedDoc = await getDoc(docRef);
      expect(updatedDoc.data()?.title).toBe('Updated Title');
   });

    it('should not allow users to update documents they do not own', async () => {
      // Create a document as test user
      const docRef = doc(collection(testDb, `users/${TEST_USER.uid}/documents`));
      await setDoc(docRef, {...testDoc, id: docRef.id});
      
      // Try to update as other user
      const otherUserDocRef = doc(otherUserDb, `users/${TEST_USER.uid}/documents/${docRef.id}`);
      await expect(
        updateDoc(otherUserDocRef, {title: 'Hacked'})
      ).rejects.toThrow();
   });

    it('should allow users to delete their own documents', async () => {
      // Get the first document
      const q = query(collection(testDb, `users/${TEST_USER.uid}/documents`));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;
      
      // Delete the document
      await expect(deleteDoc(docRef)).resolves.toBeUndefined();
      
      // Verify deletion
      const deletedDoc = await getDoc(docRef);
      expect(deletedDoc.exists()).toBe(false);
   });

    it('should not allow users to query documents they do not own', async () => {
      // Try to query another user's documents
      const q = query(collection(otherUserDb, `users/${TEST_USER.uid}/documents`));
      await expect(getDocs(q)).rejects.toThrow();
   });
 });

  describe('Batch Operations', () => {
    it('should allow batch operations on owned documents', async () => {
      const batch = writeBatch(testDb);
      
      // Create multiple documents in a batch
      const doc1 = doc(collection(testDb, `users/${TEST_USER.uid}/documents`));
      const doc2 = doc(collection(testDb, `users/${TEST_USER.uid}/documents`));
      
      batch.set(doc1, {
        title: 'Batch Doc 1',
        content: 'Content 1',
        owner: TEST_USER.uid,
        createdAt: new Date().toISOString()
     });
      
      batch.set(doc2, {
        title: 'Batch Doc 2',
        content: 'Content 2',
        owner: TEST_USER.uid,
        createdAt: new Date().toISOString()
     });
      
      await expect(batch.commit()).resolves.toBeUndefined();
   });
    
    it('should reject batch operations with unauthorized access', async () => {
      const batch = writeBatch(testDb);
      
      // Try to create a document in another user's collection
      const docRef = doc(collection(testDb, `users/${OTHER_USER.uid}/documents`));
      
      batch.set(docRef, {
        title: 'Unauthorized Doc',
        content: 'Should not be allowed',
        owner: TEST_USER.uid, // Incorrect owner
        createdAt: new Date().toISOString()
     });
      
      await expect(batch.commit()).rejects.toThrow();
   });
 });
});
