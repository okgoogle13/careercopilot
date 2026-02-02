import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'specimen-night': 'var(--color-specimen-night)',
                'parchment': 'var(--color-parchment)',
                'flannel-flower': 'var(--color-flannel-flower)',
                'surface-container': 'var(--color-eucalypt-smoke)',
            },
            fontFamily: {
                proclamation: ['"Libre Bodoni"', '"Playfair Display"', 'serif'],
                bloom: ['"Fraunces"', 'serif'],
                'field-note': ['"Work Sans"', 'sans-serif'],
                annotation: ['"JetBrains Mono"', 'monospace'],
            },
            fontSize: {
                'display-lg': ['48px', { lineHeight: '1.05' }],
                'headline-lg': ['32px', { lineHeight: '1.1' }],
                'headline-md': ['24px', { lineHeight: '1.15' }],
                'headline-sm': ['20px', { lineHeight: '1.2' }],
                'title-lg': ['18px', { lineHeight: '1.3' }],
                'title-md': ['16px', { lineHeight: '1.3' }],
                'body-lg': ['16px', { lineHeight: '1.5' }],
                'body-md': ['14px', { lineHeight: '1.5' }],
                'body-sm': ['12px', { lineHeight: '1.5' }],
                'label-md': ['12px', { lineHeight: '1.2' }],
            },
            transitionTimingFunction: {
                'viscous-breeze': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
};

export default config;
