/**
 * ELECTRIC ALCHEMIST: TAILWIND CONFIGURATION
 * Version: 4.2
 *
 * Consumes design tokens from tokens.json and creates
 * custom utility classes for the Poly-Body typography system.
 */

const tokens = require('./src/theme/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ========================================================================
         COLORS (The Alchemist Palette)
         ======================================================================== */
      colors: {
        // Primary system
        primary: {
          DEFAULT: tokens.colors.primary.DEFAULT,
          container: tokens.colors.primary.container,
          'on-container': tokens.colors.primary.onContainer,
        },
        // Tertiary system
        tertiary: {
          DEFAULT: tokens.colors.tertiary.DEFAULT,
          container: tokens.colors.tertiary.container,
          on: tokens.colors.tertiary.on,
        },
        // Surface system (Deep Violet Void)
        surface: {
          DEFAULT: tokens.colors.surface.DEFAULT,
          'container-low': tokens.colors.surface.containerLow,
          container: tokens.colors.surface.container,
          'container-high': tokens.colors.surface.containerHigh,
        },
        // Outline system
        outline: {
          DEFAULT: tokens.colors.outline.DEFAULT,
          variant: tokens.colors.outline.variant,
        },
        // Seed color
        seed: {
          shadow: tokens.colors.seed.shadow,
        },
      },

      /* ========================================================================
         TYPOGRAPHY (Font Families)
         ======================================================================== */
      fontFamily: {
        hologram: [tokens.typography.families.hologram, 'display'],
        hero: [tokens.typography.families.hero, 'sans-serif'],
        human: [tokens.typography.families.human, 'serif'],
        ai: [tokens.typography.families.ai, 'sans-serif'],
        data: [tokens.typography.families.data, 'sans-serif'],
      },

      /* ========================================================================
         BORDER RADIUS (Shape System)
         ======================================================================== */
      borderRadius: {
        card: tokens.shape.radius.card,
        button: tokens.shape.radius.button,
        badge: tokens.shape.radius.badge,
      },

      /* ========================================================================
         SPACING (Grid System)
         ======================================================================== */
      spacing: {
        'grid': tokens.spacing.grid,
        'card-padding': tokens.spacing.cardPadding,
        'card-padding-top': tokens.spacing.cardPaddingTop,
      },

      /* ========================================================================
         Z-INDEX (Elevation System)
         ======================================================================== */
      zIndex: {
        base: tokens.elevation.zIndex.base,
        'pop-out': tokens.elevation.zIndex.popOut,
        modal: tokens.elevation.zIndex.modal,
      },

      /* ========================================================================
         CUSTOM UTILITIES (Via Plugin)
         ======================================================================== */
      // Handled in plugins section below
    },
  },

  plugins: [
    /* ==========================================================================
       CUSTOM PLUGIN: Poly-Body Typography Utilities
       ========================================================================== */
    function ({ addUtilities }) {
      const newUtilities = {
        // TIER 1: Hologram
        '.text-hologram': {
          fontFamily: `${tokens.typography.families.hologram}, display`,
          fontSize: '3rem',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          fontPalette: '--electric-palette',
        },

        // TIER 2: Hero (Architectural)
        '.text-hero': {
          fontFamily: `${tokens.typography.families.hero}, sans-serif`,
          fontVariationSettings: `'wdth' ${tokens.typography.axes.hero.wdth}, 'wght' ${tokens.typography.axes.hero.wght}, 'YTUC' ${tokens.typography.axes.hero.YTUC}, 'XTRA' ${tokens.typography.axes.hero.XTRA}, 'GRAD' ${tokens.typography.axes.hero.GRAD}`,
          fontSize: '2.5rem',
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
        },

        // TIER 3: Voice - Human
        '.text-human': {
          fontFamily: `${tokens.typography.families.human}, serif`,
          fontVariationSettings: `'wdth' ${tokens.typography.axes.human.wdth}, 'wght' ${tokens.typography.axes.human.wght}, 'opsz' ${tokens.typography.axes.human.opsz}, 'GRAD' ${tokens.typography.axes.human.GRAD}`,
          fontSize: '1rem',
          lineHeight: '1.6',
          letterSpacing: '0',
        },

        // TIER 3: Voice - AI
        '.text-ai': {
          fontFamily: `${tokens.typography.families.ai}, sans-serif`,
          fontVariationSettings: `'wdth' ${tokens.typography.axes.ai.wdth}, 'wght' ${tokens.typography.axes.ai.wght}, 'opsz' ${tokens.typography.axes.ai.opsz}, 'GRAD' ${tokens.typography.axes.ai.GRAD}`,
          fontSize: '0.875rem',
          lineHeight: '1.5',
          letterSpacing: '0.01em',
        },

        // TIER 4: Data (Lo-Fi System)
        '.text-data': {
          fontFamily: `${tokens.typography.families.data}, sans-serif`,
          fontVariationSettings: `'wdth' ${tokens.typography.axes.data.wdth}, 'wght' ${tokens.typography.axes.data.wght}, 'opsz' ${tokens.typography.axes.data.opsz}, 'GRAD' ${tokens.typography.axes.data.GRAD}`,
          fontSize: '0.75rem',
          lineHeight: '1.4',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'font-variation-settings 0s',
        },

        // Data Glitch Hover
        '.text-data:hover': {
          fontVariationSettings: `'wdth' ${tokens.typography.axes.data.wdth}, 'wght' ${tokens.typography.interactions.dataGlitch.hover}, 'opsz' ${tokens.typography.axes.data.opsz}, 'GRAD' ${tokens.typography.axes.data.GRAD}`,
        },

        // Irregularity classes
        '.text-hero-irregular': {
          transform: 'rotate(-1deg)',
        },
        '.text-hero-irregular-alt': {
          transform: 'rotate(1deg)',
        },

        // Tactile Press Animation (for motion.div wrapper)
        '.tactile-press': {
          cursor: 'pointer',
          transition: 'transform 150ms ease-out',
        },

        // Dot Grid Background
        '.bg-dot-grid': {
          backgroundColor: tokens.colors.surface.DEFAULT,
          backgroundImage: `radial-gradient(${tokens.texture.dotGrid.color} ${tokens.texture.dotGrid.dotSize}, transparent ${tokens.texture.dotGrid.dotSize})`,
          backgroundSize: `${tokens.texture.dotGrid.spacing} ${tokens.texture.dotGrid.spacing}`,
        },

        // Noise Overlay
        '.noise-overlay': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            opacity: tokens.texture.noise.opacity,
            mixBlendMode: tokens.texture.noise.blendMode,
            pointerEvents: 'none',
          },
        },

        // Asymmetric Radius (Sidebar anchoring)
        '.radius-asymmetric': {
          borderRadius: tokens.shape.radius.asymmetric,
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
