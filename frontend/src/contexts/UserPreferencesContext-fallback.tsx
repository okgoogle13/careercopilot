import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface UserPreferences {
  themeId: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences | null;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  loading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    themeId: 'professional',
  });
  const [loading, setLoading] = useState(false);

  // Storage key based on user
  const storageKey = user ? `careercopilot-preferences-${user.uid}` : 'careercopilot-preferences-default';

  // Load preferences from localStorage
  useEffect(() => {
    if (user) {
      console.log('🔧 UserPreferences: Loading preferences for user:', user.email);
      setLoading(true);
      
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedPrefs = JSON.parse(stored);
          setPreferences(parsedPrefs);
          console.log('✅ UserPreferences: Loaded from localStorage:', parsedPrefs);
        } else {
          console.log('🔧 UserPreferences: No stored preferences, using defaults');
        }
      } catch (error) {
        console.warn('⚠️ UserPreferences: Failed to load preferences:', error);
        toast.error('Failed to load user preferences');
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to defaults when no user
      console.log('🔧 UserPreferences: No user, resetting to defaults');
      setPreferences({ themeId: 'professional' });
    }
  }, [user, storageKey]);

  // Save preferences to localStorage
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    console.log('🔧 UserPreferences: Updating preferences:', newPrefs);
    
    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedPrefs));
      console.log('✅ UserPreferences: Saved to localStorage');
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('❌ UserPreferences: Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
      loading,
    }),
    [preferences, loading, updatePreferences]
  );

  // Debug logging in development
  useEffect(() => {
    if (import.meta.env.VITE_SHOW_DEBUG_INFO === 'true') {
      console.log('🔧 UserPreferences Debug:', {
        user: user ? { uid: user.uid, email: user.email } : null,
        preferences,
        storageKey,
        loading,
      });
    }
  }, [user, preferences, storageKey, loading]);

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};