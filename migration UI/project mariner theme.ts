// Material-UI Theme Configuration
// Install dependencies: npm install @mui/material @emotion/react @emotion/styled

export const extractedTheme = {
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1a73e8',
          light: '#4285f4',
          dark: '#0d47a1',
        },
        secondary: {
          main: '#34a853',
          light: '#5bb974',
          dark: '#0f9d58',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#1a73e8',
          light: '#4285f4',
          dark: '#0d47a1',
        },
        secondary: {
          main: '#34a853',
          light: '#5bb974',
          dark: '#0f9d58',
        },
        background: {
          default: '#0f1419',
          paper: '#1a1f2e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9aa0a6',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2.125rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          padding: '10px 24px',
        },
        contained: {
          background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1557b0 0%, #2563eb 100%)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1f2e',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          '&:hover': {
            borderColor: 'rgba(26, 115, 232, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
};

//
// Usage in your React project:
// 
// 1. Install dependencies:
//    npm install @mui/material @emotion/react @emotion/styled
//
// 2. Basic implementation:
//    - Import ThemeProvider and createTheme functions
//    - Create theme using createTheme(extractedTheme)
//    - Wrap your app with ThemeProvider component
//    
//    Example usage pattern:
//    const theme = createTheme(extractedTheme);
//    
//    function App() {
//      return (
//        <ThemeProvider theme={theme}>
//          {/* Your app components */}
//        </ThemeProvider>
//      );
//    }
//
// 3. For themes with CSS variables (dark mode support):
//    - Use the useColorScheme hook for mode switching
//    
//    function ModeToggle() {
//      const { mode, setMode } = useColorScheme();
//      if (!mode) return null;
//      return (
//        <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
//          Switch to {mode === 'light' ? 'dark' : 'light'} mode
//        </button>
//      );
//    }
//
// Note: Save this as theme.ts in your project directory
