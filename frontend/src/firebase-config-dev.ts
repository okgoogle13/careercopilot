// Development Firebase Configuration with Error Handling
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Check if Firebase should be disabled for development
const DISABLE_FIREBASE = import.meta.env.VITE_DISABLE_FIREBASE === 'true';

// Development Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

// Mock Firebase services for development
class MockFirestore {
  collection() {
    return {
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      add: () => Promise.resolve({ id: 'mock-doc-id' }),
      where: () => this,
      orderBy: () => this,
      limit: () => this,
      get: () => Promise.resolve({ docs: [], empty: true }),
    };
  }
}

class MockAuth {
  currentUser = null;
  
  signInWithEmailAndPassword() {
    return Promise.resolve({
      user: { uid: 'mock-user-id', email: 'dev@example.com' }
    });
  }
  
  createUserWithEmailAndPassword() {
    return Promise.resolve({
      user: { uid: 'mock-user-id', email: 'dev@example.com' }
    });
  }
  
  signOut() {
    return Promise.resolve();
  }
  
  onAuthStateChanged(callback: Function) {
    // Simulate logged out state
    callback(null);
    return () => {}; // unsubscribe function
  }
}

// Initialize Firebase with proper error handling
let app: any;
export let db: Firestore | MockFirestore;
export let auth: Auth | MockAuth;

if (DISABLE_FIREBASE) {
  console.log('🔧 Development Mode: Firebase disabled, using mock services');
  db = new MockFirestore() as any;
  auth = new MockAuth() as any;
} else {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('🔥 Firebase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed, falling back to mock services');
    console.error('Firebase error:', error);
    
    // Fallback to mock services
    db = new MockFirestore() as any;
    auth = new MockAuth() as any;
  }
}

// Export configuration for debugging
export const debugInfo = {
  firebaseConfig,
  isDisabled: DISABLE_FIREBASE,
  isMocked: !app,
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
};