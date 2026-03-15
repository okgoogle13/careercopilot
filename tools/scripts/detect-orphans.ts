// detect-orphans.ts — Phase 1.5: Orphan Detector
/**
 * detect-orphans.ts — Phase 1.5: Orphan Detector
 *
 * Cross-references routes.json, screens.json, and the filesystem to find:
 *   1. Feature dirs with no route in App.tsx
 *   2. Page files with no route in App.tsx
 *   3. Screen directories with no matching route
 *   4. Routes pointing to non-features/ sources (e.g. components/phase3-batch*)
 *
 * Requires: Run scan-routes.ts and scan-screens.ts first.
 *
 * Usage:  npx tsx tools/scripts/detect-orphans.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const ROUTES_JSON = path.join(ROOT, 'docs/manifests/routes.json');
const SCREENS_JSON = path.join(ROOT, 'docs/manifests/screens.json');
const FEATURES_DIR = path.join(ROOT, 'frontend/src/features');
const PAGES_DIR = path.join(ROOT, 'frontend/src/pages');
const OUT = path.join(ROOT, 'docs/manifests/orphans.json');

interface OrphanReport {
  generatedAt: string;
  orphanedFeatures: string[];
  orphanedPages: string[];
  unroutedScreens: string[];
  nonFeatureRoutes: { path: string; source: string }[];
  summary: {
    totalOrphans: number;
    featureOrphans: number;
    pageOrphans: number;
    screenOrphans: number;
    nonFeatureRoutes: number;
  };
}

function main() {
  // Load manifests
  if (!fs.existsSync(ROUTES_JSON)) {
    console.error('❌ routes.json not found. Run scan-routes.ts first.');
    process.exit(1);
  }
  if (!fs.existsSync(SCREENS_JSON)) {
    console.error('❌ screens.json not found. Run scan-screens.ts first.');
    process.exit(1);
  }

  const routesData = JSON.parse(fs.readFileSync(ROUTES_JSON, 'utf-8'));
  const screensData = JSON.parse(fs.readFileSync(SCREENS_JSON, 'utf-8'));

  const routes: { path: string; component: string; importSource: string }[] = routesData.routes;
  const screens: { screenId: string; mapping: Record<string, unknown> | null }[] = screensData.screens;

  // ── 1. Orphaned features (dirs in features/ not imported by any route) ──
  const featureDirs = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const routedFeaturePaths = new Set(
    routes
      .map(r => r.importSource)
      .filter(s => s.includes('/features/'))
      .map(s => {
        const match = s.match(/features\/([^/]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[]
  );

  const orphanedFeatures = featureDirs.filter(f => !routedFeaturePaths.has(f));

  // ── 2. Orphaned pages (files in pages/ not imported by any route) ──
  const pageFiles = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.tsx') && !f.startsWith('__'));

  const routedPageComponents = new Set(
    routes
      .filter(r => r.importSource.includes('/pages/'))
      .map(r => r.component)
  );

  const orphanedPages = pageFiles.filter(f => {
    const componentName = f.replace('.tsx', '');
    return !routedPageComponents.has(componentName);
  });

  // ── 3. Unrouted screens (screen dirs whose route is not in routes.json) ──
  const routedPaths = new Set(routes.map(r => r.path));
  const unroutedScreens = screens
    .filter(s => {
      if (!s.mapping) return true;
      const route = (s.mapping as Record<string, string>).route;
      return !route || !routedPaths.has(route);
    })
    .map(s => s.screenId);

  // ── 4. Non-feature routes (routes importing from places other than features/) ──
  const nonFeatureRoutes = routes
    .filter(r => !r.importSource.includes('/features/') && r.path !== '*')
    .map(r => ({ path: r.path, source: r.importSource }));

  const report: OrphanReport = {
    generatedAt: new Date().toISOString(),
    orphanedFeatures,
    orphanedPages,
    unroutedScreens,
    nonFeatureRoutes,
    summary: {
      totalOrphans: orphanedFeatures.length + orphanedPages.length + unroutedScreens.length + nonFeatureRoutes.length,
      featureOrphans: orphanedFeatures.length,
      pageOrphans: orphanedPages.length,
      screenOrphans: unroutedScreens.length,
      nonFeatureRoutes: nonFeatureRoutes.length,
    },
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

  console.log(`✅ Orphan report → ${path.relative(ROOT, OUT)}`);
  console.log(`\nSummary:`);
  console.log(`  Feature dirs without route:  ${orphanedFeatures.length} ${orphanedFeatures.length ? `(${orphanedFeatures.join(', ')})` : ''}`);
  console.log(`  Page files without route:    ${orphanedPages.length} ${orphanedPages.length ? `(${orphanedPages.join(', ')})` : ''}`);
  console.log(`  Screen dirs without route:   ${unroutedScreens.length} ${unroutedScreens.length ? `(${unroutedScreens.join(', ')})` : ''}`);
  console.log(`  Routes from non-features/:   ${nonFeatureRoutes.length}`);
  if (nonFeatureRoutes.length) {
    for (const r of nonFeatureRoutes) {
      console.log(`    ${r.path} ← ${r.source}`);
    }
  }
}

main();
