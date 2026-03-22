#!/usr/bin/env ts-node
/**
 * Component Inventory Generator - KeralaRage KrSolidarity Edition
 *
 * This script analyzes the frontend codebase to generate an accurate inventory
 * of all components, their usage patterns, and KR Solidarity migration status.
 *
 * Features:
 * - Uses TypeScript AST analysis via ts-morph for accuracy
 * - Detects all import patterns (default, named, dynamic)
 * - Tracks component dependencies and KR Solidarity migration status
 * - Identifies test/story file coverage
 * - Categorizes components by type
 * - Analyzes KR Solidarity adoption (token usage, mode system, legacy usage)
 * - Generates detailed JSON report with migration recommendations
 *
 * Migration Status Detection (KR Solidarity):
 * - 'migrated': Uses KR token/mode signals, no legacy MUI/M3 dependencies
 * - 'mixed': Uses KR token/mode signals alongside legacy MUI/M3
 * - 'not_migrated': Uses legacy MUI/M3 without KR token/mode signals
 * - 'unknown': No clear KR or legacy signals detected
 *
 * Naming policy:
 * - Route planning and output summaries should use plain UI language first
 *   (`Button`, `Card`, `Dialog`, `Input`, `Select`, `Surface`).
 * - Internal KR archetype names (`Strike`, `Placard`, `Megaphone`, etc.) remain
 *   valid implementation signals and migration hints.
 *
 * Usage:
 *   npx ts-node scripts/component-inventory.ts
 *   npx ts-node scripts/component-inventory.ts --output inventory.json
 */

import { Project, SyntaxKind, ImportDeclaration, Node } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComponentInfo {
  name: string;
  path: string;
  relativePath: string;
  category:
    | 'ui'
    | 'shared'
    | 'core'
    | 'components'
    | 'features'
    | 'layout'
    | 'pages'
    | 'legacy'
    | 'ui_package'
    | 'other';
  usageCount: number;
  importedBy: string[];
  exports: string[];
  hasTests: boolean;
  hasStories: boolean;
  hasDocs: boolean;
  linesOfCode: number;
  complexity: 'simple' | 'medium' | 'complex';
  dependencies: string[];
  isReusable: boolean;
  usesMUI: boolean;
  usesCustomUI: boolean;
  usesLegacyM3: boolean;
  isDemo: boolean;
  migrationStatus: 'unknown' | 'not_migrated' | 'mixed' | 'migrated';
  // KeralaRage KrSolidarity specific fields
  usesDesignTokens: boolean;
  usesModeSystem: boolean;
  expressiveStatus?: 'none' | 'planned' | 'in_progress' | 'done';
  designLevel?: 'atom' | 'molecule' | 'organism' | 'unknown';
  hasA11yPassed?: boolean;
  bundleImpact?: 'low' | 'medium' | 'high';
  visualRegression?: 'passed' | 'pending';
  routeFamily?: string;
  layerTruth?: 'design' | 'runtime' | 'capability_adjacent' | 'derived' | 'unknown';
  canonicalStatus?:
    | 'canonical'
    | 'support'
    | 'reference'
    | 'prototype'
    | 'deferred'
    | 'deprecated_candidate'
    | 'deadcode_candidate'
    | 'unknown';
  targetStateDecision?: 'keep' | 'expand' | 'merge' | 'replace' | 'retire' | 'unknown';
  mockBacked?: boolean;
  capabilityDependencies?: string[];
  migrationPhase?: string;
  deadCodeCandidate?: boolean;
  prototypeStatus?: 'live_prototype' | 'unrouted_candidate' | 'runtime' | 'none';
}

interface InventoryReport {
  generatedAt: string;
  totalComponents: number;
  componentsByCategory: Record<string, number>;
  components: ComponentInfo[];
  unusedComponents: string[];
  mostUsedComponents: Array<{ name: string; count: number }>;
  recommendations: string[];
  migrationSummary: Record<'migrated' | 'mixed' | 'not_migrated' | 'unknown', number>;
  KrSolidarityAdoption: {
    withKrSolidarityTokens: number;
    withModeSystem: number;
    legacyMUI: number;
    legacyM3: number;
    fullyKrSolidarity: number;
  };
  governanceSummary: {
    routeFamiliesByDecision: Record<string, number>;
    mockBackedLiveSurfaces: string[];
    unresolvedCapabilityGaps: string[];
    deadCodeCandidates: string[];
    prototypeCandidates: string[];
  };
}

