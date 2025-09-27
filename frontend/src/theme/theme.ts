import { createTheme } from '@mui/material/styles';

/**
 * Career Copilot Dark Theme
 *
 * Color Palette:
 * - Primary: Purple/Violet (#A855F7) - Main brand color
 * - Secondary: Warm Brown (#8B5A3C) - Accent color for cards
 * - Background: Very dark (#0F0F0F) with slightly lighter papers (#1A1A1A)
 * - Text: High contrast white (#FFFFFF) with light gray secondary (#B3B3B3)
 *
 * Features:
 * - Custom Card variants: 'selected' and 'interactive'
 * - Warm-toned card styles for accent elements
 * - Enhanced typography with proper contrast
 */

// Extend Card component props to include custom variants
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    selected: true;
    interactive: true;
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A855F7', // Purple/violet that matches your screenshots
      light: '#C084FC',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5A3C', // Warm brown/orange for accent cards
      light: '#A67C5A',
      dark: '#6B4423',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F0F0F', // Very dark background like in your screenshots
      paper: '#1A1A1A', // Slightly lighter for cards/papers
    },
    text: {
      primary: '#FFFFFF', // Bright white for primary text
      secondary: '#B3B3B3', // Light gray for secondary text
    },
    error: {
      main: '#EF4444', // Red with good contrast on dark backgrounds
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Orange with good contrast
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Same as secondary for consistency
      light: '#34D399',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#3B82F6', // Blue with good contrast
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    // Ensure buttons meet contrast requirements
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600, // Slightly bolder for better readability
        },
        containedPrimary: {
          backgroundColor: '#A855F7',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#9333EA',
          },
          '&:disabled': {
            backgroundColor: '#64748B',
            color: '#94A3B8',
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
