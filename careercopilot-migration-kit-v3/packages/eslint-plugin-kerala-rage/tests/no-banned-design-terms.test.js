const test = require('node:test');
const assert = require('node:assert/strict');
const { RuleTester } = require('eslint');
const rule = require('../rules/no-banned-design-terms');

test('no-banned-design-terms rule', () => {
  const tester = new RuleTester({
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  });

  assert.doesNotThrow(() => {
    tester.run('no-banned-design-terms', rule, {
      valid: [
        {
          code: "const token = 'var(--sys-color-protestMetalBlue-base)';",
          filename: 'apps/web/src/screens/LoginScreen.tsx',
        },
      ],
      invalid: [
        {
          code: 'const token = "WattleGold";',
          filename: 'apps/web/src/screens/LoginScreen.tsx',
          errors: [{ message: /Banned design term detected/ }],
        },
        {
          code: 'function Leaf() { return null; }',
          filename: 'apps/web/src/screens/LoginScreen.tsx',
          errors: [{ message: /Banned design term detected/ }],
        },
        {
          code: 'const copy = "botanical panel";',
          filename: 'apps/web/src/screens/LoginScreen.tsx',
          errors: [{ message: /Banned design term detected/ }],
        },
      ],
    });
  });
});
