import { useContext } from 'react';
import { UserPreferencesContext } from './UserPreferencesContext';

// Extract the hook to separate file to avoid Fast Refresh warning
export const useUserPreferences = () => {
    return useContext(UserPreferencesContext);
};
