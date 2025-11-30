
import { createTheme, ThemeOptions } from '@mui/material/styles';
import tokens from '../../../design-system/tokens.json';

const { color, typography, shape, elevation, motion, spacing } = tokens;

// Augment the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    surface: typeof color.surface;
    outline: typeof color.outline;
  }
  interface PaletteOptions {
    surface?: Partial<typeof color.surface>;
    outline?: Partial<typeof color.outline>;
  }
  interface Theme {
    motion: typeof motion;
  }
  interface ThemeOptions {
    motion?: typeof motion;
  }
}

const m3ThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: color.primary['40'],
      light: color.primary['80'],
      dark: color.primary['30'],
      contrastText: color.primary['100'],
    },
    secondary: {
      main: color.secondary['40'],
      light: color.secondary['80'],
      dark: color.secondary['30'],
      contrastText: color.secondary['100'],
    },
    error: {
      main: color.error['40'],
      light: color.error['80'],
      dark: color.error['30'],
      contrastText: color.error['100'],
    },
    background: {
      default: color.surface.default,
      paper: color.surface.container,
    },
    text: {
      primary: color.neutral['10'],
      secondary: color.neutralVariant['30'],
      disabled: color.neutral['60'],
    },
    surface: color.surface,
    outline: color.outline,
  },
  typography: {
    fontFamily: typography.fontFamily.plain,
    displayLarge: {
      fontFamily: typography.fontFamily.brand,
      fontSize: typography.size.displayLarge,
      lineHeight: typography.lineHeight.displayLarge,
      fontWeight: typography.weight.regular,
      letterSpacing: typography.letterSpacing.displayLarge,
    },
    // ... add other typography variants from tokens as needed
  },
  shape: {
    borderRadius: parseFloat(shape.corner.medium),
  },
  spacing: spacing.baseUnit,
  shadows: [
    'none',
    elevation.level1,
    elevation.level2,
    elevation.level3,
    elevation.level4,
    elevation.level5,
    ...Array(19).fill('none'), // MUI requires 25 shadow values
  ],
  motion,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.corner.full,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: shape.corner.medium,
                boxShadow: elevation.level1,
                backgroundColor: color.surface.container,
            }
        }
    },
    MuiSkeleton: {
        styleOverrides: {
            root: {
                backgroundColor: color.neutralVariant['80'],
            }
        }
    }
  },
};

export const m3Theme = createTheme(m3ThemeOptions);
