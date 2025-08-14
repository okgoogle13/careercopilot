import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserPreferences {
    themeId: string;
}

const UserPreferencesContext = createContext<UserPreferences | null>(null);

export const useUserPreferences = () => {
    return useContext(UserPreferencesContext);
};

interface UserPreferencesProviderProps {
    children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
    const [preferences, setPreferences] = useState<UserPreferences>({ themeId: 'professional' });

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const unsubSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPreferences({
                            themeId: data.preferences?.themeId || 'professional',
                        });
                    }
                });
                return () => unsubSnapshot();
            } else {
                setPreferences({ themeId: 'professional' });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <UserPreferencesContext.Provider value={preferences}>
            {children}
        </UserPreferencesContext.Provider>
    );
};
