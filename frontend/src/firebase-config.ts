// src/firebase-config.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration validation
interface FirebaseConfigKeys {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Validate required environment variables
function validateFirebaseConfig(): FirebaseConfigKeys {
  const requiredEnvVars = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // Check for missing environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all Firebase configuration variables are set.'
    );
  }

  // Check for demo/placeholder values
  const demoPatterns = [
    'demo', 'test', 'placeholder', 'your-', 'default', 'example'
  ];
  
  const invalidConfigs = Object.entries(requiredEnvVars)
    .filter(([_, value]) => 
      demoPatterns.some(pattern => value?.toLowerCase().includes(pattern))
    )
    .map(([key]) => key);

  if (invalidConfigs.length > 0) {
    throw new Error(
      `Invalid Firebase configuration detected for: ${invalidConfigs.join(', ')}\n` +
      'Please update your .env file with real Firebase credentials.'
    );
  }

  return requiredEnvVars as FirebaseConfigKeys;
}

// Validate and create Firebase configuration
export const firebaseConfig = validateFirebaseConfig();

// Log configuration status (without exposing sensitive data)
console.log('Firebase configuration validated successfully', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId
});

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase app:', error);
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Initialize Firebase services with error handling
export let db: Firestore;
export let auth: Auth;

try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
}

try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Auth:', error);
  throw new Error(`Firebase Auth initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
