// src/test-utils/global-mocks.ts
// Top-level mocks that must be hoisted by Vitest (vi.mock at top-level)
import { vi } from 'vitest';

// Mock firebase/auth
vi.mock('firebase/auth', () => {
  return {
    getAuth: () => ({ currentUser: { uid: 'test-user-id', email: 'test@example.com' } }),
    signInWithEmailAndPassword: async () => ({}),
    createUserWithEmailAndPassword: async () => ({}),
    signOut: async () => ({}),
    onAuthStateChanged: (_auth: unknown, cb: (u: { uid: string; email?: string } | null) => void): (() => void) => {
      // Immediately invoke callback with a test user
      cb({ uid: 'test-user-id', email: 'test@example.com' });
      return () => {};
    },
  };
});

// Mock firebase/firestore
vi.mock('firebase/firestore', () => {
  // DocumentSnapshot-like mock (used when listening to a single doc)
    const docSnapMock = {
      exists: () => true,
      data: (): { preferences: { themeId: string } } => ({ preferences: { themeId: 'professional' } }),
      id: 'mock-doc-id',
    };

  return {
    getFirestore: () => ({}),
    collection: () => ({}),
    doc: () => ({}),
    getDoc: async () => docSnapMock,
    setDoc: async () => ({}),
    updateDoc: async () => ({}),
    deleteDoc: async () => ({}),
    getDocs: async () => ({ docs: [docSnapMock] }),
    // onSnapshot should call the callback with a DocumentSnapshot when
    // listening to a single document (not a QuerySnapshot). The app's
    // UserPreferencesContext expects docSnap.exists() and docSnap.data().
  onSnapshot: (_ref: unknown, cb: (snap: { exists: () => boolean; data: () => { preferences: { themeId: string } }; id?: string }) => void): (() => void) => {
      cb(docSnapMock);
      return () => {};
    },
    query: () => ({}),
    where: () => ({}),
    orderBy: () => ({}),
    limit: () => ({}),
  };
});
