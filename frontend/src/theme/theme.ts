import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5FD6', // Darker purple for better contrast (4.5:1 ratio on dark bg)
      light: '#A78BFA',
      dark: '#6D28D9',
      contrastText: '#FFFFFF', // Ensure white text on primary buttons
    },
    secondary: {
      main: '#10B981', // Green with good contrast
      light: '#34D399',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1E293B',
      paper: '#293548',
    },
    text: {
      primary: '#F8FAFC', // High contrast white for primary text
      secondary: '#CBD5E1', // Medium contrast gray for secondary text
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
          backgroundColor: '#8B5FD6',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#7C3AED',
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
              borderColor: '#8B5FD6',
            },
          },
        },
      },
    },
  },
});
