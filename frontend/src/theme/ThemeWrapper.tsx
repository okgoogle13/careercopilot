import React, { useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { theme as baseTheme } from './theme';
import { ColorModeContext } from './ColorModeContext';
import { createTheme } from '@mui/material/styles';

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => {
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode: mode,
      },
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeWrapper;
