import fs from 'node:fs';
import path from 'node:path';
import type { AuditFileResult, AuditOptions, AuditViolation } from './types.js';

export const DEFAULT_INCLUDE_GLOBS = [
  'apps/web/src/**/*.{ts,tsx,js,jsx}',
  'packages/eslint-plugin-kerala-rage/**/*.js',
  'packages/design-audit/src/**/*.ts',
  'tools/design-audit/bin/**/*.ts',
];

export const DEFAULT_EXCLUDE_GLOBS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.turbo/**',
  '**/coverage/**',
  '**/*.stories.*',
  '**/*.snap',
  'packages/eslint-plugin-kerala-rage/tests/**/*.js',
  'frontend/src/design/tokens/tokens.json',
  'frontend/src/design/styles/design-tokens.css',
  'docs/archive/**',
  'docs/reports/archive/**',
];

const HARD_CODED_PATTERNS = [
  /#[0-9a-fA-F]{3}(?![0-9a-fA-F])/g,
  /#[0-9a-fA-F]{6}(?![0-9a-fA-F])/g,
  /#[0-9a-fA-F]{8}(?![0-9a-fA-F])/g,
  /\brgba?\([^)]*\)/g,
  /\bhsla?\([^)]*\)/g,
  /\b(?:bg|text|border|fill|stroke)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))\]/g,
];

const BANNED_TERMS = [
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

const LEGACY_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /\bpebbleSurge01\b/g,
    message: 'Legacy shape alias detected: pebbleSurge01. Use --sys-shape-marchSurge01 or a current semantic shape token.',
  },
  {
    pattern: /\bscaffoldSlab01\b/g,
    message: 'Legacy shape alias detected: scaffoldSlab01. Use --sys-shape-scaffoldFrame01 or another current semantic shape token.',
  },
  {
    pattern: /#1a1714\b/gi,
    message: 'Legacy hardcoded charcoal detected: #1A1714. Use var(--sys-color-charcoalBackground-base).',
  },
  {
    pattern: /\bInter\b/g,
    message: 'Legacy font detected: Inter. Use Work Sans, Fraunces, JetBrains Mono, Libre Bodoni, Caveat, or Nabla.',
  },
  {
    pattern: /\bRoboto\b/g,
    message: 'Legacy font detected: Roboto. Use Work Sans, Fraunces, JetBrains Mono, Libre Bodoni, Caveat, or Nabla.',
  },
];

const COPY_META_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /\b(?:Worker Portal|Workspace|Worker Access|Worker Account|Worker Overview)\b/g,
    message:
      'Bureaucratic or deprecated route copy detected. Use collective or movement framing instead.',
  },
  {
    pattern: /\b(?:migration|feature flag|legacy route|rollback|fallback|placeholder)\b/gi,
    message:
      'Developer meta-language detected in user-facing copy. Remove implementation-facing wording from rendered strings.',
  },
  {
    pattern: /\bcheckpoint cleared\b/gi,
    message:
      'Placeholder workflow language detected in user-facing copy. Replace with concrete user-facing status messaging.',
  },
  {
    pattern: /\b(?:Please|Sorry|Oops|We apologize|Unfortunately|Sorry for|excuse|forgive|regret)\b/gi,
    message:
      'Apologetic tone detected (BR-COPY-004). KR Solidarity voice is confrontational and direct, not apologetic. Use declarative language.',
  },
  {
    pattern: /\b(?:specimen|cabinet|jar|discovery|expedition|ledger|archive vault|collection|station|keychain)\b/gi,
    message:
      'Deprecated DOC-006 vocabulary detected (BR-COPY-005). Use current KR Solidarity v6.1 terms: Collective, Movement Space, Solidarity Base.',
  },
  {
    pattern: /\b(?:Click here|Submit|Continue|Proceed|Enter|Next|Go)\b(?!\s+(?:to|for|and|with|your|\w+\s+to))/g,
    message:
      'Generic CTA without context detected (BR-COPY-003). CTAs must state clear outcomes or next steps (e.g., "LOGIN → ACCESS DASHBOARD", not just "Continue").',
  },
];

const CANONICAL_EXCLUDE_PATTERNS = [
  'frontend/src/design/tokens/tokens.json',
  'frontend/src/design/styles/design-tokens.css',
];
const SCANNABLE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md']);

function createViolation(
  filePath: string,
  message: string,
  matchIndex: number,
  content: string,
  ruleId: AuditViolation['ruleId'],
  severity: AuditViolation['severity'] = 'error',
): AuditViolation {
  const linesToMatch = content.slice(0, matchIndex).split('\n');
  const line = linesToMatch.length;
  const column = linesToMatch.at(-1)?.length ?? 0;
  const excerpt = content.split('\n')[line - 1]?.trim();

  return {
    ruleId,
    severity,
    filePath,
    message,
    line,
    column: column + 1,
    excerpt,
  };
}

function collectMatches(
  filePath: string,
  content: string,
  pattern: RegExp,
  messageBuilder: (_match: string) => string,
  ruleId: AuditViolation['ruleId'],
): AuditViolation[] {
  const matches = content.matchAll(pattern);
  return Array.from(matches, (match) =>
    createViolation(filePath, messageBuilder(match[0]), match.index ?? 0, content, ruleId),
  );
}

