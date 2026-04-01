#!/usr/bin/env node
/**
 * detect-orphans.js
 * Cross-references routes.json against the filesystem to find orphaned
 * features, pages, and screens. Outputs docs/manifests/orphans.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFESTS = path.join(ROOT, 'docs/manifests');
const FRONTEND_SRC = path.join(ROOT, 'frontend/src');

const routesPath = path.join(MANIFESTS, 'routes.json');
if (!fs.existsSync(routesPath)) {
  process.stderr.write('routes.json not found. Run extract-routes.js first.\n');
  process.exit(1);
}
const { routes } = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const routedScreenIds = new Set(routes.map(r => r.screenId).filter(Boolean));
const importSources = routes.map(r => r.importSource || '');

// Scan features/
const featuresDir = path.join(FRONTEND_SRC, 'features');
const featureDirs = fs.existsSync(featuresDir)
  ? fs.readdirSync(featuresDir).filter(f =>
      fs.statSync(path.join(featuresDir, f)).isDirectory()
    )
  : [];

const orphanedFeatures = featureDirs.filter(dir =>
  !importSources.some(src => src.includes(`features/${dir}`))
);

// Scan pages/
const pagesDir = path.join(FRONTEND_SRC, 'pages');
const pageFiles = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir).filter(f =>
      f.endsWith('.tsx') && fs.statSync(path.join(pagesDir, f)).isFile()
    )
  : [];

const orphanedPages = pageFiles.filter(file =>
  !importSources.some(src => src.includes(`pages/${file.replace('.tsx', '')}`))
);

// Scan screens/
const screensDir = path.join(FRONTEND_SRC, 'screens');
const screenDirs = fs.existsSync(screensDir)
  ? fs.readdirSync(screensDir).filter(f =>
      fs.statSync(path.join(screensDir, f)).isDirectory()
    )
  : [];

const unroutedScreens = screenDirs.filter(dir => !routedScreenIds.has(dir));

const nonFeatureRoutes = routes
  .filter(r => r.importSource && !r.importSource.includes('./features/'))
  .map(r => ({ path: r.path, source: r.importSource }));

const totalOrphans =
  orphanedFeatures.length +
  orphanedPages.length +
  unroutedScreens.length +
  nonFeatureRoutes.length;

const output = {
  generatedAt: new Date().toISOString(),
  orphanedFeatures,
  orphanedPages,
  unroutedScreens,
  nonFeatureRoutes,
  summary: {
    totalOrphans,
    featureOrphans: orphanedFeatures.length,
    pageOrphans: orphanedPages.length,
    screenOrphans: unroutedScreens.length,
    nonFeatureRoutes: nonFeatureRoutes.length,
  },
};

process.stdout.write(JSON.stringify(output, null, 2) + '\n');
