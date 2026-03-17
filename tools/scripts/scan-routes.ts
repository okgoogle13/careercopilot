// scan-routes.ts — Phase 1.1: Route Scanner
/**
 * scan-routes.ts — Phase 1.1: Route Scanner
 *
 * Parses App.tsx to extract every <Route> declaration and emits
 * docs/manifests/routes.json with path, component, source file,
 * auth requirement, and layout shell.
 *
 * Usage:  npx tsx tools/scripts/scan-routes.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const APP_TSX = path.join(ROOT, 'frontend/src/App.tsx');
const OUT = path.join(ROOT, 'docs/manifests/routes.json');

interface RouteEntry {
  path: string;
  component: string;
  importSource: string;
  auth: boolean;
  layout: 'public' | 'protected' | 'migrated' | 'unknown';
}

function main() {
  const src = fs.readFileSync(APP_TSX, 'utf-8');

  // ── Step 1: Extract import map (component name → import path) ──
  const importMap = new Map<string, string>();
  const namedImportRe = /import\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = namedImportRe.exec(src)) !== null) {
    const names = m[1]
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => name.split(/\s+as\s+/)[0]?.trim())
      .filter(Boolean) as string[];
    for (const name of names) {
      importMap.set(name, m[2]);
    }
  }
  const defaultImportRe = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  while ((m = defaultImportRe.exec(src)) !== null) {
    importMap.set(m[1], m[2]);
  }
  const lazyImportRe = /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)/g;
  while ((m = lazyImportRe.exec(src)) !== null) {
    importMap.set(m[1], m[2]);
  }

  // ── Step 2: Determine layout context for each route ──
  // We parse the JSX structure to understand nesting.
  // Strategy: find the three layout outlets and the routes inside each.
  const routes: RouteEntry[] = [];

  // Find route elements with path= and element=
  const routeRe = /<Route\s[^>]*?path=["']([^"']+)["'][^>]*?element=\{\s*<(\w+)/g;
  while ((m = routeRe.exec(src)) !== null) {
    const routePath = m[1];
    const componentName = m[2];
    const importSource =
      componentName === 'Navigate' ? 'react-router-dom' : importMap.get(componentName) || 'UNKNOWN';

    // Determine layout by checking what context the route line is in
    const lineIdx = src.substring(0, m.index).split('\n').length;
    const layout = inferLayout(src, lineIdx);
    const auth = layout === 'protected' || layout === 'migrated';

    routes.push({
      path: routePath,
      component: componentName,
      importSource,
      auth,
      layout,
    });
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), count: routes.length, routes }, null, 2));

  console.log(`✅ Scanned ${routes.length} routes → ${path.relative(ROOT, OUT)}`);

  // Print summary table
  const layoutCounts = routes.reduce((acc, r) => {
    acc[r.layout] = (acc[r.layout] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('\nLayout breakdown:');
  for (const [layout, count] of Object.entries(layoutCounts)) {
    console.log(`  ${layout}: ${count}`);
  }
}

function inferLayout(src: string, lineNumber: number): RouteEntry['layout'] {
  // Look backwards from the route's line to find the nearest layout wrapper
  const lines = src.split('\n').slice(0, lineNumber);
  const before = lines.join('\n');

  // Count opening/closing pairs to determine nesting
  // MigratedRouteLayout is nested inside RequireAuth
  if (before.lastIndexOf('MigratedRouteLayout') > before.lastIndexOf('PublicLayout') &&
      before.lastIndexOf('MigratedRouteLayout') > before.lastIndexOf('ProtectedLayout')) {
    return 'migrated';
  }
  if (before.lastIndexOf('ProtectedLayout') > before.lastIndexOf('PublicLayout')) {
    return 'protected';
  }
  if (before.lastIndexOf('PublicLayout') > -1) {
    return 'public';
  }
  return 'unknown';
}

main();
