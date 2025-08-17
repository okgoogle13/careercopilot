import { useContext } from 'react';
import { UserPreferencesContext } from './UserPreferencesContextDefinition';

// Extract the hook to separate file to avoid Fast Refresh warning
import { UserPreferences } from './UserPreferencesContextDefinition';

export const useUserPreferences = (): UserPreferences | null => {
    return useContext(UserPreferencesContext);
};
