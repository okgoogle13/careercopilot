// check-all.ts — Run all CI truth-alignment checks and summarise results.
// Usage:  npx tsx tools/ci/check-all.ts

import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

interface CheckDef {
  name: string;
  cmd: string;
}

const CHECKS: CheckDef[] = [
  { name: 'Route Integrity',  cmd: 'npx tsx tools/ci/check-route-integrity.ts' },
  { name: 'Screen Pairs',     cmd: 'npx tsx tools/ci/check-screen-pairs.ts' },
];

function main() {
  console.log('🔍 Running Three-Truth Alignment checks...\n');

  let pass = 0;
  let fail = 0;

  for (const check of CHECKS) {
    try {
      const out = execSync(check.cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' });
      console.log(`✅ ${check.name}`);
      if (out.trim()) console.log(`   ${out.trim()}`);
      pass++;
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string };
      console.error(`❌ ${check.name} FAILED`);
      const output = (e.stdout ?? '') + (e.stderr ?? '');
      for (const line of output.split('\n').filter(Boolean)) {
        console.error(`   ${line}`);
      }
      fail++;
    }
  }

  console.log(`\n────────────────────────────────`);
  console.log(`Result: ${pass} passed, ${fail} failed`);
  if (fail > 0) {
    process.exit(1);
  }
}

main();
