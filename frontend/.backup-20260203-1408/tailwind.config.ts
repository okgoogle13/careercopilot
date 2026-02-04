import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './index.html'],
  theme: {
    extend: {
      colors: {
        // Semantic surface colors
        'specimen-night': '#1A1714',

        // Gallery mode surfaces
        'charcoal-bark': '#141210',
        'eucalypt-smoke': {
          DEFAULT: '#2C2723',
          high: '#3D3632',
          highest: '#4A433D',
        },

        // Laboratory mode surfaces
        'charcoal-slate': '#16141A',
        'slate-smoke': {
          DEFAULT: '#252230',
          high: '#32303D',
          highest: '#3F3D4A',
        },

        // Primary palette (Wattle Gold)
        'wattle-gold': {
          shadow: '#8B7A35',
          DEFAULT: '#D4A84B',
          glow: '#E8C963',
          bloom: '#F5DDAA',
          container: 'rgba(212, 168, 75, 0.12)',
        },

        // Tertiary palette (Waratah Crimson)
        'waratah-crimson': {
          stem: '#7A3A2E',
          DEFAULT: '#C45C4B',
          glow: '#E07865',
          bloom: '#F5A89A',
          container: 'rgba(196, 92, 75, 0.15)',
        },

        // Status colors - Gallery mode
        'ghost-gum': {
          DEFAULT: '#7A9E82',
          container: 'rgba(122, 158, 130, 0.15)',
        },
        'native-violet': {
          DEFAULT: '#9B8AAD',
          container: 'rgba(155, 138, 173, 0.15)',
        },
        'banksia-orange': {
          DEFAULT: '#D4885C',
          container: 'rgba(212, 136, 92, 0.15)',
        },

        // Status colors - Laboratory mode
        'clinical-sage': {
          DEFAULT: '#6B9E7A',
          container: 'rgba(107, 158, 122, 0.12)',
        },
        'clinical-alert': {
          DEFAULT: '#B85450',
          container: 'rgba(184, 84, 80, 0.12)',
        },
        'clinical-neutral': {
          DEFAULT: '#8A8895',
          container: 'rgba(138, 136, 149, 0.1)',
        },

        // Secondary/Neutral text colors
        'flannel-flower': {
          DEFAULT: '#A8A097',
          dim: '#7D766D',
          faint: '#5A544C',
        },

        // On-surface text colors
        parchment: {
          DEFAULT: '#F5F0E8',
          dim: '#D9D4CC',
          aged: '#C4BFB5',
        },

        // Etching/line colors
        etching: {
          line: 'rgba(212, 190, 150, 0.15)',
          'line-strong': 'rgba(212, 190, 150, 0.25)',
          fill: 'rgba(212, 190, 150, 0.05)',
        },
        'annotation-ink': '#A89F8C',

        // Tonal Palettes (Mapping tones 0-100 from M3 structure in tokens.json)
        'curio-neutral': {
          '0': '#000000',
          '10': '#1A1C1E',
          '20': '#2F3133',
          '30': '#46474A',
          '40': '#5D5E61',
          '50': '#78909C',
          '60': '#90A4AE',
          '70': '#B0BEC5',
          '80': '#CFD8DC',
          '90': '#ECEFF1',
          '95': '#F5F7F8',
          '99': '#FAFBFC',
          '100': '#FFFFFF',
        },
        'curio-neutral-variant': {
          '0': '#000000',
          '10': '#191C1D',
          '20': '#2E3132',
          '30': '#444748',
          '40': '#5C5F60',
          '50': '#747778',
          '60': '#8E9192',
          '70': '#A8ABAC',
          '80': '#C4C7C8',
          '90': '#E0E3E3',
          '95': '#EEF1F1',
          '99': '#FAFDFD',
          '100': '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        proclamation: ['Libre Bodoni', 'Playfair Display', 'serif'],
        body: ['Work Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // Legacy/Semantic mapping
        curator: ['Caveat', 'cursive'],
        bloom: ['Fraunces', 'serif'],
        'field-note': ['Work Sans', 'sans-serif'],
        annotation: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Display scales
        'display-large': [
          '48px',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-small': ['32px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],

        // Headline scales
        'headline-large': ['32px', { lineHeight: '1.25', fontWeight: '500' }],
        'headline-medium': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'headline-small': ['20px', { lineHeight: '1.35', fontWeight: '500' }],

        // Title scales
        'title-large': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'title-medium': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'title-small': ['14px', { lineHeight: '1.4', fontWeight: '500' }],

        // Body scales
        'body-large': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],

        // Label scales
        'label-large': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '1.4', fontWeight: '500' }],

        // Specialty scales
        'mono-data': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'mono-annotation': [
          '10px',
          { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.1em' },
        ],
        'display-hero': [
          '72px',
          { lineHeight: '1.0', fontWeight: '700', letterSpacing: '-0.02em' },
        ],
        'metric-display': [
          '48px',
          { lineHeight: '1.0', fontWeight: '100', letterSpacing: '-0.03em' },
        ],
      },
      borderRadius: {
        pebble: '20px 6px 16px 28px',
        stone: '16px 4px 12px 24px',
        leaf: '24px 8px 20px 4px',
        petal: '12px 4px 16px 8px',
        seed: '8px 4px 10px 6px',
        // Also include standard corner values
        none: '0',
        'extra-small': '4px',
        small: '8px',
        medium: '12px',
        large: '16px',
        'extra-large': '28px',
        full: '9999px',
      },
      spacing: {
        '0': '0px',
        '2': '2px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
        '80': '80px',
        '96': '96px',
        '128': '128px',
        // Named spacing
        xs: '4px',
        sm: '8px',
        md: '12px',
        base: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      transitionTimingFunction: {
        // Gallery mode - Viscous with overshoot
        viscous: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        settle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

        // Laboratory mode - Precise, no overshoot
        precise: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snap: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '150ms', // semantic 'micro' fallback
        micro: '180ms',
        short: '280ms',
        standard: '300ms',
        medium: '450ms',
        moderate: '450ms',
        long: '600ms',
        deliberate: '900ms',
      },
      boxShadow: {
        rest: '0 4px 24px rgba(20, 18, 16, 0.5), 0 1px 4px rgba(0, 0, 0, 0.2)',
        hover: '0 8px 40px rgba(20, 18, 16, 0.6), 0 2px 8px rgba(0, 0, 0, 0.25)',
        'glow-gold': '0 0 40px rgba(212, 168, 75, 0.15)',
        level0: 'none',
        level1: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        level2: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
        level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
        level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
      },
      zIndex: {
        base: '1',
        'pop-out': '20',
        scrim: '39',
        modal: '50',
        tooltip: '60',
        // Legacy mapping for safety
        'pop-out-legacy': '10',
        'scrim-legacy': '100',
        'modal-legacy': '200',
        'tooltip-legacy': '300',
      },
    },
  },
  plugins: [],
};

export default config;
