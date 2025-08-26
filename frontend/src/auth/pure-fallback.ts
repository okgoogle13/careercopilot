// Pure Fallback Authentication - No Firebase Dependency
// Use this when Firebase is completely unavailable

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

class PureFallbackAuth {
  private state: AuthState = {
    user: null,
    loading: false,
    error: null,
  };
  
  private listeners: Array<(user: User | null) => void> = [];
  private storageKey = 'careercopilot-pure-auth';

  constructor() {
    console.log('🔧 PureFallbackAuth: Initializing pure fallback authentication');
    this.loadPersistedAuth();
  }

  private loadPersistedAuth() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const { user } = JSON.parse(stored);
        this.setState({ user, loading: false, error: null });
        console.log('🔧 PureFallbackAuth: Loaded persisted user:', user.email);
      } else {
        console.log('🔧 PureFallbackAuth: No persisted user found');
      }
    } catch (error) {
      console.warn('⚠️ PureFallbackAuth: Failed to load persisted auth:', error);
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    console.log('🔧 PureFallbackAuth: State updated:', this.state);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.state.user));
  }

  private persistAuth(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify({ user }));
        console.log('🔧 PureFallbackAuth: Persisted user auth');
      } else {
        localStorage.removeItem(this.storageKey);
        console.log('🔧 PureFallbackAuth: Cleared persisted auth');
      }
    } catch (error) {
      console.warn('⚠️ PureFallbackAuth: Failed to persist auth:', error);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    console.log('🔧 PureFallbackAuth: Starting sign-in for', email);
    this.setState({ loading: true, error: null });

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user object
      const user: User = {
        uid: 'fallback-user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, ''),
        email,
        displayName: email.split('@')[0],
      };

      this.setState({ user, loading: false, error: null });
      this.persistAuth(user);
      
      console.log('✅ PureFallbackAuth: Sign-in successful for:', email);
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('❌ PureFallbackAuth: Sign-in failed:', errorMessage);
      this.setState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  async signUp(email: string, password: string): Promise<User> {
    console.log('🔧 PureFallbackAuth: Starting sign-up for', email);
    this.setState({ loading: true, error: null });

    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user object
      const user: User = {
        uid: 'fallback-user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, ''),
        email,
        displayName: email.split('@')[0],
      };

      this.setState({ user, loading: false, error: null });
      this.persistAuth(user);
      
      console.log('✅ PureFallbackAuth: Sign-up successful for:', email);
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('❌ PureFallbackAuth: Sign-up failed:', errorMessage);
      this.setState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  async signOut(): Promise<void> {
    console.log('🔧 PureFallbackAuth: Starting sign-out');
    this.setState({ user: null, loading: false, error: null });
    this.persistAuth(null);
    console.log('✅ PureFallbackAuth: Sign-out completed');
  }

  getCurrentUser(): User | null {
    return this.state.user;
  }

  getAuthState(): AuthState {
    return this.state;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    console.log('🔧 PureFallbackAuth: Adding auth state listener');
    this.listeners.push(callback);
    
    // Immediately call with current state
    callback(this.state.user);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
        console.log('🔧 PureFallbackAuth: Removed auth state listener');
      }
    };
  }

  // Demo data for development
  getConnectionStatus() {
    return {
      firebaseAvailable: false,
      usingFallback: true,
      connectionAttempts: 0,
      mode: 'pure-fallback'
    };
  }
}

// Create singleton instance
export const pureFallbackAuth = new PureFallbackAuth();

// Mock demo users for testing
export const demoUsers = [
  { email: 'demo@careercopilot.com', password: 'demo123', name: 'Demo User' },
  { email: 'test@example.com', password: 'test123', name: 'Test User' },
  { email: 'dev@local.com', password: 'dev123', name: 'Developer' },
];

console.log('🔧 Pure Fallback Auth initialized. Demo users available:', demoUsers.map(u => u.email));