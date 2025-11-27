import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * ELECTRIC ALCHEMIST: MASTER THEME CONTROLLER
 * System Version: 4.3 (Migration Mode)
 * * CORE ARCHITECTURE:
 * 1. Bridge: Connects MUI components to `variables.css` tokens.
 * 2. Physics: Enforces "Solid State" rules (No shadows, Tactile interactions).
 * 3. Migration: isolates legacy M2 styles in a `deprecated` namespace.
 */

// --- 1. MODULE AUGMENTATION (Type Safety) ---
// This teaches TypeScript about our custom "Quarantine Zone"
declare module '@mui/material/styles' {
  interface Theme {
    deprecated: {
      success: string;
      warning: string;
      softShadow: string;
    };
  }
  interface ThemeOptions {
    deprecated?: {
      success?: string;
      warning?: string;
      softShadow?: string;
    };
  }
}

// --- 2. THEME CONFIGURATION ---
const themeOptions: ThemeOptions = {
  // ========================================================================
  // COLOR PALETTE (Mapped to CSS Variables)
  // ========================================================================
  palette: {
    mode: 'dark',
    
    /** PRIMARY: LAVENDER (#D0BCFF) */
    primary: {
      main: 'var(--sys-primary)',
      light: 'var(--sys-primary-container)',
      contrastText: 'var(--sys-on-primary-container)',
    },

    /** SECONDARY: LILAC (#9D88D4) */
    secondary: {
      main: 'var(--sys-secondary)',
      contrastText: 'var(--sys-on-secondary)',
    },

    /** ERROR: CORAL PINK (#FF6B9D) */
    error: {
      main: 'var(--sys-error)',
      contrastText: 'var(--sys-on-error)',
    },

    /** BACKGROUND LAYERS */
    background: {
      /** THE VOID: Deepest layer (#141218) */
      default: 'var(--sys-surface)',
      /** THE FLOOR: Card layer (#1D1B20) */
      paper: 'var(--sys-surface-low)',
    },

    text: {
      primary: 'var(--sys-primary)',
      secondary: 'var(--sys-secondary)',
      disabled: 'var(--sys-disabled-text)',
    },

    divider: 'var(--sys-outline-variant)',
  },

  // ========================================================================
  // THE QUARANTINE ZONE (Legacy Support)
  // Use these ONLY if you cannot migrate a component yet.
  // ========================================================================
  deprecated: {
    success: '#4caf50', // Old M2 Green
    warning: '#ff9800', // Old M2 Orange
    softShadow: '0px 4px 20px rgba(0,0,0,0.1)', // The "Glass" look (Scheduled for removal)
  },

  // ========================================================================
  // TYPOGRAPHY (Hybrid Mapping)
  // Maps both Semantic M3 names AND Legacy M2 names to new tokens.
  // ========================================================================
  typography: {
    fontFamily: 'var(--font-ai)', // Default to Machine Voice

    // TIER 2: HERO (The Architect)
    h1: { fontFamily: 'var(--font-hero)', fontSize: 'var(--text-display-lg)', textTransform: 'uppercase' },
    h2: { fontFamily: 'var(--font-hero)', fontSize: 'var(--text-display-md)', textTransform: 'uppercase' },
    h3: { fontFamily: 'var(--font-hero)', fontSize: 'var(--text-display-sm)', textTransform: 'uppercase' },
    h4: { fontFamily: 'var(--font-hero)', fontSize: 'var(--text-headline-lg)' },

    // TIER 3: HUMAN (The Voice)
    h5: { fontFamily: 'var(--font-human)', fontSize: 'var(--text-headline-md)' },
    h6: { fontFamily: 'var(--font-human)', fontSize: 'var(--text-headline-md)' },
    body1: { fontFamily: 'var(--font-human)', fontSize: 'var(--text-body-md)', lineHeight: 1.6 },
    
    // TIER 3: AI (The Machine)
    body2: { fontFamily: 'var(--font-ai)', fontSize: 'var(--text-body-sm)' },
    button: { fontFamily: 'var(--font-ai)', fontWeight: 600, letterSpacing: '0.05em' },
    
    // TIER 4: DATA (The Log)
    caption: { fontFamily: 'var(--
