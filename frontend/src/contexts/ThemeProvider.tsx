import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'dark';

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark';
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Apply dark theme class to HTML element on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  // Dark theme is now universal and fixed
  const contextValue: ThemeProviderContext = {
    theme: 'dark',
    setTheme: () => {}, // No-op since theme is fixed
    resolvedTheme: 'dark',
  };

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderContext => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
