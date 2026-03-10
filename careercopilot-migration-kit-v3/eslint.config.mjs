import js from '../node_modules/@eslint/js/src/index.js';
import globals from '../node_modules/globals/index.js';
import parser from '../node_modules/@typescript-eslint/parser/dist/index.js';
import keralaRagePlugin from './packages/eslint-plugin-kerala-rage/index.js';

const appFiles = [
  'apps/web/src/**/*.{ts,tsx}',
  'apps/web/vite.config.ts',
  'tools/design-audit/bin/**/*.ts',
  'packages/design-audit/src/**/*.ts',
];

export default [
  js.configs.recommended,
  {
    files: appFiles,
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'kerala-rage': keralaRagePlugin,
    },
    rules: {
      'kerala-rage/no-hardcoded-styles': 'error',
      'kerala-rage/no-banned-design-terms': 'error',
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['packages/eslint-plugin-kerala-rage/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['tools/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['apps/web/src/tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/coverage/**',
      'docs/archive/**',
      'docs/reports/archive/**',
      'frontend/src/design/tokens/tokens.json',
      'frontend/src/design/styles/design-tokens.css',
    ],
  },
];
