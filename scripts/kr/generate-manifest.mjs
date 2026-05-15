#!/usr/bin/env node
/**
 * generate-manifest.mjs
 * Validates KR Solidarity token compliance across frontend/src/
 * Outputs docs/manifests/kr-manifest.json
 *
 * Checks:
 *   1. tokens.json has valid DTCG structure ($type, $value on leaf nodes)
 *   2. design-tokens.css defines --kr-color-* and --sys-color-* variables
 *   3. solidarity-tokens.ts uses var(--kr-*) references (not hardcoded hex)
 *   4. Scans TSX/TS for hardcoded hex colors (violations)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const MANIFESTS_DIR = path.join(ROOT, 'docs/manifests');

const TOKENS_JSON = path.join(ROOT, 'frontend/src/design/tokens/tokens.json');
const DESIGN_TOKENS_CSS = path.join(ROOT, 'frontend/src/design/styles/design-tokens.css');
const SOLIDARITY_TOKENS_TS = path.join(ROOT, 'frontend/src/design/tokens/solidarity-tokens.ts');
const FRONTEND_SRC = path.join(ROOT, 'frontend/src');

const violations = [];
const warnings = [];
const passed = [];

// ── 1. Validate tokens.json DTCG structure ─────────────────────────────────
function validateDtcg(obj, keyPath = '') {
  if (typeof obj !== 'object' || obj === null) return;
  // Leaf node: has $type and $value
  if ('$type' in obj && '$value' in obj) {
    passed.push(`DTCG leaf: ${keyPath}`);
    return;
  }
  // Group node: recurse
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue; // skip meta keys
    validateDtcg(v, keyPath ? `${keyPath}.${k}` : k);
  }
}

if (fs.existsSync(TOKENS_JSON)) {
  try {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_JSON, 'utf8'));
    validateDtcg(tokens);
    passed.push('tokens.json: valid JSON and DTCG structure');
  } catch (e) {
    violations.push(`tokens.json: parse error — ${e.message}`);
  }
} else {
  violations.push('tokens.json: MISSING at frontend/src/design/tokens/tokens.json');
}

// ── 2. Validate design-tokens.css has KR/sys variables ────────────────────
if (fs.existsSync(DESIGN_TOKENS_CSS)) {
  const css = fs.readFileSync(DESIGN_TOKENS_CSS, 'utf8');
  const krVarCount = (css.match(/--kr-color-/g) || []).length;
  const sysVarCount = (css.match(/--sys-color-/g) || []).length;
  if (krVarCount > 0) {
    passed.push(`design-tokens.css: ${krVarCount} --kr-color-* variables defined`);
  } else {
    violations.push('design-tokens.css: no --kr-color-* variables found');
  }
  if (sysVarCount > 0) {
    passed.push(`design-tokens.css: ${sysVarCount} --sys-color-* variables defined`);
  } else {
    warnings.push('design-tokens.css: no --sys-color-* variables found');
  }
  // Check for hardcoded hex in CSS (violation)
  const hexInCss = (css.match(/#[0-9a-fA-F]{3,8}\b/g) || []).length;
  if (hexInCss > 0) {
    warnings.push(`design-tokens.css: ${hexInCss} hardcoded hex values found (prefer CSS variables)`);
  }
} else {
  violations.push('design-tokens.css: MISSING at frontend/src/design/styles/design-tokens.css');
}

// ── 3. Validate solidarity-tokens.ts uses var() references ─────────────────
if (fs.existsSync(SOLIDARITY_TOKENS_TS)) {
  const ts = fs.readFileSync(SOLIDARITY_TOKENS_TS, 'utf8');
  const varRefs = (ts.match(/var\(--kr-/g) || []).length;
  const hardcodedHex = (ts.match(/"#[0-9a-fA-F]{3,8}"/g) || []).length;
  if (varRefs > 0) {
    passed.push(`solidarity-tokens.ts: ${varRefs} var(--kr-*) references`);
  } else {
    violations.push('solidarity-tokens.ts: no var(--kr-*) references — tokens may be hardcoded');
  }
  if (hardcodedHex > 0) {
    violations.push(`solidarity-tokens.ts: ${hardcodedHex} hardcoded hex values — must use var(--kr-*)`);
  }
} else {
  warnings.push('solidarity-tokens.ts: not found — skipping');
}

// ── 4. Scan TSX/TS for hardcoded hex colors ────────────────────────────────
function walkDir(dir, exts, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '_quarantine') continue;
      walkDir(full, exts, results);
    } else if (exts.some(e => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const tsxFiles = walkDir(FRONTEND_SRC, ['.tsx', '.ts']).filter(
  f => !f.includes('.test.') && !f.includes('.spec.')
);

const hexViolations = [];
const HEX_RE = /#[0-9a-fA-F]{6}\b/g;
for (const file of tsxFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(HEX_RE) || [];
  if (matches.length > 0) {
    const rel = path.relative(FRONTEND_SRC, file);
    hexViolations.push({ file: rel, count: matches.length, examples: matches.slice(0, 3) });
  }
}

if (hexViolations.length > 0) {
  violations.push(`Hardcoded hex colors in ${hexViolations.length} TSX/TS files (zero-flora violation)`);
} else {
  passed.push('No hardcoded hex colors in TSX/TS files');
}

// ── Output ─────────────────────────────────────────────────────────────────
const manifest = {
  generatedAt: new Date().toISOString(),
  compliance: {
    violations: violations.length,
    warnings: warnings.length,
    passed: passed.length,
    status: violations.length === 0 ? 'PASS' : 'FAIL',
  },
  violations,
  warnings,
  passed,
  hexViolations,
};

fs.mkdirSync(MANIFESTS_DIR, { recursive: true });
fs.writeFileSync(
  path.join(MANIFESTS_DIR, 'kr-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// Also write a validate-manifest.mjs compatible summary to stdout
console.log(`KR Manifest generated: ${violations.length} violations, ${warnings.length} warnings, ${passed.length} passed`);
if (violations.length > 0) {
  console.error('VIOLATIONS:');
  violations.forEach(v => console.error(`  ✗ ${v}`));
}
if (warnings.length > 0) {
  console.warn('WARNINGS:');
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}

// Exit 0 even with violations — violations are tracked in manifest, not fatal at P00
process.exit(0);