function matchesTail(filePath: string, tails: string[]): boolean {
  return tails.some((tail) => filePath.endsWith(path.normalize(tail)));
}

function matchesSimpleGlob(relativePath: string, glob: string): boolean {
  const normalizedPath = relativePath.split(path.sep).join('/');

  if (glob.startsWith('**/')) {
    return normalizedPath.includes(glob.replace('**/', '').replace('/**', ''));
  }

  const base = glob.split('/**')[0];
  return normalizedPath.startsWith(base);
}

function collectFiles(
  rootDir: string,
  currentDir: string,
  excludes: string[],
  files: string[],
) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const entryPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, entryPath);

    if (matchesTail(entryPath, CANONICAL_EXCLUDE_PATTERNS)) {
      continue;
    }

    if (excludes.some((glob) => matchesSimpleGlob(relativePath, glob))) {
      continue;
    }

    if (entry.isDirectory()) {
      collectFiles(rootDir, entryPath, excludes, files);
      continue;
    }

    if (SCANNABLE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }
}

function resolveBoundaryReferences(rootDir: string, content: string): string[] {
  const referenced = new Set<string>();
  const referencePattern = /(?:from\s+['"]|['"])(\.\.\/(?:\.\.\/)*frontend\/src\/design\/(?:tokens\/tokens\.json|styles\/design-tokens\.css))['"]/g;

  for (const referenceMatch of content.matchAll(referencePattern)) {
    const candidate = path.resolve(rootDir, referenceMatch[1]);
    if (fs.existsSync(candidate)) {
      referenced.add(candidate);
    }
  }

  return Array.from(referenced);
}

export function collectAuditTargets(options: AuditOptions): string[] {
  const files = new Set<string>();

  for (const includeGlob of options.includeGlobs) {
    const base = includeGlob.split('/**')[0];
    const startDir = path.resolve(options.rootDir, base);
    const collected: string[] = [];

    if (!fs.existsSync(startDir)) {
      continue;
    }

    collectFiles(options.rootDir, startDir, options.excludeGlobs, collected);

    for (const filePath of collected) {
      files.add(filePath);
    }
  }

  if (options.boundaryCheck) {
    for (const filePath of Array.from(files)) {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const referencedFile of resolveBoundaryReferences(options.rootDir, content)) {
        if (!matchesTail(referencedFile, CANONICAL_EXCLUDE_PATTERNS)) {
          files.add(referencedFile);
        }
      }
    }
  }

  return Array.from(files).sort();
}

export function auditFile(filePath: string): AuditFileResult {
  if (
    filePath.includes(`${path.sep}tests${path.sep}`) ||
    filePath.includes('.spec.') ||
    filePath.includes('.test.') ||
    filePath.endsWith(path.join('packages', 'design-audit', 'src', 'rules.ts'))
  ) {
    return {
      filePath,
      scanned: false,
      violations: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const violations: AuditViolation[] = [];

  for (const pattern of HARD_CODED_PATTERNS) {
    violations.push(
      ...collectMatches(
        filePath,
        content,
        pattern,
        (match) => `Hardcoded style literal detected: ${match}`,
        'no-hardcoded-styles',
      ),
    );
  }

  for (const pattern of BANNED_TERMS) {
    violations.push(
      ...collectMatches(
        filePath,
        content,
        pattern,
        (match) => `Banned design term detected: ${match}`,
        'no-banned-design-terms',
      ),
    );
  }

  return {
    filePath,
    scanned: true,
    violations,
  };
}

export function auditLegacyFile(filePath: string): AuditFileResult {
  if (
    filePath.includes(`${path.sep}tests${path.sep}`) ||
    filePath.includes('.spec.') ||
    filePath.includes('.test.')
  ) {
    return {
      filePath,
      scanned: false,
      violations: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const violations: AuditViolation[] = [];

  for (const matcher of LEGACY_PATTERNS) {
    violations.push(
      ...collectMatches(
        filePath,
        content,
        matcher.pattern,
        () => matcher.message,
        'no-legacy-migration-patterns',
      ),
    );
  }

  return {
    filePath,
    scanned: true,
    violations,
  };
}

export function auditCopyFile(filePath: string): AuditFileResult {
  if (
    filePath.includes(`${path.sep}tests${path.sep}`) ||
    filePath.includes('.spec.') ||
    filePath.includes('.test.') ||
    !filePath.includes(`${path.sep}screens${path.sep}`)
  ) {
    return {
      filePath,
      scanned: false,
      violations: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (
    content.includes('This screen was generated from the LoginScreen migration pattern.') ||
    content.includes('Generated placeholder for the /')
  ) {
    return {
      filePath,
      scanned: false,
      violations: [],
    };
  }

  const violations: AuditViolation[] = [];

  for (const matcher of COPY_META_PATTERNS) {
    violations.push(
      ...collectMatches(
        filePath,
        content,
        matcher.pattern,
        () => matcher.message,
        'no-user-facing-meta-language',
      ),
    );
  }

  return {
    filePath,
    scanned: true,
    violations,
  };
}
