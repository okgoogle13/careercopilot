import * as React from 'react';

export type Mode = 'gallery' | 'laboratory';

export interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = React.createContext<ModeContextValue | undefined>(undefined);

export const ModeProvider: React.FC<{
  initialMode?: Mode;
  children: React.ReactNode;
}> = ({ initialMode = 'gallery', children }) => {
  const [mode, setMode] = React.useState<Mode>(initialMode);

  const value = React.useMemo(() => ({ mode, setMode }), [mode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};

export const useMode = (): ModeContextValue => {
  const context = React.useContext(ModeContext);
  if (context) return context;
  return { mode: 'gallery', setMode: () => {} };
};

export { ModeContext };
