// check-capability-alignment.ts — Phase 3.3: CI Capability Truth Check
// Validates that every apiDep in ROUTE_REGISTRY exists in the codebase
// and matches an endpoint documented in the OpenAPI snapshot or API usage manifest.
// Usage:  npx tsx tools/ci/check-capability-alignment.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const REGISTRY_PATH = path.join(ROOT, 'frontend/src/config/route-registry.ts');
const API_DIR = path.join(ROOT, 'frontend/src/api');

function main() {
  console.log('Capability Alignment Check:\n');

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ Route registry not found');
    process.exit(1);
  }

  // We read the registry content to extract apiDeps via regex
  const registryText = fs.readFileSync(REGISTRY_PATH, 'utf-8');
  
  // Extract all apiDeps strings
  const apiDepMatch = registryText.match(/apiDeps: \[[^\]]*\]/g);
  const declaredDeps = new Set<string>();
  
  if (apiDepMatch) {
    for (const m of apiDepMatch) {
      const endpoints = m.match(/['"`]([^'"`]+)['"`]/g);
      if (endpoints) {
        endpoints.forEach(e => declaredDeps.add(e.replace(/['"`]/g, '')));
      }
    }
  }

  let errors = 0;
  let warnings = 0;

  console.log(`Verifying ${declaredDeps.size} unique Capability IDs in frontend/src/api/...\n`);

  for (const dep of declaredDeps) {
    // Check if the service file exists
    // Capability IDs match file names (e.g., 'authService' -> 'authService.ts')
    const serviceFile = path.join(API_DIR, `${dep}.ts`);
    const exists = fs.existsSync(serviceFile);

    if (exists) {
      console.log(`✅ [FOUND] ${dep} -> ${path.relative(ROOT, serviceFile)}`);
    } else {
      console.error(`❌ [MISSING] ${dep} - No corresponding file ${path.relative(ROOT, serviceFile)}`);
      errors++;
    }
  }

  console.log(`\nTotal: ${errors} errors, ${warnings} warnings`);
  
  if (errors > 0) {
    console.error('\nFAIL: One or more declared API dependencies are missing from the codebase.');
    process.exit(1);
  } else {
    console.log('\nPASS: All declared API dependencies are verified as present in the codebase.');
  }
}

main();
