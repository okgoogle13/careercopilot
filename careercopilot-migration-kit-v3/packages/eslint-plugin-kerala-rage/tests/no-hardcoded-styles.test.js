const test = require('node:test');
const assert = require('node:assert/strict');
const { RuleTester } = require('eslint');
const rule = require('../rules/no-hardcoded-styles');

test('no-hardcoded-styles rule', () => {
  const tester = new RuleTester({
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  });

  assert.doesNotThrow(() => {
    tester.run('no-hardcoded-styles', rule, {
      valid: [
        {
          code: "const color = 'var(--sys-color-worker-ash-base)';",
          filename: 'apps/web/src/screens/LoginScreen.tsx',
        },
        {
          code: "const classes = 'text-[var(--sys-color-worker-ash-base)]';",
          filename: 'apps/web/src/screens/LoginScreen.tsx',
        },
        {
          code: "const source = '#DAF674';",
          filename: 'frontend/src/design/styles/design-tokens.css',
        },
      ],
      invalid: [
        {
          code: "const classes = 'bg-[#1A1714]';",
          filename: 'apps/web/src/screens/LoginScreen.tsx',
          errors: [
            { message: /Hardcoded style literal detected/ },
            { message: /Hardcoded style literal detected/ },
          ],
        },
        {
          code: "const style = { color: 'rgba(0, 0, 0, 0.5)' };",
          filename: 'apps/web/src/screens/LoginScreen.tsx',
          errors: [{ message: /Hardcoded style literal detected/ }],
        },
        {
          code: "const fill = 'hsl(0 0% 100%)';",
          filename: 'apps/web/src/screens/LoginScreen.tsx',
          errors: [{ message: /Hardcoded style literal detected/ }],
        },
      ],
    });
  });
});
