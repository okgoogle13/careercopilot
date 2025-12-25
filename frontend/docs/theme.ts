// --- theme.ts ---
import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// --- Module Augmentation ---
declare module '@mui/material/styles' {
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
  }

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
  }

  interface Palette {
    tertiary: Palette['primary'];
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
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
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
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    glass: true;
    interactive: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
    interactive: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    aurora: true;
    glass: true;
  }
}

// --- Theme Definition ---
const themeOptions: ThemeOptions = {
  shape: {
    borderRadius: 12,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#A78BFA', // Vibrant Purple - Aurora Primary
      light: '#C4B5FD',
      dark: '#8B5CF6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C9C3DC', // Secondary Purple
      light: '#E5E1F5',
      dark: '#9E95C9',
      contrastText: '#1E1E23',
    },
    tertiary: {
      main: '#F472B6', // Bright Pink - Aurora Accent
      light: '#FBCFE8',
      dark: '#DB2777',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FFB4AB',
      light: '#FECDD3',
      dark: '#FB7185',
      contrastText: '#1E1E23',
    },
    warning: {
      main: '#FDE047',
      light: '#FEF08A',
      dark: '#FACC15',
      contrastText: '#1E1E23',
    },
    success: {
      main: '#86EFAC',
      light: '#BBF7D0',
      dark: '#4ADE80',
      contrastText: '#1E1E23',
    },
    info: {
      main: '#A78BFA',
      light: '#C4B5FD',
      dark: '#8B5CF6',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#131318', // Deep dark background
      paper: '#1E1E23', // Surface container
    },
    text: {
      primary: '#F8FAFC', // High contrast white
      secondary: '#E2E8F0', // Muted white
      disabled: '#94A3B8',
    },
    divider: '#48464F', // Outline variant
    surface: {
      main: '#131318',
      variant: '#1F1F23',
      containerLow: '#18181D',
      container: '#1E1E23',
      containerHigh: '#262629',
      containerHighest: '#2E2E32',
    },
    outline: {
      main: '#928F99',
      variant: '#48464F',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  spacing: 8, // Base spacing unit (8px)
  glass: {
    background: 'rgba(30, 30, 35, 0.7)',
    backgroundHover: 'rgba(38, 38, 41, 0.8)',
    border: 'rgba(167, 139, 250, 0.2)',
    borderHover: 'rgba(244, 114, 182, 0.4)',
    blur: '24px',
  },
  status: {
    danger: '#FFB4AB',
  },
};

const baseTheme = createTheme(themeOptions);

const finalTheme = createTheme(baseTheme, {
  customShadows: {
    glowPrimary: `0 0 16px ${alpha(baseTheme.palette.primary.main, 0.4)}`,
    glowSecondary: `0 0 16px ${alpha(baseTheme.palette.secondary.main, 0.4)}`,
    glowTertiary: `0 0 16px ${alpha(baseTheme.palette.tertiary.main, 0.4)}`,
    glowAurora: `0 0 64px ${alpha(baseTheme.palette.primary.main, 0.2)}, 0 0 32px ${alpha(baseTheme.palette.tertiary.main, 0.15)}`,
    glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
    glassHover: '0 8px 40px rgba(0, 0, 0, 0.15)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: baseTheme.palette.background.default,
          color: baseTheme.palette.text.primary,
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.15) 0%, transparent 50%), ' +
              'radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.12) 0%, transparent 50%), ' +
              'radial-gradient(circle at 40% 40%, rgba(167, 139, 250, 0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: -2,
          },
          '&::after': {
            content: '""',
            position: 'fixed',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.03,
            pointerEvents: 'none',
            zIndex: -1,
          },
        },
        '*': {
          boxSizing: 'border-box',
        },
        '@keyframes aurora-shimmer': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        '@keyframes glow-pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: baseTheme.palette.surface.container,
          backgroundImage: 'none',
          border: `1px solid ${baseTheme.palette.outline.variant}`,
        },
      },
      variants: [
        {
          props: { variant: 'glass' },
          style: {
            background: baseTheme.glass.background,
            backdropFilter: `blur(${baseTheme.glass.blur})`,
            WebkitBackdropFilter: `blur(${baseTheme.glass.blur})`,
            border: `1px solid ${baseTheme.glass.border}`,
            boxShadow: baseTheme.customShadows.glass,
            '&:hover': {
              background: baseTheme.glass.backgroundHover,
              borderColor: baseTheme.glass.borderHover,
              boxShadow: baseTheme.customShadows.glassHover,
            },
          },
        },
        {
          props: { variant: 'interactive' },
          style: {
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: baseTheme.customShadows.glowPrimary,
              borderColor: baseTheme.palette.primary.main,
            },
            '&:active': {
              transform: 'translateY(-2px)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.surface.container,
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
      variants: [
        {
          props: { variant: 'glass' },
          style: {
            background: baseTheme.glass.background,
            backdropFilter: `blur(${baseTheme.glass.blur})`,
            WebkitBackdropFilter: `blur(${baseTheme.glass.blur})`,
            border: `1px solid ${baseTheme.glass.border}`,
            boxShadow: baseTheme.customShadows.glass,
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: baseTheme.customShadows.glowPrimary,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
      variants: [
        {
          props: { variant: 'aurora' },
          style: {
            background: `linear-gradient(135deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.tertiary.main})`,
            color: baseTheme.palette.primary.contrastText,
            backgroundSize: '200% 200%',
            animation: 'aurora-shimmer 3s ease infinite',
            border: 'none',
            '&:hover': {
              background: `linear-gradient(135deg, ${baseTheme.palette.primary.light}, ${baseTheme.palette.tertiary.light})`,
              boxShadow: baseTheme.customShadows.glowAurora,
            },
          },
        },
        {
          props: { variant: 'glass' },
          style: {
            background: baseTheme.glass.background,
            backdropFilter: `blur(${baseTheme.glass.blur})`,
            WebkitBackdropFilter: `blur(${baseTheme.glass.blur})`,
            border: `1px solid ${baseTheme.glass.border}`,
            color: baseTheme.palette.text.primary,
            '&:hover': {
              background: baseTheme.glass.backgroundHover,
              borderColor: baseTheme.glass.borderHover,
            },
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: alpha(baseTheme.palette.primary.main, 0.2),
          color: baseTheme.palette.primary.light,
          border: `1px solid ${alpha(baseTheme.palette.primary.main, 0.3)}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: alpha(baseTheme.palette.surface.containerHigh, 0.5),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: alpha(baseTheme.palette.surface.containerHigh, 0.7),
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: baseTheme.palette.primary.main,
              },
            },
            '&.Mui-focused': {
              backgroundColor: alpha(baseTheme.palette.surface.containerHigh, 0.9),
              boxShadow: baseTheme.customShadows.glowPrimary,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          background: baseTheme.glass.background,
          backdropFilter: `blur(${baseTheme.glass.blur})`,
          WebkitBackdropFilter: `blur(${baseTheme.glass.blur})`,
          border: `1px solid ${baseTheme.glass.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(baseTheme.palette.surface.container, 0.8),
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${baseTheme.palette.outline.variant}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${baseTheme.palette.outline.variant}`,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: `linear-gradient(90deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.tertiary.main})`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            color: baseTheme.palette.primary.light,
          },
          '&.Mui-selected': {
            color: baseTheme.palette.primary.main,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${baseTheme.palette.outline.variant}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: alpha(baseTheme.palette.primary.main, 0.1),
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            '& + .MuiSwitch-track': {
              background: `linear-gradient(90deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.tertiary.main})`,
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: alpha(baseTheme.palette.primary.main, 0.1),
        },
        bar: {
          borderRadius: 8,
          background: `linear-gradient(90deg, ${baseTheme.palette.primary.main}, ${baseTheme.palette.tertiary.main})`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: baseTheme.palette.surface.containerHighest,
          border: `1px solid ${baseTheme.palette.outline.variant}`,
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default finalTheme;
