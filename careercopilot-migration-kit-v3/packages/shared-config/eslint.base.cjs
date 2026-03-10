const js = require('../../../node_modules/@eslint/js');
const globals = require('../../../node_modules/globals');
const parser = require('../../../node_modules/@typescript-eslint/parser');
const keralaRagePlugin = require('../eslint-plugin-kerala-rage');

module.exports = [
  js.configs.recommended,
  {
    files: ['apps/web/src/**/*.{ts,tsx}', 'packages/design-audit/src/**/*.ts', 'tools/design-audit/bin/**/*.ts'],
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
    },
  },
];
