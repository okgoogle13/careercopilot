import { alpha, createTheme, Theme } from '@mui/material/styles';

// --- TypeScript Module Augmentation ---
// Adds custom 'interactive' and 'selected' variants to the Card component.
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    interactive: true;
    selected: true;
  }
}

// --- CSS Variable References ---
// We reference the CSS variables defined in our global stylesheet.
// This allows us to use the Material-UI theme provider while getting the
// performance benefits of CSS variables.
const colors = {
  primary: 'var(--md-sys-color-primary)',
  onPrimary: 'var(--md-sys-color-on-primary)',
  primaryContainer: 'var(--md-sys-color-primary-container)',
  onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
  secondary: 'var(--md-sys-color-secondary)',
  onSecondary: 'var(--md-sys-color-on-secondary)',
  secondaryContainer: 'var(--md-sys-color-secondary-container)',
  onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
  tertiary: 'var(--md-sys-color-tertiary)',
  onTertiary: 'var(--md-sys-color-on-tertiary)',
  tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
  onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',
  error: 'var(--md-sys-color-error)',
  onError: 'var(--md-sys-color-on-error)',
  errorContainer: 'var(--md-sys-color-error-container)',
  onErrorContainer: 'var(--md-sys-color-on-error-container)',
  background: 'var(--md-sys-color-background)',
  onBackground: 'var(--md-sys-color-on-background)',
  surface: 'var(--md-sys-color-surface)',
  onSurface: 'var(--md-sys-color-on-surface)',
  surfaceVariant: 'var(--md-sys-color-surface-variant)',
  onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
  outline: 'var(--md-sys-color-outline)',
  outlineVariant: 'var(--md-sys-color-outline-variant)',
  surfaceContainerLowest: 'var(--md-sys-color-surface-container-lowest)',
  surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
  surfaceContainer: 'var(--md-sys-color-surface-container)',
  surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
  surfaceContainerHighest: 'var(--md-sys-color-surface-container-highest)',

  // Career Copilot specific colors
  ccPrimary: 'var(--cc-color-primary)',
  ccSecondary: 'var(--cc-color-secondary)',
  ccTertiary: 'var(--cc-color-tertiary)',
  ccSuccess: 'var(--cc-color-success)',
  ccWarning: 'var(--cc-color-warning)',
  ccInfo: 'var(--cc-color-info)',
};

// Shape tokens
const shapeTokens = {
  corner: {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 28,
    full: 9999,
  },
};

