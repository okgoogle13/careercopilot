import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
// Import from main application theme (re-exported through ./theme)
import theme from './theme';

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that provides the MUI theme to the application.
 * This should be placed at the root of your application.
 *
 * @component
 * @example
 * ```tsx
 * import { ThemeProvider } from '@careercopilot/ui/theme';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <CssBaseline />
 *       <AppContent />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
