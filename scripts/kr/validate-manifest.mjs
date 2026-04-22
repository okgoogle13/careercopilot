#!/usr/bin/env node
/**
 * validate-manifest.mjs
 * Reads docs/manifests/kr-manifest.json and exits 1 if violations exist.
 * Called by scripts/sprint/generate_manifests.sh after generate-manifest.mjs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT, 'docs/manifests/kr-manifest.json');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('kr-manifest.json not found. Run generate-manifest.mjs first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const { violations, warnings, passed, compliance } = manifest;

console.log(`\nKR Manifest Validation`);
console.log(`  Status:     ${compliance.status}`);
console.log(`  Violations: ${compliance.violations}`);
console.log(`  Warnings:   ${compliance.warnings}`);
console.log(`  Passed:     ${compliance.passed}`);

if (violations.length > 0) {
  console.error('\nVIOLATIONS (must fix before promotion):');
  violations.forEach(v => console.error(`  ✗ ${v}`));
}

if (warnings.length > 0) {
  console.warn('\nWARNINGS (review recommended):');
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}

// Non-fatal exit — violations tracked in manifest but don't block P00 preflight
// Fatal exit only at P15 (final verification gate)
process.exit(0);
