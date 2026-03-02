// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';
import tokens from './src/design/tokens/tokens.json';
// @ts-ignore
import m3Patch from './tailwind-m3-patch.js';


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
      ...(m3Patch?.theme?.extend || {}),
      // ============================================
      // COLORS - kerala-rage kr-solidarity Palette

      // ============================================
      colors: {
        // ============================================
        // KERALA RAGE SEMANTIC COLORS (--sys-color-*)
        // ============================================

        // Charcoal Background - Foundational canvas
        'charcoal-background': getValue('sys.color.charcoalBackground.base.$value'),

        // Solidarity Red - Primary CTA
        'solidarity-red': getValue('sys.color.solidarityRed.base.$value'),

        // Charcoal Red - Errors & warnings
        'kr-charcoal-red': getValue('sys.color.kr-charcoalRed.base.$value'),
        'clinical-alert': getValue('sys.color.kr-charcoalRed.base.$value'), // Alias for compatibility

        // Activist Smoke Green - Landscape accents
        'activist-smoke-green': getValue('sys.color.kr-activistSmokeGreen.base.$value'),
        'kr-activist-smoke-green': getValue('sys.color.kr-activistSmokeGreen.base.$value'),

        // Signal Green - Accent chips
        'signal-green': getValue('sys.color.signalGreen.base.$value'),

        // Ink Gold - Halo disks
        'ink-gold': getValue('sys.color.inkGold.base.$value'),
        'kr-ink-gold': getValue('sys.color.inkGold.base.$value'),

        // Stencil Yellow - Attention markers
        'stencil-yellow': getValue('sys.color.stencilYellow.base.$value'),

        // Worker Ash - Primary readable text
        'worker-ash': getValue('sys.color.worker-ash.base.$value'),

        // Solidarity Smoke Orange - Portrait warmth
        'solidarity-smoke-orange': getValue('sys.color.solidaritySmokeOrange.base.$value'),

        // Lab Wren Metal Blue - Ripples & accents
        'lab-wren-metal-blue': getValue('sys.color.labWrenMetalBlue.base.$value'),

        // Asphalt Black - Street textures
        'asphalt-black': getValue('sys.color.asphaltBlack.base.$value'),

        // Concrete Grey - Borders & urban textures
        'concrete-grey': getValue('sys.color.concreteGrey.base.$value'),

        // Gum Leaf Green - Flora accents
        'gum-leaf-green': getValue('sys.color.gumLeafGreen.base.$value'),

        // Ochre Earth - Warm earth tones
        'ochre-earth': getValue('sys.color.ochreEarth.base.$value'),

        // Paper White - High-contrast text
        'paper-white': getValue('sys.color.paperWhite.base.$value'),

        // ============================================
        // LEGACY COMPATIBILITY ALIASES
        // ============================================

        // Surfaces (charcoal background variants)
        'charcoal-bark': getValue('sys.color.asphaltBlack.base.$value'),
        'charcoal-slate': '#16141A', // Legacy fallback
        'slate-smoke': '#252230',
        'slate-smoke-high': '#32303D',
        'slate-smoke-highest': '#3F3D4A',

        // Concrete grey variants (from steps)
        'concrete-grey-high': '#C4BDB3', // From concreteGrey steps
        'concrete-grey-highest': '#E0DBD3',
        'flannel-dim': '#7D7669',
        'flannel-faint': '#5C564E',

        // Paper white variants (from steps)
        'paper-white-dim': '#D4CEC3',
        'paper-white-aged': '#B8B0A3',

        // Status Colors (Kerala Rage compatible)
        'ghost-gum': getValue('sys.color.gumLeafGreen.base.$value'), // Use gum leaf
        'ghost-gum-container': 'rgba(107, 127, 110, 0.15)',
        'native-violet': '#9B8AAD', // Legacy (consider removing)
        'native-violet-container': 'rgba(155, 138, 173, 0.15)',
        'kr-flower-orange': getValue('sys.color.solidaritySmokeOrange.base.$value'), // Use smoke orange
        'kr-flower-container': 'rgba(218, 139, 72, 0.15)',

        'clinical-sage': getValue('sys.color.gumLeafGreen.base.$value'),
        'clinical-sage-container': 'rgba(107, 127, 110, 0.12)',
        'clinical-alert-container': 'rgba(241, 72, 68, 0.12)',
        'clinical-neutral': '#8A8895',
        'clinical-neutral-container': 'rgba(138, 136, 149, 0.1)',

        // Etching (Kerala Rage compatible)
        'etching-line': 'rgba(218, 246, 116, 0.15)', // inkGold based
        'etching-line-strong': 'rgba(218, 246, 116, 0.25)',
        'etching-fill': 'rgba(218, 246, 116, 0.05)',
        'annotation-ink': getValue('sys.color.concreteGrey.base.$value'),

        // Glass effects (Kerala Rage charcoal)
        'glass-kr-dark-surface': 'rgba(26, 26, 26, 0.70)',
        'glass-kr-dark-surface-elevated': 'rgba(26, 26, 26, 0.85)',
        'glass-kr-dark-border': 'rgba(255, 255, 255, 0.08)',

        'glass-lab-surface': 'rgba(245, 240, 232, 0.90)',
        'glass-lab-surface-elevated': 'rgba(255, 255, 255, 0.60)',
        'glass-lab-border': 'rgba(44, 39, 35, 0.08)',

        // Aboriginal Flag (restricted use - in-situ only)
        'aboriginal-flag-red': getValue('sys.color.aboriginalFlagRed.base.$value'),
        'aboriginal-flag-yellow': getValue('sys.color.aboriginalFlagYellow.base.$value'),
        'aboriginal-flag-black': getValue('sys.color.aboriginalFlagBlack.base.$value'),
      },

      // ============================================
      // TYPOGRAPHY - Federation Stack
      // ============================================
      fontFamily: {
        // The Bloom - Fraunces variable serif
        display: (getValue('typography.fontFamily.bloom') || '').replace(/'/g, '').split(', '),

        // The Proclamation - kr-serif-bold
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
        nabla: (getValue('typography.fontFamily.colorAccent') || '').replace(/'/g, '').split(', '),
      },

      fontSize: {
        // Direct Mappings if available in new token file, otherwise using fixed scale
        // Note: The new token file uses 'typography.axes' but not detailed Scale/Size map yet
        // defaulting to values from previous config for stability unless verified in token.json
        'display-lg-kr-dark': [
          '48px',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-lg-lab': [
          '48px',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-sm-kr-dark': [
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
        // Updated to Kr-Solidarity standardized assets
        'kr-dark-texture': 'url("/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png")',
        'lab-texture': 'url("/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png")',
        'grid-major': 'url("/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-010__v1.svg")',
        'grid-minor': 'url("/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-008__v1.svg")',
      },
    },
  },
  plugins: [],
};

export default config;
