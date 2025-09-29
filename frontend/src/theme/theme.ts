import { createTheme } from '@mui/material/styles';
import type { Theme, ThemeOptions } from '@mui/material/styles';

// Extend the Theme interface
declare module '@mui/material/styles' {
  interface Theme {
    // Add custom theme properties here if needed
  }
  
  interface ThemeOptions {
    // Add custom theme options here if needed
  }
}

// Extend the Card component to include custom variants
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    selected: true;
    interactive: true;
  }
}

// Extend the Paper component to include custom variants
declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    selected: true;
    interactive: true;
  }
}

// Create the theme
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A855F7', // Purple/violet
      dark: '#7C3AED',
      light: '#C084FC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5A3C', // Warm brown/orange
      dark: '#6B4423',
      light: '#A67C5A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#666666',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        },
      },
      variants: [
        {
          props: { variant: 'selected' },
          style: {
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)',
          },
        },
        {
          props: { variant: 'interactive' },
          style: {
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        },
      },
    },
  },
});
