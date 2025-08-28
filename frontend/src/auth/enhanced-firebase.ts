// Enhanced Firebase Configuration with Network Fallback
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
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
const maxConnectionAttempts = 3;

// Initialize Firebase with network detection
let app: any = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

async function initializeFirebase(): Promise<boolean> {
  try {
    connectionAttempts++;
    console.log(`🔥 Attempting Firebase initialization (${connectionAttempts}/${maxConnectionAttempts})...`);

    // Test network connectivity first
    await fetch('https://firebase.googleapis.com/', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });

    // If we get here without throwing, network is available
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    isFirebaseAvailable = true;
    console.log('✅ Firebase initialized successfully');
    return true;

  } catch (error) {
    console.warn(`⚠️ Firebase initialization failed (attempt ${connectionAttempts}):`, error);
    
    if (connectionAttempts < maxConnectionAttempts) {
      // Retry after delay
      setTimeout(() => initializeFirebase(), 2000);
    } else {
      console.warn('❌ Firebase unavailable, using fallback authentication');
      isFirebaseAvailable = false;
    }
    
    return false;
  }
}

// Enhanced authentication service
export class AuthService {
  constructor() {
    // Start Firebase initialization
    this.initWithRetry();
  }

  private async initWithRetry() {
    await initializeFirebase();
  }

  async signIn(email: string, password: string) {
    if (isFirebaseAvailable && auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('🔥 Firebase sign-in successful');
        return result.user;
      } catch (error: any) {
        console.warn('🔥 Firebase sign-in failed, trying fallback:', error.message);
        
        // Fall back to local auth
        if (error.code === 'auth/network-request-failed' || error.message.includes('connection')) {
          isFirebaseAvailable = false;
          return await fallbackAuth.signIn(email, password);
        }
        throw error;
      }
    } else {
      console.log('🔧 Using fallback authentication');
      return await fallbackAuth.signIn(email, password);
    }
  }

  async signUp(email: string, password: string) {
    if (isFirebaseAvailable && auth) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log('🔥 Firebase sign-up successful');
        return result.user;
      } catch (error: any) {
        console.warn('🔥 Firebase sign-up failed, trying fallback:', error.message);
        
        // Fall back to local auth
        if (error.code === 'auth/network-request-failed' || error.message.includes('connection')) {
          isFirebaseAvailable = false;
          return await fallbackAuth.signUp(email, password);
        }
        throw error;
      }
    } else {
      console.log('🔧 Using fallback authentication');
      return await fallbackAuth.signUp(email, password);
    }
  }

  async signOut() {
    if (isFirebaseAvailable && auth) {
      try {
        await signOut(auth);
        console.log('🔥 Firebase sign-out successful');
      } catch (error) {
        console.warn('🔥 Firebase sign-out failed:', error);
      }
    }
    
    // Always sign out from fallback as well
    await fallbackAuth.signOut();
  }

  onAuthStateChanged(callback: (user: any) => void) {
    if (isFirebaseAvailable && auth) {
      // Use Firebase auth state
      return onAuthStateChanged(auth, callback);
    } else {
      // Use fallback auth state
      return fallbackAuth.onAuthStateChanged((state) => {
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

// Export Firebase instances (may be null)
export { auth, db };

// Debug information
export const debugInfo = {
  environment: import.meta.env.MODE,
  firebaseConfig: firebaseConfig.projectId ? 'configured' : 'missing',
  getStatus: () => authService.getConnectionStatus(),
};