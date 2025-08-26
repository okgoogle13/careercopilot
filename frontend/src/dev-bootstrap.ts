// Development Bootstrap - Ensures Firebase-free environment
// This file should be imported first in development mode

console.log('🔧 Development Bootstrap: Initializing Firebase-free environment');

// Override any global Firebase references
if (typeof window !== 'undefined') {
  // Prevent Firebase auto-initialization
  (window as any).__FIREBASE_DEFAULTS__ = undefined;
  
  // Mock Firebase SDK if it gets loaded
  (window as any).firebase = {
    apps: [],
    initializeApp: () => {
      console.warn('🚫 Firebase initializeApp blocked - using fallback auth');
      return null;
    },
    app: () => {
      console.warn('🚫 Firebase app() blocked - using fallback auth');
      return null;
    }
  };
  
  console.log('✅ Development Bootstrap: Firebase globals mocked');
}

// Set development flags
if (import.meta.env) {
  import.meta.env.VITE_FIREBASE_DISABLED = 'true';
  import.meta.env.VITE_PURE_FALLBACK = 'true';
  console.log('✅ Development Bootstrap: Environment flags set');
}

// Log development mode status
console.log('🔧 Development Mode Active:', {
  firebaseDisabled: true,
  authMethod: 'pure-fallback',
  persistentSessions: true,
  demoCredentials: 'demo@careercopilot.com / demo123'
});

export const devConfig = {
  firebaseDisabled: true,
  authMethod: 'pure-fallback',
  debugMode: true,
  environment: 'development'
};