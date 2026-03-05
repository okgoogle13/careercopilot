#!/usr/bin/env ts-node
/**
 * Component Inventory Generator - KeralaRage KrSolidarity Edition
 *
 * This script analyzes the frontend codebase to generate an accurate inventory
 * of all components, their usage patterns, and KeralaRage KrSolidarity migration status.
 *
 * Features:
 * - Uses TypeScript AST analysis via ts-morph for accuracy
 * - Detects all import patterns (default, named, dynamic)
 * - Tracks component dependencies and KeralaRage KrSolidarity migration status
 * - Identifies test/story file coverage
 * - Categorizes components by type
 * - Analyzes KeralaRage KrSolidarity adoption (token usage, mode system, legacy usage)
 * - Generates detailed JSON report with migration recommendations
 *
 * Migration Status Detection (KeralaRage KrSolidarity):
 * - 'migrated': Uses KrSolidarity tokens/mode system, no legacy MUI/M3 dependencies
 * - 'mixed': Uses KrSolidarity tokens/mode system alongside legacy MUI/M3
 * - 'not_migrated': Uses legacy MUI/M3 without KrSolidarity tokens
 * - 'unknown': No clear KrSolidarity or legacy signals detected
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
  migrationStatus: 'migrated' | 'mixed' | 'not_migrated' | 'unknown';
  // KeralaRage KrSolidarity specific fields
  usesDesignTokens: boolean;
  usesModeSystem: boolean;
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
}

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

function analyzeComponents(): InventoryReport {
  console.log('Initializing TypeScript project...');

  const project = new Project({
    tsConfigFilePath: path.join(FRONTEND_DIR, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  if (fs.existsSync(UI_PACKAGE_DIR)) {
    project.addSourceFilesAtPaths(path.join(UI_PACKAGE_DIR, '**/*.tsx'));
  }

  console.log('Analyzing components...');

  const componentFiles = project.getSourceFiles().filter((sf) => {
    const filePath = sf.getFilePath();
    return (
      filePath.endsWith('.tsx') &&
      !filePath.includes('.test.') &&
      !filePath.includes('.stories.') &&
      !filePath.includes('node_modules') &&
      !filePath.includes('/Figma UI Files/') &&
      COMPONENT_ROOTS.some((root) => isWithinRoot(filePath, root))
    );
  });

  console.log(`Found ${componentFiles.length} component files`);

  const components: ComponentInfo[] = [];
  const importMap = new Map<string, Set<string>>();

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

    const KrSolidarityTokenPattern =
      /(wattle|[DEPRECATED_STYLE]|kr-leaf|flannel|paper-white|kr-motif|pebble|stone|KeralaRage|KrSolidarity|kr-flower|bottlebrush|gum|fern|sentry|KrDark|KrDark|slate)/i;
    const usesDesignTokens =
      KrSolidarityTokenPattern.test(text) ||
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

    // Determine migration status with KeralaRage KrSolidarity detection
    const usesKrSolidaritySignals = usesDesignTokens || usesModeSystem;
    const usesLegacy = usesMUI || usesLegacyM3;

    if (usesKrSolidaritySignals && !usesLegacy) {
      migrationStatus = 'migrated';
    } else if (usesKrSolidaritySignals && usesLegacy) {
      migrationStatus = 'mixed';
    } else if (!usesKrSolidaritySignals && usesLegacy) {
      migrationStatus = 'not_migrated';
    }

    const { hasTests, hasStories, hasDocs } = findRelatedFiles(filePath);
    const category = categorizeComponent(filePath);

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
  };

  return report;
}

function main() {
  try {
    console.log('=== Component Inventory Generator ===\n');

    const report = analyzeComponents();

    const outputPath = process.argv.includes('--output')
      ? process.argv[process.argv.indexOf('--output') + 1]
      : path.join(FRONTEND_DIR, 'component-inventory.json');

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

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
