const colors = require('tailwindcss/colors');
const tokens = require('./src/theme/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map our color tokens to Tailwind
        primary: {
          DEFAULT: tokens.color.primary.value,
          container: tokens.color.primaryContainer.value,
          onContainer: tokens.color.onPrimaryContainer.value,
        },
        tertiary: {
          DEFAULT: tokens.color.tertiary.value,
          container: tokens.color.tertiaryContainer.value,
          on: tokens.color.onTertiary.value,
        },
        surface: {
          DEFAULT: tokens.color.surface.value,
          container: tokens.color.surfaceContainer.value,
          'container-low': tokens.color.surfaceContainerLow.value,
          'container-high': tokens.color.surfaceContainerHigh.value,
        },
        outline: {
          DEFAULT: tokens.color.outline.value,
          variant: tokens.color.outlineVariant.value,
        },
      },
      borderRadius: {
        'card': tokens.borderRadius.large.value,
        'button': tokens.borderRadius.medium.value,
        'badge': tokens.borderRadius.small.value,
        'asymmetric': tokens.borderRadius.asymmetric.value,
      },
      fontFamily: {
        sans: ['var(--font-roboto-flex)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-roboto-serif)', 'serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
        hologram: ['var(--font-hologram)', 'display'],
      },
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
      // Add custom utilities for the design system
      typography: (theme) => ({
        electric: {
          css: {
            '--tw-prose-body': theme('colors.surface.DEFAULT'),
            '--tw-prose-headings': theme('colors.primary.DEFAULT'),
            '--tw-prose-links': theme('colors.tertiary.DEFAULT'),
            '--tw-prose-underline': theme('colors.tertiary.DEFAULT/0.3'),
            '--tw-prose-underline-hover': theme('colors.tertiary.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.tertiary.DEFAULT'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // Custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-hologram': {
          '@apply font-hologram text-primary': {},
          'text-shadow': '2px 2px 0 var(--md-sys-color-seed)',
        },
        '.bento-card': {
          '@apply bg-surface-container-low rounded-card p-6 relative overflow-hidden': {},
          '&:hover': {
            transform: 'scale(0.99)',
          },
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        '.pop-out-graphic': {
          '@apply absolute z-20' : {},
          top: '-40px',
          right: '24px',
          '&:hover': {
            transform: 'translateY(-15px) rotate(5deg) scale(1.1)',
          },
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
