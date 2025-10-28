
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';

// Ensure TypeScript can find the config file
const tsconfigPath = './tsconfig.json';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '**/__mocks__/**',
      '**/test-utils.tsx',
      '**/setupTests.ts',
      '**/__tests__/**',
      '*.test.{ts,tsx}',
      '*.spec.{ts,tsx}',
      'tests/**',
      'rules/**',
      '**/*.d.ts',
      '**/build/**',
      '**/coverage/**',
      '**/public/**',
      '**/storybook-static/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/.cache/**',
    ],
  },
  // Base TypeScript and React configuration
  {
    files: ['**/*.{ts,tsx}'],
    ...reactRecommended,
    ...reactJsxRuntime,
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        NodeListOf: 'readonly',
        RequestInit: 'readonly',
        process: 'readonly',
        global: 'readonly',
        JSX: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: tsconfigPath,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.eslint.json',
        },
      },
    },
    rules: {
      // Base rules
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      ...jsxA11y.configs.recommended.rules,

      // React specific
      'react/display-name': 'off',
      'react/prop-types': 'off', // We use TypeScript for type checking
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/jsx-uses-react': 'off', // Not needed with new JSX transform
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/no-empty-object-type': 'off', // Allow empty interfaces for component props

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/newline-after-import': 'warn',

      // General best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'warn',
      'no-useless-escape': 'warn',
      'no-case-declarations': 'warn',
      'no-redeclare': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-param-reassign': ['error', { props: true }],
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',
      'object-shorthand': 'warn',
      'dot-notation': 'warn',
      'no-unused-expressions': ['error', { allowTernary: true }],
      'no-else-return': 'warn',

      // JSX A11y
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',
    },
  },
  // Test files configuration
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.jsdom,
        ...globals.node,
        ...globals.browser,
        NodeListOf: 'readonly',
        RequestInit: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        vi: 'readonly',
        it: 'readonly',
        expectTypeOf: 'readonly',
        assertType: 'readonly',
      },
    },
    rules: {
      // Disable rules that are not needed in test files
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/no-unescaped-entities': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'testing-library/render-result-naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'max-classes-per-file': 'off',
      'no-param-reassign': 'off',
      'no-return-await': 'off',
      'no-unused-expressions': 'off',
      'prefer-promise-reject-errors': 'off',
      'no-return-assign': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-plusplus': 'off',
      'no-continue': 'off',
      'no-loop-func': 'off',
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  // Storybook configuration
  {
    files: ['**/*.stories.{ts,tsx}', '**/*.story.{ts,tsx}'],
    plugins: {
      storybook: storybook,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'import/no-anonymous-default-export': 'off',
      'storybook/default-exports': 'error',
      'storybook/story-exports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Configuration files
  {
    files: ['*.config.{js,ts}', '**/config/**/*.{js,ts}'],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
