import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import App from './App';

/**
 * AppWrapper component that provides theme and global styles to the application
 * Now includes Electric Alchemist architectural shell (Deep Violet Void + dot grid + noise)
 */
function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="architectural-shell">
        <App />
      </div>
    </ThemeProvider>
  );
}

export default AppWrapper;
