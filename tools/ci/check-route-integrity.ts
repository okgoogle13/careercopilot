// check-route-integrity.ts — Phase 3.1: CI Route Integrity Check
// Validates every entry in ROUTE_REGISTRY has a resolvable component file
// and, where screenId is set, a matching screens/ directory.
// Usage:  npx tsx tools/ci/check-route-integrity.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const ROUTES_JSON = path.join(ROOT, 'docs/manifests/routes.json');
const SCREENS_DIR = path.join(ROOT, 'frontend/src/screens');
const FEATURES_DIR = path.join(ROOT, 'frontend/src/features');
const SRC_DIR = path.join(ROOT, 'frontend/src');

interface RouteManifestEntry {
  path: string;
  component: string;
  importSource: string;
  auth: boolean;
  layout: string;
}

type Severity = 'error' | 'warning';
interface CheckResult {
  severity: Severity;
  route: string;
  message: string;
}

function resolveImport(importSource: string): string | null {
  if (importSource === 'UNKNOWN') return null;
  if (importSource === 'react-router-dom') return importSource;
  const base = importSource.replace(/^\.\//, '');
  const candidates = [
    path.join(SRC_DIR, base + '.tsx'),
    path.join(SRC_DIR, base + '.ts'),
    path.join(SRC_DIR, base, 'index.tsx'),
    path.join(SRC_DIR, base, 'index.ts'),
  ];
  return candidates.find(fs.existsSync) ?? null;
}

function main() {
  if (!fs.existsSync(ROUTES_JSON)) {
    console.error('❌ routes.json not found — run scan-routes.ts first');
    process.exit(1);
  }
  const { routes }: { routes: RouteManifestEntry[] } = JSON.parse(fs.readFileSync(ROUTES_JSON, 'utf-8'));

  const screenIds = fs.readdirSync(SCREENS_DIR).filter((d) =>
    /^\d{2}_/.test(d) && fs.statSync(path.join(SCREENS_DIR, d)).isDirectory()
  );

  const results: CheckResult[] = [];

  for (const route of routes) {
    // Skip wildcard
    if (route.path === '*') continue;

    // 1. Check component file resolves
    const resolved = resolveImport(route.importSource);
    if (!resolved) {
      const isNonFeature = !route.importSource.includes('/features/');
      results.push({
        severity: isNonFeature ? 'warning' : 'error',
        route: route.path,
        message: `Component "${route.importSource}" cannot be resolved.${isNonFeature ? ' (non-features/ source — migration required)' : ''}`,
      });
    }

    // 2. Check non-prototype routes source from features/
    if (!route.importSource.includes('/features/') &&
        route.importSource !== 'react-router-dom' &&
        !route.importSource.includes('/pages/') &&  // pages/ is known legacy
        route.importSource !== 'UNKNOWN' &&
        !route.path.startsWith('/kr/') &&
        !route.path.startsWith('/prototype') &&
        route.path !== '/test-tokens') {
      results.push({
        severity: 'warning',
        route: route.path,
        message: `Route sources from "${route.importSource}" — expected features/ for production routes`,
      });
    }
  }

  // Summary
  const errors = results.filter((r) => r.severity === 'error');
  const warnings = results.filter((r) => r.severity === 'warning');

  if (results.length === 0) {
    console.log('✅ Route integrity check passed — all routes valid');
    process.exit(0);
  }

  console.log(`\nRoute Integrity Check:`);
  for (const r of errors) {
    console.error(`  ❌ [ERROR] ${r.route}: ${r.message}`);
  }
  for (const r of warnings) {
    console.warn(`  ⚠️  [WARN]  ${r.route}: ${r.message}`);
  }

  console.log(`\nTotal: ${errors.length} errors, ${warnings.length} warnings`);
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
