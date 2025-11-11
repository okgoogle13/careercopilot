import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import App from './App';

/**
 * AppWrapper component that provides theme and global styles to the application
 */
function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

export default AppWrapper;
