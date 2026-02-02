/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import tokens from './src/theme/tokens.json';

// Helper to safely access tokens
const t = tokens.color.semantic;

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ═══════════════════════════════════════════════════════════════════════
      // THE FEDERATION TYPOGRAPHY STACK
      // ═══════════════════════════════════════════════════════════════════════
      fontFamily: {
        proclamation: ['"Libre Bodoni"', '"Playfair Display"', ...defaultTheme.fontFamily.serif],
        bloom: ['"Fraunces"', ...defaultTheme.fontFamily.serif],
        'field-note': ['"Work Sans"', ...defaultTheme.fontFamily.sans],
        annotation: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        curator: ['"Caveat"', 'cursive'],
      },

      // ═══════════════════════════════════════════════════════════════════════
      // MOONLIGHT ON VELVET PALETTE
      // ═══════════════════════════════════════════════════════════════════════
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Use Specimen Night as the global floor
        black: t.surface.shared.specimenNight.value,
        white: t.onSurface.parchment.value, // Parchment instead of white

        // Core Botanic Families
        'specimen-night': t.surface.shared.specimenNight.value,
        'specimen-night-light': t.surface.shared.specimenNightLight && t.surface.shared.specimenNightLight.value || '#2C2925',

        wattle: {
          vault: t.primary.wattleShadow.value, // Fallback
          shadow: t.primary.wattleShadow.value,
          gold: t.primary.wattleGold.value,
          glow: t.primary.wattleGlow.value,
          bloom: t.primary.wattleBloom.value,
          container: t.primary.wattleGoldContainer.value,
        },
        'wattle-gold': t.primary.wattleGold.value,

        waratah: {
          stem: t.tertiary.waratahStem.value,
          root: t.tertiary.waratahStem.value, // Fallback
          crimson: t.tertiary.waratahCrimson.value,
          glow: t.tertiary.waratahGlow.value,
          bloom: t.tertiary.waratahBloom.value,
          container: t.tertiary.waratahContainer.value,
        },
        'waratah-crimson': t.tertiary.waratahCrimson.value,

        eucalypt: {
          night: t.surface.shared.specimenNight.value,
          ash: t.surface.gallery.charcoalBark.value,
          smoke: t.surface.gallery.eucalyptSmoke.value,
          dusk: t.surface.gallery.eucalyptSmokeHigh.value,
          mist: t.surface.gallery.eucalyptSmokeHighest.value,
        },

        flannel: {
          deep: t.secondary.flannelDim.value,
          medium: t.secondary.flannelDim.value,
          flower: t.secondary.flannelFlower.value,
          light: t.secondary.flannelFaint.value,
          bloom: t.secondary.flannelFaint.value,
        },
        'flannel-flower': t.secondary.flannelFlower.value,

        parchment: t.onSurface.parchment.value,

        // Semantic Semantic (Legacy/Functional) support
        semantic: {
          success: t.status.gallery.ghostGum.value,
          warning: t.status.gallery.banksiaOrange.value,
          info: t.status.gallery.nativeViolet.value,
        },

        // Shadcn UI Mapping (Retaining for component compatibility)
        primary: {
          DEFAULT: t.primary.wattleGold.value,
          foreground: t.surface.shared.specimenNight.value,
          container: t.primary.wattleGoldContainer.value,
        },
        secondary: {
          DEFAULT: t.secondary.flannelFlower.value,
          foreground: t.surface.shared.specimenNight.value,
        },
        destructive: {
          DEFAULT: t.tertiary.waratahCrimson.value,
          foreground: t.onSurface.parchment.value,
        },
        muted: {
          DEFAULT: t.surface.gallery.eucalyptSmoke.value,
          foreground: t.secondary.flannelFlower.value,
        },
        accent: {
          DEFAULT: t.tertiary.waratahCrimson.value,
          foreground: t.onSurface.parchment.value,
        },
        popover: {
          DEFAULT: t.surface.gallery.eucalyptSmokeHigh.value,
          foreground: t.onSurface.parchment.value,
        },
        card: {
          DEFAULT: t.surface.gallery.eucalyptSmoke.value,
          foreground: t.onSurface.parchment.value,
        },
      },

      fontSize: {
        'display-hero': ['120px', { lineHeight: '1.0', fontWeight: '100', letterSpacing: '-0.04em' }],
        'display-lg': ['240px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-2px' }],
        'display-md': ['160px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-1px' }],
        'display-sm': ['96px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-lg': ['72px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-md': ['48px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['32px', { lineHeight: '1.4', fontWeight: '600' }],
        'title-lg': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'title-md': ['18px', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.15px' }],
        'title-sm': ['16px', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.1px' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400', letterSpacing: '0.5px' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0.25px' }],
        'body-sm': ['12px', { lineHeight: '1.5', fontWeight: '400', letterSpacing: '0.4px' }],
        'label-lg': ['13px', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }],
        'label-md': ['11px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }],
        'label-sm': ['10px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }],
      },

      // ========================================
      // SPACING SYSTEM: 4px-based consistency
      // ========================================
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        xxxl: '48px',
      },

      // ========================================
      // BORDER RADIUS: Organic Asymmetry
      // ========================================
      borderRadius: {
        pebble: '20px 6px 16px 28px',
        stone: '16px 4px 12px 24px',
        leaf: '24px 8px 20px 4px',
        seed: '8px 4px 10px 6px',
        sentry: '98%',

        // Shadcn fallbacks
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // ========================================
      // SHADOW SYSTEM: Ink Pools & Glows
      // ========================================
      boxShadow: {
        none: 'none',
        subtle: '0 2px 8px rgba(0, 0, 0, 0.15)',
        standard: '0 4px 16px rgba(0, 0, 0, 0.25)',
        elevated: '0 12px 32px rgba(0, 0, 0, 0.35)',
        maximum: '0 20px 48px rgba(0, 0, 0, 0.45)',

        'wattle-glow': '0 0 0 24px rgba(212, 168, 75, 0.2)',
        'wattle-glow-sm': '0 0 0 12px rgba(212, 168, 75, 0.15)',
        'waratah-glow': '0 0 0 24px rgba(196, 92, 75, 0.2)',

        'focus-ring': '0 0 0 4px rgba(212, 168, 75, 0.5)',
      },

      // ========================================
      // ANIMATION & MOTION: Viscous Breeze Physics
      // ========================================
      transitionTimingFunction: {
        'viscous-breeze': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        reveal: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snap: 'cubic-bezier(0.2, 0, 0, 1)',

        // Aliases
        viscous: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        standard: '300ms',
        slow: '600ms',
      },
      animation: {
        bloom: 'bloom 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bloom-lift': 'bloomLift 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bloom-glow': 'bloomGlow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 100ms forwards',
        'bloom-typography': 'bloomTypography 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms forwards',
        unfold: 'unfold 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        shimmer: 'shimmer 2000ms linear infinite',
        pulse: 'pulse 2000ms cubic-bezier(0.4, 0, 0.6, 1) infinite',
        press: 'press 150ms cubic-bezier(0.2, 0, 0, 1) forwards',

        // Shadcn Accordion
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        bloom: {
          '0%': { transform: 'translateY(0px)', opacity: '1', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' },
          '100%': { transform: 'translateY(-12px)', opacity: '1', boxShadow: '0 0 0 24px rgba(212, 168, 75, 0.2), 0 4px 16px rgba(0, 0, 0, 0.25)' },
        },
        bloomLift: {
          '0%': { transform: 'translateY(0px)', opacity: '1' },
          '100%': { transform: 'translateY(-12px)', opacity: '1' },
        },
        bloomGlow: {
          '0%': { boxShadow: '0 0 0 0px rgba(212, 168, 75, 0.2)' },
          '100%': { boxShadow: '0 0 0 24px rgba(212, 168, 75, 0.2)' },
        },
        bloomTypography: {
          '0%': { fontWeight: '600', letterSpacing: '0px' },
          '100%': { fontWeight: '700', letterSpacing: '0.5px' },
        },
        unfold: {
          '0%': { maxHeight: '0px', opacity: '0', paddingTop: '0px' },
          '100%': { maxHeight: '600px', opacity: '1', paddingTop: '24px' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        press: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(0.98)' },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      backgroundImage: {
        'texture-gouache': "url('/textures/gouache-grain-warm.png')",
        'gallery-gradient': "radial-gradient(ellipse 60% 50% at 85% 15%, rgba(212, 168, 75, 0.08) 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 20% 60%, rgba(196, 92, 75, 0.05) 0%, transparent 40%)",
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Variable Font Axis Support (M3 Expressive)
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'font-soft': (value) => ({ fontVariationSettings: `'SOFT' ${value}` }),
          'font-wonk': (value) => ({ fontVariationSettings: `'WONK' ${value}` }),
        },
        { values: theme('spacing') }
      );

      // Explicit Wonk Scales
      matchUtilities({
        'font-wonk-fine': () => ({ fontVariationSettings: `'WONK' 0` }),
        'font-wonk-subtle': () => ({ fontVariationSettings: `'WONK' 0.3` }),
        'font-wonk-medium': () => ({ fontVariationSettings: `'WONK' 0.5` }),
        'font-wonk-active': () => ({ fontVariationSettings: `'WONK' 0.7` }),
        'font-wonk-full': () => ({ fontVariationSettings: `'WONK' 1` }),
      });
    },
    // Focus Ring Utility
    function ({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          '@apply': 'outline-none ring-2 ring-offset-2 ring-wattle-gold',
        },
        '.focus-ring-offset-0': {
          '@apply': 'outline-none ring-2 ring-offset-0 ring-wattle-gold',
        },
      });
    }
  ],
}
