// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';
import tokens from './src/design/tokens/tokens.json';

/**
 * Safely extract token values from DTCG-formatted tokens.json
 * Handles both legacy (value) and DTCG ($value) formats
 * Returns primitive values for Tailwind consumption
 */
function getValue(path: string): string {
  const keys = path.split('.');
  let current: any = tokens;

  for (const key of keys) {
    if (!current || typeof current !== 'object') {
      return path.includes('color') ? 'transparent' : '0';
    }
    current = current[key];
  }

  if (!current) return path.includes('color') ? 'transparent' : '0';

  let val: any = current;
  if (typeof current === 'object') {
    if ('$value' in current) val = current.$value;
    else if ('value' in current) val = current.value;
    else return path.includes('color') ? 'transparent' : '0';
  }

  return String(val);
}

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      // ============================================
      // COLORS - Northcote Curio Palette
      // ============================================
      colors: {
        // Surfaces - Shared
        'specimen-night': getValue('color.semantic.specimen-night'),

        // Surfaces - Gallery Mode
        // Note: Mapping closest available semantic tokens since exact gallery/lab split
        // structure might differ in the JSON source. Using robust fallbacks.
        'charcoal-bark': getValue('color.semantic.specimen-night'), // Fallback map
        'eucalypt-smoke': getValue('color.families.eucalypt-smoke.base'),
        'eucalypt-smoke-high': getValue('color.families.eucalypt-smoke.light'),
        'eucalypt-smoke-highest': getValue('color.families.eucalypt-smoke.lightest'),

        // Surfaces - Laboratory Mode
        'charcoal-slate': '#16141A', // Retaining specific hex if not in token.json
        'slate-smoke': '#252230',
        'slate-smoke-high': '#32303D',
        'slate-smoke-highest': '#3F3D4A',

        // Primary - Wattle Gold
        'wattle-shadow': getValue('color.families.wattle-gold.darkest'),
        'wattle-gold': getValue('color.semantic.wattle-gold'),
        'wattle-glow': getValue('color.families.wattle-gold.light'),
        'wattle-bloom': getValue('color.families.wattle-gold.lightest'),
        'wattle-gold-container': 'rgba(212, 168, 75, 0.12)', // Hardcoded transparency until utility available
        'on-primary': '#1D3314',

        // Tertiary - Waratah Crimson
        'waratah-stem': getValue('color.families.waratah-crimson.darkest'),
        'waratah-crimson': getValue('color.semantic.waratah-crimson'),
        'waratah-glow': getValue('color.families.waratah-crimson.light'),
        'waratah-bloom': getValue('color.families.waratah-crimson.lightest'),
        'waratah-container': 'rgba(196, 92, 75, 0.15)',

        // Status Colors (Hardcoded fallbacks if completely missing from token.json)
        'ghost-gum': '#7A9E82',
        'ghost-gum-container': 'rgba(122, 158, 130, 0.15)',
        'native-violet': '#9B8AAD',
        'native-violet-container': 'rgba(155, 138, 173, 0.15)',
        'banksia-orange': '#D4885C',
        'banksia-container': 'rgba(212, 136, 92, 0.15)',

        'clinical-sage': '#6B9E7A',
        'clinical-sage-container': 'rgba(107, 158, 122, 0.12)',
        'clinical-alert': '#B85450',
        'clinical-alert-container': 'rgba(184, 84, 80, 0.12)',
        'clinical-neutral': '#8A8895',
        'clinical-neutral-container': 'rgba(138, 136, 149, 0.1)',

        // Secondary - Flannel Flower
        'flannel-flower': getValue('color.semantic.flannel-flower'),
        'flannel-dim': getValue('color.families.flannel-flower.dark'),
        'flannel-faint': getValue('color.families.flannel-flower.darkest'),

        // On Surface - Parchment
        parchment: getValue('color.semantic.parchment'),
        'parchment-dim': '#D9D4CC',
        'parchment-aged': '#C4BFB5',

        // Etching
        'etching-line': 'rgba(212, 190, 150, 0.15)',
        'etching-line-strong': 'rgba(212, 190, 150, 0.25)',
        'etching-fill': 'rgba(212, 190, 150, 0.05)',
        'annotation-ink': '#A89F8C',

        // Glassmorphism
        'glass-gallery-surface': 'rgba(20, 18, 16, 0.70)',
        'glass-gallery-surface-elevated': 'rgba(20, 18, 16, 0.85)',
        'glass-gallery-border': 'rgba(255, 255, 255, 0.08)',

        'glass-lab-surface': 'rgba(245, 242, 235, 0.90)',
        'glass-lab-surface-elevated': 'rgba(255, 255, 255, 0.60)',
        'glass-lab-border': 'rgba(44, 39, 35, 0.08)',
      },

      // ============================================
      // TYPOGRAPHY - Federation Stack
      // ============================================
      fontFamily: {
        // The Bloom - Fraunces variable serif
        display: (getValue('typography.fontFamily.bloom') || '').replace(/'/g, '').split(', '),

        // The Proclamation - Libre Bodoni
        proclamation: (getValue('typography.fontFamily.proclamation') || '')
          .replace(/'/g, '')
          .split(', '),

        // The Field Note - Work Sans
        body: (getValue('typography.fontFamily.field-note') || '').replace(/'/g, '').split(', '),

        // The Annotation - JetBrains Mono
        mono: (getValue('typography.fontFamily.annotation') || '').replace(/'/g, '').split(', '),

        // Fallbacks for compatibility
        curator: ['Caveat', 'cursive'],
        bloom: (getValue('typography.fontFamily.bloom') || '').replace(/'/g, '').split(', '),
        'field-note': (getValue('typography.fontFamily.field-note') || '')
          .replace(/'/g, '')
          .split(', '),
        annotation: (getValue('typography.fontFamily.annotation') || '')
          .replace(/'/g, '')
          .split(', '),
      },

      fontSize: {
        // Direct Mappings if available in new token file, otherwise using fixed scale
        // Note: The new token file uses 'typography.axes' but not detailed Scale/Size map yet
        // defaulting to values from previous config for stability unless verified in token.json
        'display-lg-gallery': [
          '48px',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-lg-lab': [
          '48px',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-sm-gallery': [
          '32px',
          { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' },
        ],
        'display-sm-lab': ['32px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
        headline: ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        title: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        'mono-data': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'mono-annotation': [
          '10px',
          { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.1em' },
        ],
        hero: ['72px', { lineHeight: '1.0', fontWeight: '700', letterSpacing: '-0.02em' }],
        metric: ['48px', { lineHeight: '1.0', fontWeight: '100', letterSpacing: '-0.03em' }],
      },

      // ============================================
      // SPACING
      // ============================================
      spacing: {
        0: '0px',
        0.5: getValue('spacing.xs'),
        1: getValue('spacing.xs'),
        2: getValue('spacing.sm'),
        3: getValue('spacing.md'),
        4: getValue('spacing.lg'),
        5: '20px',
        6: getValue('spacing.xl'),
        8: getValue('spacing.xxl'),
        10: '40px',
        12: getValue('spacing.xxxl'),
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        pebble: getValue('radius.pebble'),
        stone: getValue('radius.stone'),
        leaf: getValue('radius.leaf'),
        petal: '12px 4px 16px 8px', // Fallback
        seed: getValue('radius.seed'),
      },

      // ============================================
      // BOX SHADOW
      // ============================================
      boxShadow: {
        rest: getValue('shadow.rest'),
        hover: getValue('shadow.hover'),
        'glow-gold': getValue('shadow.glow-gold'),
      },

      // ============================================
      // TRANSITIONS
      // ============================================
      transitionTimingFunction: {
        viscous: getValue('motion.easing.viscous-breeze'),
        settle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        precise: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snap: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        micro: '180ms',
        short: getValue('motion.duration.fast'),
        medium: getValue('motion.duration.standard'),
        long: getValue('motion.duration.slow'),
      },

      // ============================================
      // ANIMATION
      // ============================================
      keyframes: {
        'typography-bloom': {
          from: {
            fontVariationSettings: "'wght' 600, 'SOFT' 50, 'WONK' 1",
          },
          to: {
            fontVariationSettings: "'wght' 750, 'SOFT' 80, 'WONK' 1",
          },
        },
        'card-hover': {
          from: {
            transform: 'translateY(0)',
          },
          to: {
            transform: 'translateY(-4px)',
          },
        },
      },

      animation: {
        bloom: 'typography-bloom 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'card-lift': 'card-hover 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ============================================
      // BACKGROUND IMAGE
      // ============================================
      backgroundImage: {
        // Fallbacks as texture paths might need adjustment
        'gallery-texture': 'url("/assets/textures/wallpaper.png")',
        'lab-texture': 'url("/assets/textures/paper-grain.png")',
        'grid-major': 'url("/assets/textures/grid-major.png")',
        'grid-minor': 'url("/assets/textures/grid-minor.png")',
      },
    },
  },
  plugins: [],
};

export default config;
