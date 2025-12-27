import js from '@eslint/js';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  reactRecommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      //   'error',
      //   {
      //     'selector': "JSXAttribute[name='className']",
      //     'message': "Use MUI's sx prop instead of className for styling",
      //   },
      // ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      'src/components_OLD/**',
      'src/assets_OLD/**',
      'dist/**',
      'node_modules/**',
      'src/features/**',
      'src/pages/**',
      'src/reference/**',
      'tests/**',
      'scripts/**',
      'packages/**',
      'docs/**',
      'functions/**',
      'dev-dist/**',
      '__mocks__/**',
    ],
  },
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}', 'src/setupTests.ts'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off', // TypeScript handles this
      'react/prop-types': 'off', // TypeScript handles this
      'no-unused-vars': 'off', // TypeScript handles this
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
