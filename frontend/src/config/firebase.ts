import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Support both Vite (import.meta.env) and Jest (process.env)
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined'
      ? process.env
      : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'test-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'test-domain',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'test-project',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'test-bucket',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'test-sender',
  appId: env.VITE_FIREBASE_APP_ID || 'test-app',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isTestEnv =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') || env.MODE === 'test';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = isTestEnv ? ({ currentUser: null } as any) : getAuth(app);
export const storage = isTestEnv ? ({} as any) : getStorage(app);
export const db = isTestEnv ? ({} as any) : getFirestore(app);

export default app;
