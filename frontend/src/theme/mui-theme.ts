import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * M3 Electric Alchemist Theme for Material-UI
 * 
 * Configures all MUI components to respect M3 design tokens
 * defined in design-tokens.css. This enables seamless integration
 * between MUI components and the Electric Alchemist aesthetic.
 * 
 * **Key Mappings:**
 * - palette.primary → M3 Electric Indigo
 * - palette.secondary → M3 Neon Teal
 * - palette.tertiary → M3 Hot Pink
 * - palette.error → M3 Error Red
 * - palette.warning → M3 Warning Amber
 * - shape.borderRadius → M3 organic shapes (default to pebble bottom corners)
 * - typography → M3 type scale (Plus Jakarta Sans)
 * 
 * @see frontend/src/theme/design-tokens.css
 */

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',

        // Primary: Sage Green #B4D8AE
        primary: {
            main: '#B4D8AE',
            light: '#6B8F5A',
            dark: '#3D5C2A',
            contrastText: '#1D3314',
        },

        // Secondary: Soft Coral #FDCFC4
        secondary: {
            main: '#FDCFC4',
            light: '#C0877A',
            dark: '#7E493D',
            contrastText: '#47241E',
        },

        // Tertiary: Lavender #E2D0F7
        // MUI doesn't have tertiary, map to info
        info: {
            main: '#E2D0F7',
            light: '#A896CD',
            dark: '#5E4182',
            contrastText: '#301E4A',
        },

        // Error: M3 Red #F2B8B5
        error: {
            main: '#F2B8B5',
            light: '#E46962',
            dark: '#B3261E',
            contrastText: '#601410',
        },

        // Warning: Amber #FEF3C7
        warning: {
            main: '#FEF3C7',
            light: '#FCD34D',
            dark: '#F59E0B',
            contrastText: '#78350F',
        },

        // Success: Use Secondary (Teal/Coral) for success states
        // Consistent with design system preference
        success: {
            main: '#FDCFC4',
            light: '#E5B3A4',
            dark: '#62362D',
            contrastText: '#2B1410',
        },

        // Background & Surface
        background: {
            default: '#121212', // sys-color-background
            paper: '#1E1E1E',   // sys-color-surface-container
        },

        // Text
        text: {
            primary: '#E6E1E5',   // sys-color-on-surface
            secondary: '#AEA9B4', // sys-color-on-surface-variant
            disabled: '#79747E',  // ref-palette-neutral-50
        },

        // Dividers & Borders
        divider: '#484649', // sys-color-outline-variant

        // Action states
        action: {
            active: '#B4D8AE',     // sys-color-primary
            hover: '#2B2C30',      // sys-color-surface-container-high
            selected: '#303135',   // sys-color-surface-container-highest
            disabled: '#484649',   // ref-palette-neutral-30
            disabledBackground: '#2B2C30', // ref-palette-neutral-17
        },
    },

    // M3 Organic Shape System
    shape: {
        borderRadius: 20, // Base radius (approximate pebble)
    },

    // M3 Typography Scale
    typography: {
        fontFamily: 'var(--sys-type-body-family)',

        // Display scales (Hero text)
        h1: {
            fontFamily: 'var(--sys-type-display-family)',
            fontSize: 'var(--sys-type-display-large-size)',
            lineHeight: 'var(--sys-type-display-large-line-height)',
            fontWeight: 'var(--sys-type-weight-black)',
            letterSpacing: 'var(--sys-type-display-large-tracking)',
        },

        h2: {
            fontFamily: 'var(--sys-type-display-family)',
            fontSize: 'var(--sys-type-display-medium-size)',
            lineHeight: 'var(--sys-type-display-medium-line-height)',
            fontWeight: 'var(--sys-type-weight-heavy)',
        },

        h3: {
            fontFamily: 'var(--sys-type-display-family)',
            fontSize: 'var(--sys-type-display-small-size)',
            lineHeight: 'var(--sys-type-display-small-line-height)',
            fontWeight: 'var(--sys-type-weight-bold)',
        },

        // Headline scales (Page titles)
        h4: {
            fontSize: 'var(--sys-type-headline-large-size)',
            lineHeight: 'var(--sys-type-headline-large-line-height)',
            fontWeight: 'var(--sys-type-weight-bold)',
        },

        h5: {
            fontSize: 'var(--sys-type-title-large-size)',
            lineHeight: 'var(--sys-type-title-large-line-height)',
            fontWeight: 'var(--sys-type-weight-medium)',
        },

        h6: {
            fontSize: 'var(--sys-type-title-large-size)',
            lineHeight: 'var(--sys-type-title-large-line-height)',
            fontWeight: 'var(--sys-type-weight-medium)',
        },

        // Body text
        body1: {
            fontSize: 'var(--sys-type-body-large-size)',
            lineHeight: 'var(--sys-type-body-large-line-height)',
            fontWeight: 'var(--sys-type-weight-regular)',
        },

        body2: {
            fontSize: 'var(--sys-type-body-medium-size)',
            lineHeight: 'var(--sys-type-body-medium-line-height)',
            fontWeight: 'var(--sys-type-weight-regular)',
        },

        // Buttons & Labels
        button: {
            fontWeight: 'var(--sys-type-weight-medium)',
            textTransform: 'none', // M3 uses sentence case, not uppercase
        },

        caption: {
            fontFamily: 'var(--sys-type-mono-family)',
            fontSize: '0.75rem',
            fontWeight: 'var(--sys-type-weight-medium)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
        },
    },

    // M3 Component Overrides
    components: {
        // Card: Use M3 Pebble shape with elevation
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--sys-shape-pebble)',
                    backgroundColor: 'var(--sys-color-surface-container)',
                    boxShadow: 'var(--sys-elevation-level1)',
                    border: '1px solid var(--sys-color-outline-variant)',
                    transition: 'all var(--sys-motion-duration-medium-1) var(--sys-motion-easing-expressive-spring)',
                    '&:hover': {
                        boxShadow: 'var(--sys-elevation-level2)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },

        // Button: M3 filled/outlined/text variants
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--sys-shape-corner-full)',
                    padding: '12px 24px',
                    fontWeight: 'var(--sys-type-weight-medium)',
                    transition: 'all var(--sys-motion-duration-medium-1) var(--sys-motion-easing-expressive-spring)',
                    '&:hover': {
                        transform: 'scale(1.02)',
                    },
                },
                contained: {
                    boxShadow: 'var(--sys-elevation-level1)',
                    '&:hover': {
                        boxShadow: 'var(--sys-elevation-level2)',
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },

        // Chip: M3 pill shape with semantic colors
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--sys-shape-corner-full)',
                    fontFamily: 'var(--sys-type-body-family)',
                    fontWeight: 'var(--sys-type-weight-medium)',
                    transition: 'all var(--sys-motion-duration-short-2) var(--sys-motion-easing-expressive-spring)',
                    '&:hover': {
                        filter: 'brightness(1.1)',
                        transform: 'scale(1.02)',
                    },
                },
                colorPrimary: {
                    backgroundColor: 'var(--sys-color-primary-container)',
                    color: 'var(--sys-color-on-primary-container)',
                },
                colorSecondary: {
                    backgroundColor: 'var(--sys-color-secondary-container)',
                    color: 'var(--sys-color-on-secondary-container)',
                },
                colorError: {
                    backgroundColor: 'var(--sys-color-error-container)',
                    color: 'var(--sys-color-on-error-container)',
                },
                colorWarning: {
                    backgroundColor: 'var(--sys-color-warning-container)',
                    color: 'var(--sys-color-on-warning-container)',
                },
            },
        },

        // Dialog: M3 Tech shape with elevation
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 'var(--sys-shape-tech)',
                    backgroundColor: 'var(--sys-color-surface-container-high)',
                    boxShadow: 'var(--sys-elevation-level4)',
                },
            },
        },

        // Paper: Base surface
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--sys-color-surface-container)',
                    backgroundImage: 'none', // Disable MUI default gradient
                },
                elevation1: {
                    boxShadow: 'var(--sys-elevation-level1)',
                },
                elevation2: {
                    boxShadow: 'var(--sys-elevation-level2)',
                },
                elevation3: {
                    boxShadow: 'var(--sys-elevation-level3)',
                },
                elevation4: {
                    boxShadow: 'var(--sys-elevation-level4)',
                },
            },
        },

        // TextField: M3 filled/outlined variants
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 'var(--sys-shape-corner-medium)',
                        '& fieldset': {
                            borderColor: 'var(--sys-color-outline-variant)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'var(--sys-color-outline)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'var(--sys-color-primary)',
                        },
                    },
                },
            },
        },

        // Alert: M3 semantic colors
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--sys-shape-pebble)',
                },
                standardError: {
                    backgroundColor: 'var(--sys-color-error-container)',
                    color: 'var(--sys-color-on-error-container)',
                },
                standardWarning: {
                    backgroundColor: 'var(--sys-color-warning-container)',
                    color: 'var(--sys-color-on-warning-container)',
                },
                standardInfo: {
                    backgroundColor: 'var(--sys-color-primary-container)',
                    color: 'var(--sys-color-on-primary-container)',
                },
                standardSuccess: {
                    backgroundColor: 'var(--sys-color-secondary-container)',
                    color: 'var(--sys-color-on-secondary-container)',
                },
            },
        },
    },
};

export const m3Theme = createTheme(themeOptions);

// Export individual theme sections for composition
export const m3Palette = themeOptions.palette;
export const m3Typography = themeOptions.typography;
export const m3Components = themeOptions.components;