// --- Enhanced Theme Definition with Career Copilot Brand ---
const createM3Theme = (mode: 'light' | 'dark' = 'dark'): Theme => createTheme({
  palette: {
    mode,
    // Career Copilot branded primary color
    primary: {
      main: colors.ccPrimary,
      contrastText: colors.onPrimary,
      light: alpha(colors.ccPrimary, 0.7),
      dark: alpha(colors.ccPrimary, 0.9),
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.onSecondary,
      light: alpha(colors.secondary, 0.7),
      dark: alpha(colors.secondary, 0.9),
    },
    tertiary: {
      main: colors.ccTertiary,
      contrastText: colors.onTertiary,
      light: alpha(colors.ccTertiary, 0.7),
      dark: alpha(colors.ccTertiary, 0.9),
    },
    error: {
      main: colors.error,
      contrastText: colors.onError,
      light: alpha(colors.error, 0.7),
      dark: alpha(colors.error, 0.9),
    },
    warning: {
      main: colors.ccWarning,
      contrastText: '#ffffff',
      light: alpha(colors.ccWarning, 0.7),
      dark: alpha(colors.ccWarning, 0.9),
    },
    info: {
      main: colors.ccInfo,
      contrastText: '#ffffff',
      light: alpha(colors.ccInfo, 0.7),
      dark: alpha(colors.ccInfo, 0.9),
    },
    success: {
      main: colors.ccSuccess,
      contrastText: '#ffffff',
      light: alpha(colors.ccSuccess, 0.7),
      dark: alpha(colors.ccSuccess, 0.9),
    },
    background: {
      default: colors.background,
      paper: colors.surfaceContainer
    },
    surface: {
      main: colors.surface,
      variant: colors.surfaceVariant,
      containerLowest: colors.surfaceContainerLowest,
      containerLow: colors.surfaceContainerLow,
      container: colors.surfaceContainer,
      containerHigh: colors.surfaceContainerHigh,
      containerHighest: colors.surfaceContainerHighest,
    },
    text: {
      primary: colors.onSurface,
      secondary: colors.onSurfaceVariant,
      disabled: alpha(colors.onSurface, 0.38),
    },
    divider: colors.outlineVariant,
    outline: {
      main: colors.outline,
      variant: colors.outlineVariant,
    },
    action: {
      hover: alpha(colors.onSurface, 0.08),
      selected: alpha(colors.onSurface, 0.16),
      disabled: alpha(colors.onSurface, 0.12),
      disabledBackground: alpha(colors.onSurface, 0.12),
      focus: alpha(colors.primary, 0.12),
    },
  },
  shape: {
    borderRadius: shapeTokens.corner.medium,
  },
  spacing: 8,
  typography: {
    fontFamily: [
      'Inter',
      '"Google Sans"',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Material Design 3 Typography Scale
    h1: {
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.12,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.8125rem',
      fontWeight: 400,
      lineHeight: 1.16,
      letterSpacing: '0em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 400,
      lineHeight: 1.22,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.29,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.33,
      letterSpacing: '0em',
    },
    subtitle1: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.27,
      letterSpacing: '0em',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.009375em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.009375em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.015625em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0.025em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.00625em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.33,
      letterSpacing: '0.041666667em',
      textTransform: 'uppercase',
    },
  },
  shadows: [
    'none',
    'var(--elevation-level1)',
    'var(--elevation-level1)',
    'var(--elevation-level2)',
    'var(--elevation-level2)',
    'var(--elevation-level3)',
    'var(--elevation-level3)',
    'var(--elevation-level4)',
    'var(--elevation-level4)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
    'var(--elevation-level5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shapeTokens.corner.large,
          padding: '10px 24px',
          boxShadow: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.ccPrimary} 0%, ${alpha(colors.ccPrimary, 0.8)} 100%)`,
          color: colors.onPrimary,
          '&:hover': {
            boxShadow: `0px 2px 6px 2px ${alpha(colors.ccPrimary, 0.25)}`,
            background: `linear-gradient(135deg, ${alpha(colors.ccPrimary, 0.9)} 0%, ${alpha(colors.ccPrimary, 0.7)} 100%)`,
          },
          '&:active': {
            boxShadow: `0px 1px 3px 1px ${alpha(colors.ccPrimary, 0.3)}`,
          },
        },
        outlined: {
          borderColor: colors.outline,
          color: colors.ccPrimary,
          '&:hover': {
            backgroundColor: alpha(colors.ccPrimary, 0.08),
            borderColor: colors.ccPrimary,
          },
        },
        text: {
          color: colors.ccPrimary,
          '&:hover': {
            backgroundColor: alpha(colors.ccPrimary, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surfaceContainer,
          borderRadius: shapeTokens.corner.medium,
          boxShadow: 'var(--elevation-level1)',
          border: `1px solid ${colors.outlineVariant}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
      variants: [
        {
          props: { variant: 'interactive' },
          style: {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: colors.surfaceContainerHigh,
              borderColor: colors.outline,
              boxShadow: `var(--elevation-level2), 0 0 20px ${alpha(colors.ccPrimary, 0.1)}`,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'var(--elevation-level1)',
            },
          },
        },
        {
          props: { variant: 'selected' },
          style: {
            backgroundColor: colors.primaryContainer,
            borderColor: colors.ccPrimary,
            borderWidth: '2px',
            boxShadow: `0 0 0 1px ${alpha(colors.ccPrimary, 0.2)}`,
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: shapeTokens.corner.small,
            backgroundColor: colors.surfaceContainerHigh,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: colors.outlineVariant,
            },
            '&:hover fieldset': {
              borderColor: colors.outline,
            },
            '&.Mui-focused': {
              backgroundColor: colors.surfaceContainerHighest,
              '& fieldset': {
                borderColor: colors.ccPrimary,
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.onSurfaceVariant,
            '&.Mui-focused': {
              color: colors.ccPrimary,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: shapeTokens.corner.small,
          backgroundColor: colors.surfaceContainerLow,
          color: colors.onSurface,
          border: `1px solid ${colors.outlineVariant}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: colors.surfaceContainer,
          },
        },
        filled: {
          backgroundColor: colors.secondaryContainer,
          color: colors.onSecondaryContainer,
        },
        colorPrimary: {
          backgroundColor: colors.primaryContainer,
          color: colors.onPrimaryContainer,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          color: colors.onSurface,
          boxShadow: 'var(--elevation-level2)',
          borderBottom: `1px solid ${colors.outlineVariant}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surfaceContainer,
          borderRight: `1px solid ${colors.outlineVariant}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: shapeTokens.corner.medium,
          margin: '4px 8px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: colors.secondaryContainer,
            color: colors.onSecondaryContainer,
            '&:hover': {
              backgroundColor: alpha(colors.secondaryContainer, 0.8),
            },
          },
          '&:hover': {
            backgroundColor: alpha(colors.onSurface, 0.08),
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.outlineVariant}`,
        },
        indicator: {
          backgroundColor: colors.ccPrimary,
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: colors.onSurfaceVariant,
          '&.Mui-selected': {
            color: colors.ccPrimary,
          },
          '&:hover': {
            color: colors.onSurface,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: 'var(--elevation-level1)',
        },
        elevation2: {
          boxShadow: 'var(--elevation-level2)',
        },
        elevation3: {
          boxShadow: 'var(--elevation-level3)',
        },
        elevation4: {
          boxShadow: 'var(--elevation-level4)',
        },
        elevation8: {
          boxShadow: 'var(--elevation-level5)',
        },
      },
    },
  },
});

// Create light and dark theme instances
export const lightTheme = createM3Theme('light');
export const darkTheme = createM3Theme('dark');

// Default export (dark theme for Career Copilot brand)
export default darkTheme;

// Augment the Theme interface to include custom tokens
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surface: {
      main: string;
      variant: string;
      containerLowest: string;
      containerLow: string;
      container: string;
      containerHigh: string;
      containerHighest: string;
    };
    outline: {
      main: string;
      variant: string;
    };
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surface?: {
      main: string;
      variant: string;
      containerLowest: string;
      containerLow: string;
      container: string;
      containerHigh: string;
      containerHighest: string;
    };
    outline?: {
      main: string;
      variant: string;
    };
  }
}

// Export useful tokens and utilities
export { colors, shapeTokens };
export type { Theme };