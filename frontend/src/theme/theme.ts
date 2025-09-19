import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    materialTokens: {
      light: any;
      dark: any;
    };
  }
  interface ThemeOptions {
    materialTokens?: {
      light: any;
      dark: any;
    };
  }
}

const m3Tokens = {
  light: {
    primary: '#585992',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E2DFFF',
    onPrimaryContainer: '#414178',
    secondary: '#5D5C72',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E2E0F9',
    onSecondaryContainer: '#454559',
    tertiary: '#795369',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8EB',
    onTertiaryContainer: '#5F3C51',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#93000A',
    background: '#FCF8FF',
    onBackground: '#1B1B21',
    surface: '#FCF8FF',
    onSurface: '#1B1B21',
    surfaceVariant: '#E4E1EC',
    onSurfaceVariant: '#47464F',
    outline: '#777680',
    outlineVariant: '#C8C5D0',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F6F2FA',
    surfaceContainer: '#F0ECF4',
    surfaceContainerHigh: '#EAE7EF',
    surfaceContainerHighest: '#E4E1E9',
  },
  dark: {
    primary: '#C1C1FF',
    onPrimary: '#2A2A60',
    primaryContainer: '#414178',
    onPrimaryContainer: '#E2DFFF',
    secondary: '#C6C4DD',
    onSecondary: '#2F2F42',
    secondaryContainer: '#454559',
    onSecondaryContainer: '#E2E0F9',
    tertiary: '#E9B9D2',
    onTertiary: '#46263A',
    tertiaryContainer: '#5F3C51',
    onTertiaryContainer: '#FFD8EB',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#131318',
    onBackground: '#E4E1E9',
    surface: '#131318',
    onSurface: '#E4E1E9',
    surfaceVariant: '#47464F',
    onSurfaceVariant: '#C8C5D0',
    outline: '#918F9A',
    outlineVariant: '#47464F',
    surfaceContainerLowest: '#0E0E13',
    surfaceContainerLow: '#1B1B21',
    surfaceContainer: '#1F1F25',
    surfaceContainerHigh: '#2A292F',
    surfaceContainerHighest: '#35343A',
  },
};

const createM3Theme = (mode: 'light' | 'dark') => {
  const tokens = m3Tokens[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        contrastText: tokens.onPrimary,
      },
      secondary: {
        main: tokens.secondary,
        contrastText: tokens.onSecondary,
      },
      error: {
        main: tokens.error,
        contrastText: tokens.onError,
      },
      background: {
        default: tokens.background,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.onBackground,
        secondary: tokens.onSurfaceVariant,
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      button: { textTransform: 'none' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surfaceContainer,
            color: tokens.onSurface,
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: tokens.surfaceContainerLow,
            },
          },
        },
      },
    },
    materialTokens: m3Tokens,
  });
};

export const lightTheme = createM3Theme('light');
export const darkTheme = createM3Theme('dark');
export default lightTheme;
