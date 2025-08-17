import React, { useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserPreferencesContext } from './UserPreferencesContextDefinition';

interface UserPreferences {
    themeId: string;
}

// Hook moved to separate file for Fast Refresh compatibility
// import { useUserPreferences } from './userPreferencesHooks';

interface UserPreferencesProviderProps {
    children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
    const [preferences, setPreferences] = useState<UserPreferences>({ themeId: 'professional' });

    useEffect(() => {
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
