// Fallback Authentication System
// Provides local authentication when Firebase is unavailable

interface User {
  uid: string;
  email: string;
  displayName?: string;
  getIdToken: () => Promise<string>;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

class FallbackAuth {
  private state: AuthState = {
    user: null,
    loading: false,
    error: null,
  };
  
  private listeners: Array<(state: AuthState) => void> = [];
  private storageKey = 'careercopilot-auth-fallback';

  constructor() {
    this.loadPersistedAuth();
  }

  private loadPersistedAuth() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const { user } = JSON.parse(stored);
        // Restore the getIdToken function
        if (user) {
          user.getIdToken = async () => {
            return `fallback-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          };
        }
        this.setState({ user, loading: false, error: null });
      }
  } catch (error) {
      console.warn('Failed to load persisted auth:', error);
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  private persistAuth(user: User | null) {
    try {
      if (user) {
        // Don't persist the getIdToken function, just the basic user data
        const { getIdToken, ...persistableUser } = user;
        localStorage.setItem(this.storageKey, JSON.stringify({ user: persistableUser }));
      } else {
        localStorage.removeItem(this.storageKey);
      }
  } catch (error) {
      console.warn('Failed to persist auth:', error);
    }
  }

  async signIn(email: string, _password: string): Promise<User> {
    this.setState({ loading: true, error: null });

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // For development: accept any email/password combination
      const user: User = {
        uid: 'dev-user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        getIdToken: async () => {
          // Generate a mock JWT token for fallback auth
          return `fallback-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
      };

      this.setState({ user, loading: false, error: null });
      this.persistAuth(user);
      
      console.log('🔐 Fallback auth: User signed in:', email);
      return user;
    } catch (error) {
      const errorMessage = 'Authentication failed';
      this.setState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  async signUp(email: string, _password: string): Promise<User> {
    this.setState({ loading: true, error: null });

    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const user: User = {
        uid: 'dev-user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        getIdToken: async () => {
          // Generate a mock JWT token for fallback auth
          return `fallback-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
      };

      this.setState({ user, loading: false, error: null });
      this.persistAuth(user);
      
      console.log('🔐 Fallback auth: User registered:', email);
      return user;
    } catch (error) {
      const errorMessage = 'Registration failed';
      this.setState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  async signOut(): Promise<void> {
    this.setState({ user: null, loading: false, error: null });
    this.persistAuth(null);
    console.log('🔐 Fallback auth: User signed out');
  }

  getCurrentUser(): User | null {
    return this.state.user;
  }

  getAuthState(): AuthState {
    return this.state;
  }

  onAuthStateChanged(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current state
    callback(this.state);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const fallbackAuth = new FallbackAuth();