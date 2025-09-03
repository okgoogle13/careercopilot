// Enhanced Firebase Configuration with Network Fallback
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { fallbackAuth } from './fallback-auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Network connectivity state
let isFirebaseAvailable = false;
let connectionAttempts = 0;
const maxConnectionAttempts = 3; // Max attempts for initial Firebase connection

// Initialize Firebase with network detection
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
export let db: Firestore | null = null;

/**
 * Helper function for consistent error logging.
 * @param context - A string indicating where the error occurred (e.g., "Firebase Initialization", "AuthService.signIn").
 * @param error - The error object.
 * @param message - An optional custom message.
 */
function logError(context: string, error: unknown, message?: string) {
  const firebaseError = error as { code?: string; message?: string };
  const errorMessage = message || firebaseError.message || 'An unknown error occurred.';
  const errorCode = firebaseError.code ? ` (Code: ${firebaseError.code})` : '';
  console.error(`❌ ${context} Error${errorCode}: ${errorMessage}`, error);
}

async function initializeFirebase(): Promise<boolean> {
  if (app) {
    console.log('✅ Firebase already initialized.');
    return true;
  }

  connectionAttempts++;
  console.log(
    `🔥 Attempting Firebase initialization (${connectionAttempts}/${maxConnectionAttempts})...`
  );

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    isFirebaseAvailable = true;
    console.log('✅ Firebase initialized successfully. Using live authentication service.');
    return true;
  } catch (error) {
    logError('Firebase Initialization', error, 'Failed to connect to Firebase.');
    isFirebaseAvailable = false; // Ensure this is set to false on failure
    console.warn('⚠️ Firebase unavailable. Operations will use fallback authentication.');
    return false;
  }
}

// Enhanced authentication service
class AuthService {
  constructor() {
    // Attempt to initialize Firebase on service creation.
    // Subsequent calls to auth methods will check isFirebaseAvailable.
    initializeFirebase().catch(err => {
      logError('AuthService Constructor', err, 'Initial Firebase connection failed.');
    });
  }

  private async ensureFirebaseInitialized(): Promise<boolean> {
    if (!app && connectionAttempts < maxConnectionAttempts) {
      // Only try to re-initialize if not already initialized and within attempt limits
      return await initializeFirebase();
    }
    return isFirebaseAvailable;
  }

  async signIn(email: string, password: string) {
    const firebaseReady = await this.ensureFirebaseInitialized();

    if (firebaseReady && auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('🔥 Firebase sign-in successful.');
        return result.user;
      } catch (error: unknown) {
        logError('AuthService.signIn', error, 'Firebase sign-in failed, attempting fallback.');
        const firebaseError = error as { code?: string; message?: string };

        // Fall back to local auth if network issue or Firebase is generally unavailable
        if (
          firebaseError.code === 'auth/network-request-failed' ||
          !isFirebaseAvailable // If Firebase became unavailable during the operation
        ) {
          isFirebaseAvailable = false; // Confirm Firebase is considered unavailable
          console.log('🔧 Falling back to local authentication for sign-in.');
          return await fallbackAuth.signIn(email, password);
        }
        throw error; // Re-throw non-network Firebase errors
      }
    } else {
      console.log('🔧 Using fallback authentication for sign-in.');
      return await fallbackAuth.signIn(email, password);
    }
  }

  async signUp(email: string, password: string) {
    const firebaseReady = await this.ensureFirebaseInitialized();

    if (firebaseReady && auth) {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log('🔥 Firebase sign-up successful.');
        return result.user;
      } catch (error: unknown) {
        logError('AuthService.signUp', error, 'Firebase sign-up failed, attempting fallback.');
        const firebaseError = error as { code?: string; message?: string };

        // Fall back to local auth if network issue or Firebase is generally unavailable
        if (
          firebaseError.code === 'auth/network-request-failed' ||
          !isFirebaseAvailable // If Firebase became unavailable during the operation
        ) {
          isFirebaseAvailable = false; // Confirm Firebase is considered unavailable
          console.log('🔧 Falling back to local authentication for sign-up.');
          return await fallbackAuth.signUp(email, password);
        }
        throw error; // Re-throw non-network Firebase errors
      }
    } else {
      console.log('🔧 Using fallback authentication for sign-up.');
      return await fallbackAuth.signUp(email, password);
    }
  }

  async signOut() {
    if (isFirebaseAvailable && auth) {
      try {
        await signOut(auth);
        console.log('🔥 Firebase sign-out successful.');
      } catch (error) {
        logError('AuthService.signOut', error, 'Firebase sign-out failed.');
        // Even if Firebase sign-out fails, proceed with fallback sign-out
      }
    } else {
      console.log('🔧 Firebase not available, proceeding with fallback sign-out only.');
    }

    // Always sign out from fallback as well
    await fallbackAuth.signOut();
  }

  async signInWithGoogle() {
    const firebaseReady = await this.ensureFirebaseInitialized();

    if (firebaseReady && auth) {
      try {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');

        const result = await signInWithPopup(auth, provider);
        console.log('🔥 Google sign-in successful.');
        return result.user;
      } catch (error: unknown) {
        logError('AuthService.signInWithGoogle', error, 'Google sign-in failed.');
        // For Google sign-in, we don't fall back to local auth
        // since it requires OAuth which fallback can't provide
        throw error;
      }
    } else {
      logError(
        'AuthService.signInWithGoogle',
        new Error('Firebase not available'),
        'Google sign-in requires Firebase to be available.'
      );
      throw new Error('Google sign-in requires Firebase to be available');
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    // Always check current Firebase availability before setting up listener
    if (isFirebaseAvailable && auth) {
      console.log('🔥 Using Firebase auth state listener.');
      return onAuthStateChanged(auth, callback);
    } else {
      console.log('🔧 Using fallback auth state listener.');
      return fallbackAuth.onAuthStateChanged(state => {
        callback(state.user);
      });
    }
  }

  getCurrentUser() {
    if (isFirebaseAvailable && auth) {
      return auth.currentUser;
    } else {
      return fallbackAuth.getCurrentUser();
    }
  }

  getConnectionStatus() {
    return {
      firebaseAvailable: isFirebaseAvailable,
      connectionAttempts,
      usingFallback: !isFirebaseAvailable,
    };
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export Firestore database instance - initialize Firebase first
export const getDB = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Please call initializeFirebase() first.');
  }
  return db;
};

// For compatibility, also export db directly (but may be null initially)


// Initial Firebase connection attempt when the module loads.
// Errors are handled internally by initializeFirebase and logged.
initializeFirebase().catch(() => { /* errors are already logged */ });