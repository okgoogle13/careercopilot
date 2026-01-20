import * as React from 'react';

export type Mode = 'gallery' | 'laboratory';

export interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ModeContext = React.createContext<ModeContextValue | undefined>(undefined);

export const ModeProvider: React.FC<{
  initialMode?: Mode;
  children: React.ReactNode;
}> = ({ initialMode = 'gallery', children }) => {
  const [mode, setMode] = React.useState<Mode>(initialMode);

  const toggleMode = React.useCallback(() => {
    setMode((current) => (current === 'gallery' ? 'laboratory' : 'gallery'));
  }, []);

  const value = React.useMemo(() => ({ mode, setMode, toggleMode }), [mode, toggleMode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = (): ModeContextValue => {
  const context = React.useContext(ModeContext);
  if (context) return context;
  return { mode: 'gallery', setMode: () => {}, toggleMode: () => {} };
};

export { ModeContext };
