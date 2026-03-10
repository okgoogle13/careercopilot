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
];

const PATTERNS = [
  /\blabWrenMetalBlue\b/g,
  /\bGumLeafGreen\b/g,
  /\bWattleGold\b/g,
  /\binkGreen\b/g,
  /\bflora\b/gi,
  /\bbotanical\b/gi,
  /\bbotanist\b/gi,
  /\bwattle\b/gi,
  /\bgum leaf\b/gi,
  /\beucalyptus\b/gi,
  /\bJar\b/g,
  /\bCabinet\b/g,
  /\bSeed\b/g,
  /\bLeaf\b/g,
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
      message: `Banned design term detected: ${match[0]}`,
    });
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow banned KR Solidarity terms in migration code.',
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
