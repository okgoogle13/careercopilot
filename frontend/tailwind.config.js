const tokens = require('../design-system/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* --- COLORS --- */
      colors: {
        primary: {
          DEFAULT: tokens.color.primary.DEFAULT,
          container: tokens.color.primary.container,
          'on-container': tokens.color.primary.onContainer,
        },
        secondary: {
          DEFAULT: tokens.color.secondary.DEFAULT,
          container: tokens.color.secondary.container,
          on: tokens.color.secondary.on,
        },
        tertiary: {
          DEFAULT: tokens.color.tertiary.DEFAULT,
          container: tokens.color.tertiary.container,
          on: tokens.color.tertiary.on,
        },
        error: {
          DEFAULT: tokens.color.error.DEFAULT,
          container: tokens.color.error.container,
          on: tokens.color.error.on,
        },
        surface: {
          DEFAULT: tokens.color.surface.DEFAULT,
          'container-low': tokens.color.surface.containerLow,
          container: tokens.color.surface.container,
          'container-high': tokens.color.surface.containerHigh,
        },
        outline: {
          DEFAULT: tokens.color.outline.DEFAULT,
          variant: tokens.color.outline.variant,
        },
        disabled: {
          text: tokens.color.disabled.text,
          surface: tokens.color.disabled.surface,
        },
        seed: { shadow: tokens.color.seed.shadow },
      },

      /* --- FONT FAMILY UTILITIES (Fallbacks only) --- */
      /* Note: Use .text-hero, .text-data classes from typography.css for full effect */
      fontFamily: {
        hologram: [tokens.typography.families.hologram, 'display'],
        hero: [tokens.typography.families.hero, 'sans-serif'],
        human: [tokens.typography.families.human, 'serif'],
        ai: [tokens.typography.families.ai, 'sans-serif'],
        data: [tokens.typography.families.data, 'monospace'],
      },

      /* --- BREAKPOINTS --- */
      screens: {
        'mobile': tokens.breakpoint.mobile,
        'tablet': tokens.breakpoint.tablet,
        'desktop-sidebar': tokens.breakpoint.desktopSidebar,
      },

      /* --- SHAPE & BORDER --- */
      borderRadius: {
        card: tokens.shape.radius.card,
        button: tokens.shape.radius.button,
        badge: tokens.shape.radius.badge,
        asymmetric: tokens.shape.radius.asymmetric,
      },
      borderWidth: {
        DEFAULT: '1px',
        ...tokens.elevation.borderWidth,
      },

      /* --- SPACING (Base-24) --- */
      spacing: {
        'xs': tokens.spacing.xs,
        'sm': tokens.spacing.sm,
        'md': tokens.spacing.md,
        'base': tokens.spacing.base,
        'lg': tokens.spacing.lg,
        'xl': tokens.spacing.xl,
        '2xl': tokens.spacing['2xl'],
        '3xl': tokens.spacing['3xl'],
        'grid': tokens.spacing.grid,
        'card-padding': tokens.spacing.cardPadding,
        'card-padding-top': tokens.spacing.cardPaddingTop,
      },

      /* --- Z-INDEX --- */
      zIndex: {
        base: tokens.elevation.zIndex.base,
        'pop-out': tokens.elevation.zIndex.popOut,
        scrim: tokens.elevation.zIndex.scrim,
        modal: tokens.elevation.zIndex.modal,
        tooltip: tokens.elevation.zIndex.tooltip,
      },

      /* --- ANIMATION --- */
      animation: {
        'tactile-press': 'tactilePress 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-out': 'popOut 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        tactilePress: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
        },
        popOut: {
          '0%': { transform: 'translateY(0) rotate(0) scale(1)' },
          '100%': { transform: 'translateY(-15px) rotate(5deg) scale(1.1)' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'), // Standard prose plugin
    require('@tailwindcss/forms'),      // Standard forms plugin
    
    /* --- CUSTOM PLUGIN: TEXTURE & FX ONLY --- */
    function ({ addUtilities }) {
      const newUtilities = {
        // Dot Grid Background
        '.bg-dot-grid': {
          backgroundColor: tokens.color.surface.DEFAULT,
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

        // Solid State Scrim (Blur + No Shadow)
        '.scrim-solid': {
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: tokens.elevation.zIndex.scrim,
        },
        
        // Asymmetric Border Radius Utils
        '.radius-asymmetric': {
          borderRadius: tokens.shape.radius.asymmetric,
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