interface RouteMatrixRow {
  current_route: string;
  target_route: string;
  family: string;
  status: 'keep' | 'expand' | 'merge' | 'replace' | 'retire';
  current_runtime_owner?: string;
  target_runtime_owner?: string;
  screen_reference?: string | null;
  paired_runtime_surface?: string | null;
  target_component_surfaces?: string[];
  backend_capabilities?: string[];
}

interface RouteMatrix {
  rows: RouteMatrixRow[];
}

interface BackendFeatureGap {
  feature_id: string;
  owner_route: string;
  owner_surface: string;
  frontend_status?: string;
  reference_components?: string[];
  new_components?: string[];
  deferred_components?: string[];
}

interface BackendFeatureComponentGapMap {
  features: BackendFeatureGap[];
}

const ROUTE_FAMILY_HINTS: Record<string, string[]> = {
  landing: ['landing'],
  'auth-onboarding': ['auth', 'login', 'register', 'onboarding', 'welcome'],
  dashboard: ['dashboard'],
  analysis: ['analysis', 'assetlibrary', 'asset-library', 'resumeaudit'],
  documents: ['document', 'documents', 'workbench'],
  applications: ['application', 'applications', 'tracker', 'applyquick', 'kanban'],
  jobs: ['jobqueue', 'opportunities', 'lookout', 'job'],
  generation: ['coverletter', 'ksc', 'generator'],
  account: ['profile', 'profiles', 'settings', 'voice'],
  ingestion: ['ingestion', 'ingest', 'resumeuploader', 'evidenceuploader'],
  'internal-tools': ['designsidekick', 'styleguide', 'tokentest'],
  'landing-prototype': ['herolanding'],
  fallback: [],
};

const FRONTEND_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');
const UI_PACKAGE_DIR = path.join(FRONTEND_DIR, 'packages', 'ui', 'src', 'components');
const COMPONENT_ROOTS = [
  path.join(SRC_DIR, 'components'),
  path.join(SRC_DIR, 'features'),
  path.join(SRC_DIR, 'layouts'),
  path.join(SRC_DIR, 'pages'),
  path.join(SRC_DIR, 'legacy'),
  UI_PACKAGE_DIR,
];

const REPO_ROOT = path.join(FRONTEND_DIR, '..');
const TRACKED_MIGRATION_ROOT = path.join(
  REPO_ROOT,
  'docs',
  'project',
  'active',
  'frontend-source-of-truth-migration'
);
const ROUTE_MATRIX_PATH = path.join(TRACKED_MIGRATION_ROOT, 'control', 'route-matrix.json');
const COMPONENT_GAP_MAP_PATH = path.join(TRACKED_MIGRATION_ROOT, 'control', 'gap-map.json');

function normalizePath(value: string): string {
  return value.split(path.sep).join('/');
}

