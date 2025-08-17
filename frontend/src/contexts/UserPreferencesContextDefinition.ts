import { createContext } from 'react';

export interface UserPreferences {
    themeId: string;
}

export const UserPreferencesContext = createContext<UserPreferences | null>(null);
