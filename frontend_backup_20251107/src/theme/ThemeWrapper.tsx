import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import React from 'react';
import finalTheme from './theme'; // Import your fixed theme

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // We don't need context or state, just provide the one theme
  return (
    <MuiThemeProvider theme={finalTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeWrapper;