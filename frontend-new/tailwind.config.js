/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        border: 'var(--color-outline)',
        input: 'var(--color-on-surface-variant)',
        ring: 'var(--color-primary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-on-background)',
        
        // Primary colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-on-primary)',
          container: 'var(--color-primary-container)',
          onContainer: 'var(--color-on-primary-container)',
          50: 'var(--color-primary-05)',
          100: 'var(--color-primary-10)',
          200: 'var(--color-primary-20)',
          300: 'var(--color-primary-30)',
          400: 'var(--color-primary-40)',
          500: 'var(--color-primary-50)',
          600: 'var(--color-primary-60)',
          700: 'var(--color-primary-70)',
          800: 'var(--color-primary-80)',
          900: 'var(--color-primary-90)',
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-on-secondary)',
          container: 'var(--color-secondary-container)',
          onContainer: 'var(--color-on-secondary-container)',
        },
        
        // Tertiary colors
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          foreground: 'var(--color-on-tertiary)',
          container: 'var(--color-tertiary-container)',
          onContainer: 'var(--color-on-tertiary-container)',
        },
        
        // Error colors
        destructive: {
          DEFAULT: 'var(--color-error)',
          foreground: 'var(--color-on-error)',
          container: 'var(--color-error-container)',
          onContainer: 'var(--color-on-error-container)',
        },
        
        // Success colors
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-on-success)',
          container: 'var(--color-success-container)',
          onContainer: 'var(--color-on-success-container)',
        },
        
        // Warning colors
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: 'var(--color-on-warning)',
          container: 'var(--color-warning-container)',
          onContainer: 'var(--color-on-warning-container)',
        },
        
        // Surface colors
        surface: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-on-surface)',
          variant: 'var(--color-surface-variant)',
          onVariant: 'var(--color-on-surface-variant)',
          dim: 'var(--color-surface-dim)',
          bright: 'var(--color-surface-bright)',
          container: {
            lowest: 'var(--color-surface-container-lowest)',
            low: 'var(--color-surface-container-low)',
            DEFAULT: 'var(--color-surface-container)',
            high: 'var(--color-surface-container-high)',
            highest: 'var(--color-surface-container-highest)',
          },
        },
        
        // Card component
        card: {
          DEFAULT: 'var(--color-surface-container-low)',
          foreground: 'var(--color-on-surface)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}
