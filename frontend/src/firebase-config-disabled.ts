// Disabled Firebase Configuration
// This file prevents any Firebase initialization

console.log(
  '🚫 Firebase completely disabled - using pure fallback authentication'
);

// Mock Firebase exports to prevent errors
export const auth = null;
export const db = null;

// Mock Firebase functions that might be imported elsewhere
export const signInWithEmailAndPassword = () => {
  throw new Error('Firebase is disabled. Use pure fallback authentication.');
};

export const createUserWithEmailAndPassword = () => {
  throw new Error('Firebase is disabled. Use pure fallback authentication.');
};

export const signOut = () => {
  throw new Error('Firebase is disabled. Use pure fallback authentication.');
};

export const onAuthStateChanged = () => {
  throw new Error('Firebase is disabled. Use pure fallback authentication.');
};

// Export empty config for debugging
export const firebaseConfig = {};
export const debugInfo = {
  environment: 'development',
  firebaseDisabled: true,
  mode: 'pure-fallback-only',
};

export default null;
