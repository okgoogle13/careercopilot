import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type AppMode = 'gallery' | 'laboratory';
export type Mode = AppMode;

export interface ModeContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    toggleMode: () => void;
}

export type ModeContextValue = ModeContextType;

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode; initialMode?: AppMode }> = ({
    children,
    initialMode = 'laboratory'
}) => {
    const [mode, setMode] = useState<AppMode>(initialMode);

    const toggleMode = () => {
        setMode((prev) => (prev === 'gallery' ? 'laboratory' : 'gallery'));
    };

    useEffect(() => {
        document.body.dataset.mode = mode;
    }, [mode]);

    return (
        <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = (): ModeContextType => {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};
