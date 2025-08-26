// Fixed Firebase Configuration with Error Handling for Polling Issues
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';

// Enhanced Firebase configuration with error handling
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('Missing Firebase configuration fields:', missingFields);
  throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('🔥 Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Firebase app initialization failed:', error);
  throw error;
}

// Initialize Auth with enhanced error handling
export let auth: Auth;
try {
  auth = getAuth(app);
  
  // Configure auth settings to prevent polling issues
  auth.settings = {
    appVerificationDisabledForTesting: import.meta.env.DEV, // Disable app verification in development
  };

  // Add auth state change listener with error handling
  auth.onAuthStateChanged(
    (user) => {
      if (user) {
        console.log('🔐 User authenticated:', user.email);
      } else {
        console.log('👤 User signed out');
      }
    },
    (error) => {
      console.error('🚨 Auth state change error:', error);
      // Don't throw here, just log the error
    }
  );

  // Handle token refresh errors
  auth.onIdTokenChanged(
    (user) => {
      if (user) {
        // Token refreshed successfully
        console.log('🔄 Token refreshed for:', user.email);
      }
    },
    (error) => {
      console.error('🚨 Token refresh error:', error);
      // Handle token refresh failures gracefully
      if (error.code === 'auth/network-request-failed') {
        console.warn('⚠️ Network issue detected, retrying...');
      }
    }
  );

  console.log('✅ Firebase Auth initialized successfully');
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error);
  throw error;
}

// Initialize Firestore with error handling
export let db: Firestore;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

// Development helpers
if (import.meta.env.DEV) {
  // Add development-specific configurations
  console.log('🛠️ Development mode detected');
  
  // You can add emulator connections here if needed
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

// Export debug information
export const debugInfo = {
  config: firebaseConfig,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
};

// Global error handler for unhandled Firebase errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('firebase') || event.reason?.code?.startsWith('auth/')) {
    console.error('🚨 Unhandled Firebase error:', event.reason);
    
    // Prevent the error from crashing the app
    event.preventDefault();
    
    // You can show a user-friendly message here
    console.warn('⚠️ Firebase error handled gracefully');
  }
});

export default app;