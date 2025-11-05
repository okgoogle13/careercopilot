import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// --- Module Augmentation ---
// This adds our custom tokens to the Theme object for TypeScript
declare module '@mui/material/styles' {
  // Add custom status
  interface Theme {
    status: {
      danger: string;
    };
    customShadows: {
      glowPrimary: string;
      glowSecondary: string;
      glowTertiary: string;
      glowAurora: string;
      glass: string;
      glassHover: string;
    };
    glass: {
      background: string;
      backgroundHover: string;
      border: string;
      borderHover: string;
      blur: string;
    };
    // Add M3 palette extensions
    palette: {
      tertiary: Theme['palette']['primary'];
      surface: {
        main: string;
        variant: string;
        containerLow: string;
        container: string;
        containerHigh: string;
        containerHighest: string;
      };
      outline: {
        main: string;
        variant: string;
      };
    };
  }

  // Add custom status options
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
    customShadows?: {
      glowPrimary?: string;
      glowSecondary?: string;
      glowTertiary?: string;
      glowAurora?: string;
      glass?: string;
      glassHover?: string;
    };
    glass?: {
      background?: string;
      backgroundHover?: string;
      border?: string;
      borderHover?: string;
      blur?: string;
    };
    // Add M3 palette extensions
    palette?: {
      tertiary?: ThemeOptions['palette']['primary'];
      surface?: {
        main: string;
        variant: string;
        containerLow: string;
        container: string;
        containerHigh: string;
        containerHighest: string;
      };
      outline?: {
        main: string;
        variant: string;
      };
    };
  }
}

// Extend component props to include custom variants
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    selected: true;
    interactive: true;
    glass: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    selected: true;
    interactive: true;
    glass: true;
  }
}

// --- Theme Definition ---
// We define the options object first, so we can pass the
// final theme object into functions that need it (like alpha())

const themeOptions: ThemeOptions = {
  shape: {
    borderRadius: 12,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#A78BFA', // --color-primary
      light: '#C084FC', // --color-primary-accent
      dark: '#7C3AED', // --color-primary-container
      contrastText: '#1E1B4B', // --color-on-primary
    },
    secondary: {
      main: '#C9C3DC', // --color-secondary
      dark: '#474459', // --color-secondary-container
      contrastText: '#312E41', // --color-on-secondary
    },
    // Added missing Tertiary color from globals.css
    tertiary: {
      main: '#F472B6', // --color-tertiary
      dark: '#EC4899', // --color-tertiary-container
      contrastText: '#831843', // --color-on-tertiary
    },
    error: {
      main: '#FFB4AB', // --color-error
      dark: '#93000A', // --color-error-container
      contrastText: '#690005', // --color-on-error
    },
    background: {
      default: '#131318', // --color-background
      paper: '#1E1E23', // --color-surface-container (M3 paper color)
    },
    text: {
      primary: '#F8FAFC', // --color-on-surface
      secondary: '#E2E8F0', // --color-on-surface-variant
      disabled: '#928F99', // --color-outline
    },
    divider: '#48464F', // --color-outline-variant
    // Added M3 surface colors
    surface: {
      main: '#131318', // --color-surface
      variant: '#1F1F23', // --color-surface-variant
      containerLow: '#18181D', // --color-surface-container-low
      container: '#1E1E23', // --color-surface-container
      containerHigh: '#262629', // --color-surface-container-high
      containerHighest: '#2E2E32', // --color-surface-container-highest
    },
    // Added M3 outline colors
    outline: {
      main: '#928F99', // --color-outline
      variant: '#48464F', // --color-outline-variant
    },
  },
  typography: {
    fontFamily:
      '"Google Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    // Replaced var() with raw values from globals.css
    h1: {
      fontWeight: 700,
      fontSize: '64px', // --font-size-4xl
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '48px', // --font-size-3xl
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '32px', // --font-size-2xl
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '24px', // --font-size-xl
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '18px', // --font-size-lg
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '16px', // --font-size-base
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '16px', // --font-size-base
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px', // --font-size-sm
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  spacing: 4, // Note: This makes theme.spacing(1) = 4px. MUI default is 8px.
  // --- Custom Tokens (Fixed) ---
  // Fixed glass tokens to use dark-mode values from globals.css
  glass: {
    background: 'rgba(30, 30, 35, 0.7)', // --glass-bg
    backgroundHover: 'rgba(38, 38, 41, 0.8)', // --glass-bg-hover
    border: 'rgba(167, 139, 250, 0.2)', // --glass-border
    borderHover: 'rgba(244, 114, 182, 0.4)', // --glass-border-hover
    blur: '24px', // --glass-blur
  },
  status: {
    danger: '#FFB4AB', // --color-error
  },
};

// --- Create the Base Theme ---
// We create the theme here so we can use its values below
const baseTheme = createTheme(themeOptions);

// --- Create Final Theme with Dynamic Values ---
// Now we add values that depend on the baseTheme (like palette colors)
const finalTheme = createTheme(baseTheme, {
  // Fixed customShadows to use alpha() and theme palette
  customShadows: {
    glowPrimary: `0 0 16px ${alpha(baseTheme.palette.primary.main, 0.4)}`,
    glowSecondary: `0 0 16px ${alpha(baseTheme.palette.secondary.main, 0.4)}`,
    glowTertiary: `0 0 16px ${alpha(
      baseTheme.palette.tertiary.main,
      0.4
    )}`,
    glowAurora: `0 0 64px ${alpha(baseTheme.palette.primary.main, 0.2)}`,
    glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
    glassHover: '0 8px 40px rgba(0, 0, 0, 0.15)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: baseTheme.palette.background.default,
          color: baseTheme.palette.text.primary,
          // Fixed: Use aurora effect from globals.css
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(167, 139, 250, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: -2,
          },
          // Fixed: Use grain effect from globals.css
          '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.03,
            pointerEvents: 'none',
            zIndex: -1,
          },
        },
      },
    },
    // Merged MuiCard definition
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          // Use M3 paper color as default
          backgroundColor: baseTheme.palette.surface.container,
          backgroundImage: 'none', // Ensure no rogue gradients
        },
      },
      variants: [
        // This is the new, working 'glass' variant
        {
          props: { variant: 'glass' },
          style: {
            background: baseTheme.glass.background,
            backdropFilter: `blur(${baseTheme.glass.blur})`,
            WebkitBackdropFilter: `blur(${baseTheme.glass.blur})`,
            border: `1px solid ${baseTheme.glass.border}`,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              background: baseTheme.glass.backgroundHover,
              borderColor: baseTheme.glass.borderHover,
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      ],
    },
    // Apply glass variant to Paper as well
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.surface.container,
          backgroundImage: 'none',
        },
      },
      variants: (baseTheme.components?.MuiCard as any).variants,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      // I removed the 'glass' variant as it depended on an external file
      // I fixed the styleOverrides to use theme colors instead of var()
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: baseTheme.palette.outline.variant, // Use theme
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: baseTheme.palette.outline.main, // Use theme
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: baseTheme.palette.primary.main, // Use theme
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
});

export default finalTheme;