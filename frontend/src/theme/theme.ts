import { createTheme } from '@mui/material/styles';

/**
 * Career Copilot Theme
 *
 * Color Palette:
 * - Primary: Purple/Violet (#A855F7) - Main brand color
 * - Secondary: Warm Brown (#8B5A3C) - Accent color for cards
 * - Background: Very dark (#0F0F0F) with slightly lighter papers (#1A1A1A)
 * - Text: High contrast white (#FFFFFF) with light gray secondary (#B3B3B3)
 *
 * Typography:
 * - Font Family: Inter, sans-serif
 * - Material Icons for consistent iconography
 *
 * Features:
 * - Custom Card variants: 'selected' and 'interactive'
 * - Warm-toned card styles for accent elements
 * - Enhanced typography with proper contrast
 */

// Extend component props to include custom variants
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    selected: true;
    interactive: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    selected: true;
    interactive: true;
  }
}

export const theme = createTheme({
  shape: {
    borderRadius: 12, // More rounded corners for a playful feel
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700, // Bolder for expressiveness
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.35,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 700, // Bolder for better hierarchy
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      fontWeight: 500,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.9375rem',
      lineHeight: 1.57,
      fontWeight: 500,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.9375rem',
      lineHeight: 1.71,
      letterSpacing: '0.01071em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600, // Slightly bolder for better visibility
      letterSpacing: '0.02857em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontDisplay: 'swap',
              fontWeight: 400,
              src: `url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap)`,
            },
          ],
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#9C27B0', // Vibrant purple for primary actions
      light: '#BA68C8',
      dark: '#7B1FA2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF4081', // Vibrant pink for secondary actions
      light: '#FF79B0',
      dark: '#C2185B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212', // Dark background with a slight blue tint
      paper: '#1E1E1E', // Slightly lighter for cards/papers
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFA000',
      light: '#FFB74D',
      dark: '#FF8F00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded corners
          padding: '10px 24px', // More padding for better touch targets
          textTransform: 'none', // Keep text as is
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #8E24AA 30%, #D500F9 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #FF4081 30%, #FF80AB 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #F50057 30%, #FF4081 90%)',
          },
        },
      },
    },
    // Ensure form inputs have proper contrast
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#64748B', // Better contrast for borders
            },
            '&:hover fieldset': {
              borderColor: '#94A3B8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A855F7',
            },
          },
        },
      },
    },
    // Add Card component styles for warm-toned cards like in your screenshots
    MuiCard: {
      variants: [
        {
          props: { variant: 'selected' },
          style: {
            border: '2px solid',
            borderColor: '#A855F7', // Use new primary color
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)',
          },
        },
        {
          props: { variant: 'interactive' },
          style: {
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          '&.warm-card': {
            backgroundColor: '#2D1B12', // Warm brown background for accent cards
            border: '1px solid #8B5A3C',
          },
          '&.purple-card': {
            backgroundColor: '#1E1B3A', // Purple-tinted background
            border: '1px solid #A855F7',
          },
        },
      },
    },
    // Enhanced Paper component for consistency
    MuiPaper: {
      variants: [
        {
          props: { variant: 'selected' },
          style: {
            border: '2px solid',
            borderColor: '#A855F7',
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)',
          },
        },
        {
          props: { variant: 'interactive' },
          style: {
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          '&.warm-paper': {
            backgroundColor: '#2D1B12',
          },
        },
      },
    },
    // Typography enhancements
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: '#FFFFFF',
          fontWeight: 700,
        },
        h2: {
          color: '#FFFFFF',
          fontWeight: 600,
        },
        h3: {
          color: '#FFFFFF',
          fontWeight: 600,
        },
        h4: {
          color: '#FFFFFF',
          fontWeight: 600,
        },
        h5: {
          color: '#FFFFFF',
          fontWeight: 500,
        },
        h6: {
          color: '#FFFFFF',
          fontWeight: 500,
        },
      },
    },
  },
});
