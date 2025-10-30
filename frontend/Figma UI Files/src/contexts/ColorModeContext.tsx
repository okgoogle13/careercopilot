import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ColorMode = 'light' | 'dark' | 'system';

interface ColorModeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  resolvedColorMode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

interface ColorModeProviderProps {
  children: ReactNode;
  defaultMode?: ColorMode;
  storageKey?: string;
}

export function ColorModeProvider({
  children,
  defaultMode = 'dark', // FML Career Copilot defaults to dark mode
  storageKey = 'fml-career-copilot-color-mode',
}: ColorModeProviderProps) {
  const [colorMode, setColorModeState] = useState<ColorMode>(defaultMode);
  const [resolvedColorMode, setResolvedColorMode] = useState<'light' | 'dark'>('dark');

  // Initialize color mode from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ColorMode;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setColorModeState(stored);
    } else {
      // For FML Career Copilot, we default to dark mode for the edgy aesthetic
      setColorModeState('dark');
    }
  }, [storageKey]);

  // Resolve system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (colorMode === 'system') {
        setResolvedColorMode(mediaQuery.matches ? 'dark' : 'light');
        updateDocumentClass(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Set initial resolved mode
    if (colorMode === 'system') {
      setResolvedColorMode(mediaQuery.matches ? 'dark' : 'light');
      updateDocumentClass(mediaQuery.matches ? 'dark' : 'light');
    } else {
      setResolvedColorMode(colorMode);
      updateDocumentClass(colorMode);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [colorMode]);

  const updateDocumentClass = (mode: 'light' | 'dark') => {
    const root = document.documentElement;

    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#0f172a' : '#ffffff');
    }
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem(storageKey, mode);

    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedColorMode(systemDark ? 'dark' : 'light');
      updateDocumentClass(systemDark ? 'dark' : 'light');
    } else {
      setResolvedColorMode(mode);
      updateDocumentClass(mode);
    }
  };

  const toggleColorMode = () => {
    if (colorMode === 'dark') {
      setColorMode('light');
    } else if (colorMode === 'light') {
      setColorMode('system');
    } else {
      setColorMode('dark');
    }
  };

  const value: ColorModeContextType = {
    colorMode,
    setColorMode,
    resolvedColorMode,
    toggleColorMode,
  };

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
}

// Hook for getting the current theme state
export function useTheme() {
  const { resolvedColorMode } = useColorMode();
  return {
    theme: resolvedColorMode,
    isDark: resolvedColorMode === 'dark',
    isLight: resolvedColorMode === 'light',
  };
}

// Component for theme switching UI
interface ColorModeSwitcherProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ColorModeSwitcher({
  size = 'md',
  showLabel = true,
  className = '',
}: ColorModeSwitcherProps) {
  const { colorMode, setColorMode, resolvedColorMode } = useColorMode();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const modes = [
    {
      value: 'light' as ColorMode,
      label: 'Light',
      icon: '☀️',
      description: 'Light theme',
    },
    {
      value: 'dark' as ColorMode,
      label: 'Dark',
      icon: '🌙',
      description: 'Dark theme (recommended)',
    },
    {
      value: 'system' as ColorMode,
      label: 'System',
      icon: '💻',
      description: 'Follow system preference',
    },
  ];

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setColorMode(mode.value)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm
              transition-all duration-200
              ${
                colorMode === mode.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
            title={mode.description}
          >
            <span className={sizeClasses[size]}>{mode.icon}</span>
            {showLabel && <span className="font-medium">{mode.label}</span>}
          </button>
        ))}
      </div>

      {showLabel && (
        <p className="text-xs text-muted-foreground mt-2">
          Current: {resolvedColorMode === 'dark' ? 'Dark' : 'Light'} theme
          {colorMode === 'system' && ' (following system)'}
        </p>
      )}
    </div>
  );
}