function isWithinRoot(filePath: string, rootDir: string): boolean {
  const relative = path.relative(rootDir, filePath);
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function categorizeComponent(filePath: string): ComponentInfo['category'] {
  const relativePath = normalizePath(path.relative(FRONTEND_DIR, filePath));

  if (relativePath.startsWith('packages/ui/src/components/')) return 'ui_package';
  if (relativePath.startsWith('src/legacy/')) return 'legacy';
  if (relativePath.startsWith('src/layouts/')) return 'layout';
  if (relativePath.startsWith('src/pages/')) return 'pages';
  if (relativePath.startsWith('src/features/')) return 'features';
  if (relativePath.startsWith('src/context/')) return 'core';
  if (relativePath.startsWith('src/components/ui/')) return 'ui';
  if (relativePath.startsWith('src/components/shared/')) return 'shared';
  if (relativePath.startsWith('src/components/core/')) return 'core';
  if (relativePath.startsWith('src/components/')) return 'components';

  return 'other';
}

function calculateComplexity(
  linesOfCode: number,
  dependencies: number
): ComponentInfo['complexity'] {
  if (linesOfCode < 50 && dependencies < 3) return 'simple';
  if (linesOfCode < 200 && dependencies < 10) return 'medium';
  return 'complex';
}

function findRelatedFiles(componentPath: string): {
  hasTests: boolean;
  hasStories: boolean;
  hasDocs: boolean;
} {
  const dir = path.dirname(componentPath);
  const baseName = path.basename(componentPath, path.extname(componentPath));

  const testPatterns = [
    path.join(dir, `${baseName}.test.tsx`),
    path.join(dir, `${baseName}.test.ts`),
    path.join(dir, `${baseName}.spec.tsx`),
    path.join(dir, `${baseName}.spec.ts`),
  ];

  const storyPatterns = [
    path.join(dir, `${baseName}.stories.tsx`),
    path.join(dir, `${baseName}.stories.ts`),
    path.join(dir, `${baseName}.stories.mdx`),
  ];

  const docPatterns = [path.join(dir, `${baseName}.md`), path.join(dir, 'README.md')];

  return {
    hasTests: testPatterns.some((p) => fs.existsSync(p)),
    hasStories: storyPatterns.some((p) => fs.existsSync(p)),
    hasDocs: docPatterns.some((p) => fs.existsSync(p)),
  };
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function normalizeRepoPath(p: string): string {
  return normalizePath(path.relative(FRONTEND_DIR, p));
}

function getGovernanceContext() {
  const routeMatrix = readJsonIfExists<RouteMatrix>(ROUTE_MATRIX_PATH);
  const componentGapMap = readJsonIfExists<BackendFeatureComponentGapMap>(COMPONENT_GAP_MAP_PATH);
  const routeRows = routeMatrix?.rows ?? [];
  const featureGaps = componentGapMap?.features ?? [];

  return {
    routeRows,
    featureGaps,
    unresolvedCapabilityGaps: featureGaps
      .filter(
        (entry) =>
          entry.frontend_status === 'no_live_owner' ||
          entry.frontend_status === 'mock_only' ||
          entry.frontend_status === 'partially_wired'
      )
      .map((entry) => entry.feature_id),
  };
}

function scoreRouteRowMatch(
  row: RouteMatrixRow,
  normalizedRelativePath: string,
  normalizedComponentName: string
): number {
  let score = 0;
  const screenReference = normalizePath(row.screen_reference ?? '').toLowerCase();
  const runtimeSurface = normalizePath(row.paired_runtime_surface ?? '').toLowerCase();
  const targetOwner = (row.target_runtime_owner ?? '').toLowerCase();
  const currentOwner = (row.current_runtime_owner ?? '').toLowerCase();
  const familyHints = ROUTE_FAMILY_HINTS[row.family] ?? [];

  if (screenReference && screenReference.endsWith(normalizedRelativePath)) score += 8;
  if (runtimeSurface && runtimeSurface.endsWith(normalizedRelativePath)) score += 8;
  if (targetOwner && targetOwner === normalizedComponentName) score += 8;
  if (currentOwner && currentOwner === normalizedComponentName) score += 6;
  if (
    (row.target_component_surfaces ?? []).some(
      (surface) => surface.toLowerCase() === normalizedComponentName
    )
  ) {
    score += 5;
  }
  if (
    familyHints.some(
      (hint) => normalizedRelativePath.includes(hint) || normalizedComponentName.includes(hint)
    )
  ) {
    score += 2;
  }

  return score;
}

function getGovernanceMetadata(
  relativePath: string,
  componentName: string,
  governance: ReturnType<typeof getGovernanceContext>
) {
  const normalizedRelativePath = normalizePath(relativePath).toLowerCase();
  const normalizedComponentName = componentName.toLowerCase();
  const normalizedRepoRelativePath = normalizePath(
    path.join('frontend', relativePath)
  ).toLowerCase();
  let routeFamily: string | undefined;
  let targetStateDecision: ComponentInfo['targetStateDecision'] = 'unknown';
  let capabilityDependencies: string[] = [];
  let migrationPhase: string | undefined;
  let prototypeStatus: ComponentInfo['prototypeStatus'] = 'none';
  let canonicalStatus: ComponentInfo['canonicalStatus'] = 'unknown';

  const matchedRoute = governance.routeRows
    .map((row) => ({
      row,
      score: scoreRouteRowMatch(row, normalizedRepoRelativePath, normalizedComponentName),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.row;

  if (matchedRoute) {
    routeFamily = matchedRoute.family;
    targetStateDecision = matchedRoute.status;
    capabilityDependencies = matchedRoute.backend_capabilities ?? [];
  }

  const matchedFeature = governance.featureGaps.find(
    (feature) =>
      feature.owner_surface.toLowerCase() === normalizedComponentName ||
      (feature.reference_components ?? []).some(
        (component) => component.toLowerCase() === normalizedComponentName
      ) ||
      (feature.new_components ?? []).some(
        (component) => component.toLowerCase() === normalizedComponentName
      ) ||
      (feature.deferred_components ?? []).some(
        (component) => component.toLowerCase() === normalizedComponentName
      )
  );

  if (relativePath.startsWith('src/screens/')) {
    canonicalStatus = 'reference';
  } else if (relativePath.includes('phase3-batch') || relativePath.includes('/debug/')) {
    canonicalStatus = 'deprecated_candidate';
  } else if (
    matchedFeature?.deferred_components?.some((component) => component === componentName)
  ) {
    canonicalStatus = 'deferred';
  } else if (
    matchedFeature?.reference_components?.some((component) => component === componentName)
  ) {
    canonicalStatus = 'reference';
  } else if (
    matchedFeature?.owner_surface === componentName ||
    matchedRoute?.target_runtime_owner === componentName
  ) {
    canonicalStatus = 'canonical';
  } else if (
    matchedRoute?.target_component_surfaces?.some((surface) => surface === componentName) ||
    matchedFeature?.new_components?.some((component) => component === componentName)
  ) {
    canonicalStatus = 'support';
  } else if (
    relativePath.startsWith('src/layouts/') ||
    relativePath.startsWith('src/components/')
  ) {
    canonicalStatus = 'support';
  } else if (relativePath.startsWith('src/features/') || relativePath.startsWith('src/pages/')) {
    canonicalStatus = 'canonical';
  }

  if (relativePath.startsWith('src/screens/')) {
    prototypeStatus = 'unrouted_candidate';
  }
  if (relativePath.includes('phase3-batch') || relativePath.includes('/kr/')) {
    prototypeStatus = 'live_prototype';
  }
  if (relativePath.startsWith('src/features/') || relativePath.startsWith('src/pages/')) {
    prototypeStatus = 'runtime';
  }

  const mockBacked = Boolean(
    matchedFeature &&
    ['mock_only', 'no_live_owner', 'partially_wired'].includes(
      matchedFeature.frontend_status ?? ''
    ) &&
    (relativePath.startsWith('src/features/') || relativePath.startsWith('src/pages/'))
  );

  const deadCodeCandidate =
    canonicalStatus === 'deprecated_candidate' ||
    (prototypeStatus === 'unrouted_candidate' && targetStateDecision === 'retire');

  const layerTruth: ComponentInfo['layerTruth'] = relativePath.startsWith('src/screens/')
    ? 'design'
    : relativePath.startsWith('src/features/') || relativePath.startsWith('src/pages/')
      ? 'runtime'
      : matchedFeature
        ? 'capability_adjacent'
        : relativePath.includes('phase3-batch')
          ? 'derived'
          : 'unknown';

  return {
    routeFamily,
    targetStateDecision,
    capabilityDependencies,
    migrationPhase,
    prototypeStatus,
    canonicalStatus,
    mockBacked,
    deadCodeCandidate,
    layerTruth,
  };
}

function analyzeComponents(): InventoryReport {
  console.log('Initializing TypeScript project...');

  const project = new Project({
    tsConfigFilePath: path.join(FRONTEND_DIR, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  if (fs.existsSync(UI_PACKAGE_DIR)) {
    project.addSourceFilesAtPaths(path.join(UI_PACKAGE_DIR, '**/*.tsx'));
  }

  console.log('Crawling reachable AST graph from App.tsx and main.tsx...');

  const reachableFiles = new Set<string>();
  const queue = [path.join(SRC_DIR, 'main.tsx'), path.join(SRC_DIR, 'App.tsx')];

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    if (reachableFiles.has(currentPath)) continue;

    const sf = project.getSourceFile(currentPath);
    if (!sf) continue;

    reachableFiles.add(currentPath);

    sf.getImportDeclarations().forEach((imp) => {
      const resolvedSf = imp.getModuleSpecifierSourceFile();
      if (resolvedSf) {
        const resolvedPath = resolvedSf.getFilePath();
        if (isWithinRoot(resolvedPath, SRC_DIR) && !resolvedPath.includes('node_modules')) {
          queue.push(resolvedPath);
        }
      }
    });
  }

  const componentFiles = project.getSourceFiles().filter((sf) => {
    const filePath = sf.getFilePath();
    return (
      filePath.endsWith('.tsx') &&
      !filePath.includes('.test.') &&
      !filePath.includes('.stories.') &&
      !filePath.includes('node_modules') &&
      !filePath.includes('/Figma UI Files/') &&
      reachableFiles.has(filePath)
    );
  });

  console.log(`Found ${componentFiles.length} component files`);

  const components: ComponentInfo[] = [];
  const importMap = new Map<string, Set<string>>();
  const governance = getGovernanceContext();

  // First pass: collect all components
  for (const sourceFile of componentFiles) {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(FRONTEND_DIR, filePath);
    const componentName = path.basename(filePath, '.tsx');

    // Get exported names
    const exports = sourceFile.getExportedDeclarations();
    const exportNames: string[] = [];
    exports.forEach((declarations, name) => {
      exportNames.push(name);
    });

    // Count lines (excluding imports and blank lines)
    const text = sourceFile.getFullText();
    const lines = text.split('\n').filter((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('import ') && !trimmed.startsWith('//');
    });

    // Get dependencies (imported modules)
    const dependencies: string[] = [];
    sourceFile.getImportDeclarations().forEach((imp) => {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('@/')) {
        dependencies.push(moduleSpecifier);
      }
    });

    // Determine migration flags and KeralaRage KrSolidarity adoption
    const importDecls = sourceFile.getImportDeclarations();
    const usesMUI = importDecls.some((imp) => {
      const mod = imp.getModuleSpecifierValue();
      return mod.startsWith('@mui/material') || mod.startsWith('@mui/icons-material');
    });
    const usesCustomUI = importDecls.some((imp) => {
      const mod = imp.getModuleSpecifierValue();
      // local UI layer patterns
      return (
        mod.includes('/components/ui/') ||
        mod.includes('/components/shared/') ||
        mod.includes('/components/core/') ||
        mod.includes('/legacy/') ||
        mod.startsWith('../ui') ||
        mod.startsWith('./ui') ||
        mod.includes('src/components/ui/') ||
        mod.startsWith('@/components/') ||
        mod.startsWith('@/legacy/')
      );
    });

    const usesLegacyM3 =
      filePath.includes(`${path.sep}legacy${path.sep}`) ||
      importDecls.some((imp) => {
        const mod = imp.getModuleSpecifierValue();
        return mod.includes('/legacy/') || mod.includes('m3-') || mod.includes('/m3');
      }) ||
      /\bM3[A-Z]/.test(text);

    // Match explicit KR identifiers only. Avoid generic substrings like "stone"
    // triggering false positives for unrelated words such as "keystone".
    // Include both current internal archetype names and deprecated aliases so
    // migration status stays accurate during the docs-first naming transition.
    const KrSolidaritySignalPattern =
      /\b(?:KeralaRage|KrSolidarity|KrDark|Strike|Placard|Scaffold|ScaffoldInput|ScaffoldArea|March|Megaphone|Substrate|NativeAnchor|Pebble|Stone|Slab|ManifestoSlab|Signal|Lens|HaloPulses)\b|(?:\bkr-(?:leaf|flower|motif)\b)|\bpaper-white\b/i;
    const usesDesignTokens =
      KrSolidaritySignalPattern.test(text) ||
      /--(radius|elevation|duration|motion|surface|color)-/i.test(text);

    const usesModeSystem =
      text.includes('useMode') ||
      text.includes('ModeContext') ||
      text.includes("mode === 'KrDark'") ||
      text.includes('mode === "KrDark"') ||
      text.includes("mode === 'KrDark'") ||
      text.includes('mode === "KrDark"');

    const isDemo = filePath.includes('Figma UI Files');
    let migrationStatus: ComponentInfo['migrationStatus'] = 'unknown';

    // Determine migration status with KR Solidarity signal detection.
    const usesKrSolidaritySignals = usesDesignTokens || usesModeSystem;
    const usesLegacy = usesMUI || usesLegacyM3;

    if (usesKrSolidaritySignals && !usesLegacy) {
      migrationStatus = 'migrated';
    } else if (usesKrSolidaritySignals && usesLegacy) {
      migrationStatus = 'mixed';
    } else if (!usesKrSolidaritySignals && usesLegacy) {
      migrationStatus = 'not_migrated';
    }

    // Dynamic expressive detection
    const hasMotion = text.includes('framer-motion') || text.includes('motion.');
    const hasViscous = text.includes('ease-viscous') || text.includes('viscous-breeze');
    const hasSubstrate = text.includes("bg-[url('/assets/kr-solidarity");
    const isExpressiveDone = hasMotion || hasViscous || hasSubstrate;

    // Support both plain UI names and internal archetype/component names.
    const atoms = [
      'Button',
      'Card',
      'Dialog',
      'Input',
      'Textarea',
      'Select',
      'Surface',
      'Panel',
      'KeralaRageButton',
      'Strike',
      'Pebble',
      'StatusBadge',
      'Placard',
      'Stone',
      'Lens',
      'AuroraHeader',
      'ScaffoldInput',
      'ScaffoldArea',
      'March',
      'Megaphone',
      'Substrate',
      'NativeAnchor',
    ];
    const molecules = ['AssetLibrary', 'TechCard', 'EvidenceUploader'];
    const organisms = [
      'ApplicationTracker',
      'CoverLetterGenerator',
      'Login',
      'Register',
      'Dashboard',
      'DesignSidekick',
      'Documents',
      'KSCGenerator',
    ];

    let designLevel: ComponentInfo['designLevel'] = 'unknown';
    if (atoms.includes(componentName)) designLevel = 'atom';
    else if (molecules.includes(componentName)) designLevel = 'molecule';
    else if (organisms.includes(componentName)) designLevel = 'organism';

    let expressiveStatus: ComponentInfo['expressiveStatus'] = 'none';
    if (isExpressiveDone) {
      expressiveStatus = 'done';
    } else if (designLevel !== 'unknown') {
      expressiveStatus = 'planned';
    }

    const { hasTests, hasStories, hasDocs } = findRelatedFiles(filePath);
    const category = categorizeComponent(filePath);

    const governanceMetadata = getGovernanceMetadata(relativePath, componentName, governance);

    const component: ComponentInfo = {
      name: componentName,
      path: filePath,
      relativePath,
      category,
      usageCount: 0,
      importedBy: [],
      exports: exportNames,
      hasTests,
      hasStories,
      hasDocs,
      linesOfCode: lines.length,
      complexity: calculateComplexity(lines.length, dependencies.length),
      dependencies,
      isReusable:
        category === 'ui' ||
        category === 'shared' ||
        category === 'core' ||
        category === 'ui_package',
      usesMUI,
      usesCustomUI,
      usesLegacyM3,
      isDemo,
      migrationStatus,
      usesDesignTokens,
      usesModeSystem,
      expressiveStatus,
      designLevel,
      hasA11yPassed: true, // Placeholder for external CI/CD tool
      bundleImpact: 'low', // Placeholder
      visualRegression: 'pending', // Placeholder
      routeFamily: governanceMetadata.routeFamily,
      layerTruth: governanceMetadata.layerTruth,
      canonicalStatus: governanceMetadata.canonicalStatus,
      targetStateDecision: governanceMetadata.targetStateDecision,
      mockBacked: governanceMetadata.mockBacked,
      capabilityDependencies: governanceMetadata.capabilityDependencies,
      migrationPhase: governanceMetadata.migrationPhase,
      deadCodeCandidate: governanceMetadata.deadCodeCandidate,
      prototypeStatus: governanceMetadata.prototypeStatus,
    };

    components.push(component);
    importMap.set(filePath, new Set());
  }

  console.log('Analyzing imports and usage...');

  // Second pass: analyze all source files to find component usage
  const allSourceFiles = project.getSourceFiles().filter((sf) => {
    const p = sf.getFilePath();
    return !p.includes('node_modules') && !p.includes('/Figma UI Files/');
  });

  for (const sourceFile of allSourceFiles) {
    const imports = sourceFile.getImportDeclarations();

    for (const imp of imports) {
      const moduleSpecifier = imp.getModuleSpecifierValue();

      const possibleResolvedPaths: string[] = [];

      if (moduleSpecifier.startsWith('.')) {
        const currentDir = path.dirname(sourceFile.getFilePath());
        possibleResolvedPaths.push(path.resolve(currentDir, moduleSpecifier));
      } else if (moduleSpecifier.startsWith('@/')) {
        possibleResolvedPaths.push(path.join(SRC_DIR, moduleSpecifier.replace(/^@\//, '')));
      } else if (moduleSpecifier.startsWith('src/')) {
        possibleResolvedPaths.push(path.join(SRC_DIR, moduleSpecifier.replace(/^src\//, '')));
      }

      if (possibleResolvedPaths.length > 0) {
        for (const resolvedPath of possibleResolvedPaths) {
          const withExtensions = [
            resolvedPath + '.tsx',
            resolvedPath + '.ts',
            resolvedPath + '/index.tsx',
            resolvedPath + '/index.ts',
          ];

          for (const possiblePath of withExtensions) {
            const component = components.find((c) => c.path === possiblePath);
            if (component) {
              component.usageCount++;
              if (!component.importedBy.includes(sourceFile.getFilePath())) {
                component.importedBy.push(sourceFile.getFilePath());
              }
              break;
            }
          }
        }
      }
    }
  }

  console.log('Generating report...');

  // Generate statistics
  const componentsByCategory = components.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const unusedComponents = components.filter((c) => c.usageCount === 0).map((c) => c.relativePath);

  const mostUsedComponents = components
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10)
    .map((c) => ({ name: c.name, count: c.usageCount }));

  // Generate recommendations
  const recommendations: string[] = [];

  const componentsWithoutTests = components.filter((c) => !c.hasTests);
  if (componentsWithoutTests.length > 0) {
    recommendations.push(
      `${componentsWithoutTests.length} components lack test coverage. Consider adding tests for: ` +
        componentsWithoutTests
          .slice(0, 5)
          .map((c) => c.name)
          .join(', ') +
        (componentsWithoutTests.length > 5 ? '...' : '')
    );
  }

  const componentsWithoutStories = components.filter((c) => c.isReusable && !c.hasStories);
  if (componentsWithoutStories.length > 0) {
    recommendations.push(
      `${componentsWithoutStories.length} reusable components lack Storybook stories. Consider documenting: ` +
        componentsWithoutStories
          .slice(0, 5)
          .map((c) => c.name)
          .join(', ') +
        (componentsWithoutStories.length > 5 ? '...' : '')
    );
  }

  if (unusedComponents.length > 0) {
    recommendations.push(
      `${unusedComponents.length} components appear unused. Consider archiving or removing them.`
    );
  }

  const complexComponents = components.filter((c) => c.complexity === 'complex');
  if (complexComponents.length > 0) {
    recommendations.push(
      `${complexComponents.length} components are marked as complex (>200 LOC or >10 dependencies). Consider refactoring: ` +
        complexComponents
          .slice(0, 5)
          .map((c) => c.name)
          .join(', ') +
        (complexComponents.length > 5 ? '...' : '')
    );
  }

  // KeralaRage KrSolidarity specific recommendations
  const mixedComponents = components.filter((c) => c.migrationStatus === 'mixed');
  if (mixedComponents.length > 0) {
    recommendations.push(
      `${mixedComponents.length} components mix KeralaRage KrSolidarity tokens with legacy MUI/M3 usage. Consolidate to KrSolidarity-only: ` +
        mixedComponents
          .slice(0, 5)
          .map((c) => c.name)
          .join(', ') +
        (mixedComponents.length > 5 ? '...' : '')
    );
  }

  const notMigratedComponents = components.filter((c) => c.migrationStatus === 'not_migrated');
  if (notMigratedComponents.length > 0) {
    recommendations.push(
      `${notMigratedComponents.length} components still rely on legacy MUI/M3 without KrSolidarity tokens. Migrate to KeralaRage KrSolidarity: ` +
        notMigratedComponents
          .slice(0, 5)
          .map((c) => c.name)
          .join(', ') +
        (notMigratedComponents.length > 5 ? '...' : '')
    );
  }

  // Migration summary
  const migrationSummary = components.reduce(
    (acc, c) => {
      acc[c.migrationStatus] = (acc[c.migrationStatus] || 0) + 1;
      return acc;
    },
    {
      migrated: 0,
      mixed: 0,
      not_migrated: 0,
      unknown: 0,
    } as Record<'migrated' | 'mixed' | 'not_migrated' | 'unknown', number>
  );

  // KeralaRage KrSolidarity adoption metrics
  const KrSolidarityAdoption = {
    withKrSolidarityTokens: components.filter((c) => c.usesDesignTokens).length,
    withModeSystem: components.filter((c) => c.usesModeSystem).length,
    legacyMUI: components.filter((c) => c.usesMUI).length,
    legacyM3: components.filter((c) => c.usesLegacyM3).length,
    fullyKrSolidarity: components.filter((c) => c.migrationStatus === 'migrated').length,
  };

  const migratedWithoutTokens = components.filter(
    (c) => c.migrationStatus === 'migrated' && !c.usesDesignTokens
  );
  if (migratedWithoutTokens.length > 0) {
    recommendations.push(
      `${migratedWithoutTokens.length} migrated components lack KrSolidarity tokens. Add KeralaRage token classes/vars: ` +
        migratedWithoutTokens
          .slice(0, 5)
          .map((c) => c.name)
          .join(', ') +
        (migratedWithoutTokens.length > 5 ? '...' : '')
    );
  }

  const fullyKrSolidarityPercent = (
    (KrSolidarityAdoption.fullyKrSolidarity / components.length) *
    100
  ).toFixed(1);
  recommendations.push(
    `KeralaRage KrSolidarity Adoption: ${fullyKrSolidarityPercent}% (${KrSolidarityAdoption.fullyKrSolidarity}/${components.length}) fully adopted. ` +
      `Target: 80%+ for complete KrSolidarity migration.`
  );

  const routeFamiliesByDecision = components.reduce(
    (acc, component) => {
      const key = component.targetStateDecision ?? 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mockBackedLiveSurfaces = components
    .filter((c) => c.mockBacked && c.layerTruth === 'runtime')
    .map((c) => c.relativePath);
  const deadCodeCandidates = components
    .filter((c) => c.deadCodeCandidate)
    .map((c) => c.relativePath);
  const prototypeCandidates = components
    .filter(
      (c) => c.prototypeStatus === 'live_prototype' || c.prototypeStatus === 'unrouted_candidate'
    )
    .map((c) => c.relativePath);

  if (governance.unresolvedCapabilityGaps.length > 0) {
    recommendations.push(
      `Unresolved capability gaps remain: ${governance.unresolvedCapabilityGaps.slice(0, 5).join(', ')}${
        governance.unresolvedCapabilityGaps.length > 5 ? '...' : ''
      }`
    );
  }

  if (mockBackedLiveSurfaces.length > 0) {
    recommendations.push(
      `${mockBackedLiveSurfaces.length} runtime surfaces appear mock-backed and should be prioritized in the migration: ` +
        mockBackedLiveSurfaces.slice(0, 5).join(', ') +
        (mockBackedLiveSurfaces.length > 5 ? '...' : '')
    );
  }

  const report: InventoryReport = {
    generatedAt: new Date().toISOString(),
    totalComponents: components.length,
    componentsByCategory,
    components: components.sort((a, b) => a.relativePath.localeCompare(b.relativePath)),
    unusedComponents,
    mostUsedComponents,
    recommendations,
    migrationSummary,
    KrSolidarityAdoption,
    governanceSummary: {
      routeFamiliesByDecision,
      mockBackedLiveSurfaces,
      unresolvedCapabilityGaps: governance.unresolvedCapabilityGaps,
      deadCodeCandidates,
      prototypeCandidates,
    },
  };

  if (process.argv.includes('--raw')) {
    const rawInventory = components.map((c) => ({
      name: c.name,
      absolutePath: c.path,
      relativePath: c.relativePath,
      category: c.category,
    }));
    fs.writeFileSync(
      path.join(FRONTEND_DIR, 'tmp_raw_inventory.json'),
      JSON.stringify(rawInventory, null, 2)
    );
    console.log(`✅ Raw reachable inventory generated with ${rawInventory.length} components.`);
  }

  return report;
}

function main() {
  try {
    console.log('=== Component Inventory Generator ===\n');

    const report = analyzeComponents();

    const outputPath = process.argv.includes('--output')
      ? process.argv[process.argv.indexOf('--output') + 1]
      : path.join(FRONTEND_DIR, 'component-inventory.json');

    if (!process.argv.includes('--raw')) {
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    }

    console.log('\n=== Summary ===');
    console.log(`Total Components: ${report.totalComponents}`);
    console.log(`\nBy Category:`);
    Object.entries(report.componentsByCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    console.log(`\n=== KeralaRage KrSolidarity Migration Status ===`);
    console.log(`Migrated (KrSolidarity Only): ${report.migrationSummary.migrated}`);
    console.log(`Mixed (KrSolidarity + Legacy): ${report.migrationSummary.mixed}`);
    console.log(`Not Migrated (Legacy Only): ${report.migrationSummary.not_migrated}`);
    console.log(`Unknown: ${report.migrationSummary.unknown}`);

    console.log(`\n=== KrSolidarity Adoption ===`);
    console.log(
      `Components with KrSolidarity Tokens: ${report.KrSolidarityAdoption.withKrSolidarityTokens}`
    );
    console.log(`Components with Mode System: ${report.KrSolidarityAdoption.withModeSystem}`);
    console.log(`Legacy MUI Usage: ${report.KrSolidarityAdoption.legacyMUI}`);
    console.log(`Legacy M3 Usage: ${report.KrSolidarityAdoption.legacyM3}`);
    console.log(`Fully KrSolidarity: ${report.KrSolidarityAdoption.fullyKrSolidarity}`);

    console.log(`\nUnused Components: ${report.unusedComponents.length}`);
    console.log(`\nTop 5 Most Used:`);
    report.mostUsedComponents.slice(0, 5).forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} (${c.count} usages)`);
    });
    console.log(`\n=== Recommendations ===`);
    report.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    console.log(`\n✅ Report saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating component inventory:', error);
    process.exit(1);
  }
}

main();
