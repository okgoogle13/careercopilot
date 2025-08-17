import { createContext } from 'react';

interface UserPreferences {
    themeId: string;
}

export const UserPreferencesContext = createContext<UserPreferences | null>(null);
