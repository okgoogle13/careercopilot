import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
// @ts-ignore - Importing JS in TS
import m3Patch from './tailwind-m3-patch.ts';

const config: Config = {
  darkMode: 'class',
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
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ...(m3Patch?.theme?.extend?.colors || {}),
        // Lab Wren Metal Blue - Ripples & accents
        'lab-wren-metal-blue': 'var(--sys-color-labWrenMetalBlue-base)',

        // Semantic Mappings (Kerala Rage KrSolidarity)
        border: 'var(--color-concrete-grey)',
        input: 'var(--color-concrete-grey)',
        ring: 'var(--color-ink-gold)',
        background: 'var(--color-asphalt-black)',
        foreground: 'var(--color-paper-white)',

        primary: {
          DEFAULT: 'var(--color-ink-gold)',
          foreground: 'var(--color-asphalt-black)',
          container: 'var(--sys-color-inkGold-container)',
        },
        secondary: {
          DEFAULT: 'var(--color-concrete-grey)',
          foreground: 'var(--color-asphalt-black)',
        },
        destructive: {
          DEFAULT: 'var(--color-solidarity-red)',
          foreground: 'var(--color-paper-white)',
        },
        muted: {
          DEFAULT: 'var(--color-concrete-grey-dark)',
          foreground: 'var(--color-concrete-grey-lightest)',
        },
        accent: {
          DEFAULT: 'var(--color-solidarity-red)',
          foreground: 'var(--color-paper-white)',
        },
        popover: {
          DEFAULT: 'var(--color-asphalt-black-light)',
          foreground: 'var(--color-paper-white)',
        },
        card: {
          DEFAULT: 'var(--color-asphalt-black)',
          foreground: 'var(--color-paper-white)',
        },
      },
      fontSize: {
        'display-hero': [
          '120px',
          { lineHeight: '1.0', fontWeight: '100', letterSpacing: '-0.04em' },
        ],
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
        'label-lg': ['14px', { lineHeight: '1.4', fontWeight: '650', letterSpacing: '0.1px' }],
        'label-md': ['12px', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.5px' }],
        'label-sm': ['11px', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.5px' }],
      },
      fontFamily: {
        ...(m3Patch?.theme?.extend?.fontFamily || {}),
        proclamation: ['"kr-serif-bold"', '"Playfair Display"', ...defaultTheme.fontFamily.serif],
        bloom: ['"Fraunces"', ...defaultTheme.fontFamily.serif],
        'field-note': ['"Work Sans"', ...defaultTheme.fontFamily.sans],
        annotation: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        curator: ['"Caveat"', 'cursive'],
      },
      borderRadius: {
        // ─── v6.1 Archetype Aliases (use these in new code) ─────────────
        // Replace rounded-2xl → rounded-placard, rounded-xl → rounded-strike, etc.
        strike: 'var(--shape-archetype-strike)', // = blockRiot03: 32px 2px 2px 2px
        march: 'var(--shape-archetype-march)', // = pillMarch01:  9999px
        scaffold: 'var(--shape-archetype-scaffold)', // = scaffoldSlab01: 8px 2px 8px 2px
        placard: 'var(--shape-archetype-placard)', // = placardTorn01: 48% 52% 58% organic
        megaphone: 'var(--shape-archetype-megaphone)', // = megaphoneCut01: 42% 58% 45% organic
        substrate: 'var(--shape-archetype-substrate)', // = substrateTile02: 40% 60% 70%
        // Radius scale aliases
        shard: 'var(--shape-alertShard01)', // 32px 2px 2px 32px — error/selected
        sentry: 'var(--shape-sentryAvatar)', // 98% — avatar imperfect circle
        full: '9999px',
        // ─── DEPRECATED (v6.0 compat — use archetype aliases above) ─────
        pebble: 'var(--shape-pebbleSurge01)',
        stone: 'var(--shape-megaphoneCut01)',
        slab: 'var(--shape-placardTorn01)',
        tech: 'var(--shape-placardTorn01)',
        gem: 'var(--shape-pebbleSurge01)',
      },
      boxShadow: {
        rest: 'var(--shadow-rest)',
        hover: 'var(--shadow-hover)',
        'glow-gold': 'var(--shadow-glow-gold)',
      },
      keyframes: {
        'typography-bloom': {
          from: { fontVariationSettings: "'wght' 600, 'SOFT' 50, 'WONK' 1" },
          to: { fontVariationSettings: "'wght' 750, 'SOFT' 80, 'WONK' 1" },
        },
        'card-lift': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-4px)' },
        },
        'button-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'button-press': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      backgroundImage: {
        'texture-gouache': "url('/textures/gouache-grain-warm.png')",
        'kr-dark-gradient':
          'radial-gradient(ellipse 60% 50% at 85% 15%, rgba(212, 168, 75, 0.08) 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 20% 60%, rgba(196, 92, 75, 0.05) 0%, transparent 40%)',
      },
    },
  },
  plugins: [
    // Variable Font Axis Support (M3 Expressive)
    function ({ matchUtilities, theme }: { matchUtilities: any; theme: any }) {
      matchUtilities(
        {
          'font-soft': (value: string) => ({ fontVariationSettings: `'SOFT' ${value}` }),
          'font-wonk': (value: string) => ({ fontVariationSettings: `'WONK' ${value}` }),
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
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.focus-ring': {
          '@apply': 'outline-none ring-2 ring-offset-2 ring-primary',
        },
        '.focus-ring-offset-0': {
          '@apply': 'outline-none ring-2 ring-offset-0 ring-primary',
        },
      });
    },
  ],
};

export default config;
