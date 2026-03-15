// ============================================================================
// FIREBASE CONFIG — KERALA RAGE / SOLIDARITY MODE
// ============================================================================
// Replace these placeholder values with your actual Firebase project config.
// You can find these in Firebase Console > Project Settings > General > Your apps.
//
// IMPORTANT: Do not commit real API keys to public repositories.
// Use environment variables or a .env file in production.
// ============================================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Firestore instance
export const db = getFirestore(app);

export default app;
