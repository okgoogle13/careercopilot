import { useContext } from 'react';
import { UserPreferencesContext } from './UserPreferencesContextDefinition';

// Extract the hook to separate file to avoid Fast Refresh warning
export const useUserPreferences = () => {
    return useContext(UserPreferencesContext);
};
