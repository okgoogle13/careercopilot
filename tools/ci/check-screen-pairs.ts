// check-screen-pairs.ts — Phase 3.2: CI Screen Pair Check
// Verifies every screens/NN_*/ directory has a .wireframe.xml, a .tsx file,
// and a mapping.json. CI fails if any screen is unpaired.
// Also validates mapping.json has required fields.
// Usage:  npx tsx tools/ci/check-screen-pairs.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const SCREENS_DIR = path.join(ROOT, 'frontend/src/screens');

interface CheckResult {
  screenId: string;
  passed: boolean;
  missing: string[];
  warnings: string[];
}

const REQUIRED_MAPPING_FIELDS = ['wireframe_path', 'screen_component_path', 'route'];

function main() {
  const screenDirs = fs.readdirSync(SCREENS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{2}_/.test(d.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const results: CheckResult[] = [];

  for (const dir of screenDirs) {
    const dirPath = path.join(SCREENS_DIR, dir.name);
    const files = fs.readdirSync(dirPath);
    const missing: string[] = [];
    const warnings: string[] = [];

    const hasWireframe = files.some((f) => f.endsWith('.wireframe.xml'));
    const hasTsx = files.some((f) => f.endsWith('.tsx') && !f.includes('.test.'));
    const hasMappingFile = files.includes('mapping.json');

    if (!hasWireframe) missing.push('.wireframe.xml');
    if (!hasTsx) missing.push('.tsx');
    if (!hasMappingFile) missing.push('mapping.json');

    // Validate mapping.json fields if present
    if (hasMappingFile) {
      try {
        const mapping = JSON.parse(fs.readFileSync(path.join(dirPath, 'mapping.json'), 'utf-8'));
        for (const field of REQUIRED_MAPPING_FIELDS) {
          if (!mapping[field]) {
            warnings.push(`mapping.json missing field: "${field}"`);
          }
        }
      } catch (_e) {
        missing.push('valid mapping.json (parse failed)');
      }
    }

    results.push({
      screenId: dir.name,
      passed: missing.length === 0,
      missing,
      warnings,
    });
  }

  const failures = results.filter((r) => !r.passed);
  const warns = results.filter((r) => r.passed && r.warnings.length > 0);

  if (failures.length === 0 && warns.length === 0) {
    console.log(`✅ Screen pair check passed — all ${results.length} screens are correctly paired`);
    process.exit(0);
  }

  console.log('\nScreen Pair Check:');
  for (const r of failures) {
    console.error(`  ❌ ${r.screenId}: missing ${r.missing.join(', ')}`);
  }
  for (const r of warns) {
    for (const w of r.warnings) {
      console.warn(`  ⚠️  ${r.screenId}: ${w}`);
    }
  }

  console.log(`\n${results.length} screens checked: ${failures.length} unpaired, ${warns.length} with warnings`);
  if (failures.length > 0) {
    process.exit(1);
  }
}

main();
