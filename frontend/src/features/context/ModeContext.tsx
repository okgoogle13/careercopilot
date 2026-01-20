import React, { createContext, useContext, useState, useEffect } from 'react';

type Mode = 'gallery' | 'laboratory';

interface ModeContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{
    children: React.ReactNode;
    initialMode?: Mode
}> = ({ children, initialMode = 'gallery' }) => {
    const [mode, setMode] = useState<Mode>(initialMode);

    // Sync with data attribute for CSS tokens
    useEffect(() => {
        document.documentElement.setAttribute('data-mode', mode);
    }, [mode]);

    const toggleMode = () => {
        setMode(prev => prev === 'gallery' ? 'laboratory' : 'gallery');
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};
