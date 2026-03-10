const IGNORE_PATHS = [
  'frontend/src/design/tokens/tokens.json',
  'frontend/src/design/styles/design-tokens.css',
  '/docs/archive/',
  '/docs/reports/archive/',
  '/node_modules/',
  '/dist/',
  '/build/',
  '/.turbo/',
  '/coverage/',
  '/packages/design-audit/src/',
];

const PATTERNS = [
  /#[0-9a-fA-F]{3}(?![0-9a-fA-F])/g,
  /#[0-9a-fA-F]{6}(?![0-9a-fA-F])/g,
  /#[0-9a-fA-F]{8}(?![0-9a-fA-F])/g,
  /\brgba?\([^)]*\)/g,
  /\bhsla?\([^)]*\)/g,
  /\b(?:bg|text|border|fill|stroke)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))\]/g,
];

function shouldIgnore(filename) {
  return IGNORE_PATHS.some((entry) => filename.includes(entry));
}

function reportPattern(context, program, pattern) {
  const sourceCode = context.sourceCode;
  const text = sourceCode.getText();

  for (const match of text.matchAll(pattern)) {
    const loc = sourceCode.getLocFromIndex(match.index);

    context.report({
      node: program,
      loc: {
        start: loc,
        end: loc,
      },
      message: `Hardcoded style literal detected: ${match[0]}`,
    });
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded style literals in migrated code.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();

    if (shouldIgnore(filename)) {
      return {};
    }

    return {
      Program(program) {
        for (const pattern of PATTERNS) {
          reportPattern(context, program, pattern);
        }
      },
    };
  },
};
