#!/usr/bin/env ts-node
/**
 * Component Inventory Generator - Material Design 3 Expressive Edition
 *
 * This script analyzes the frontend codebase to generate an accurate inventory
 * of all components, their usage patterns, and Material Design 3 (Expressive) migration status.
 *
 * Features:
 * - Uses TypeScript AST analysis via ts-morph for accuracy
 * - Detects all import patterns (default, named, dynamic)
 * - Tracks component dependencies and M3 migration status
 * - Identifies test/story file coverage
 * - Categorizes components by type
 * - Analyzes M3 Expressive adoption (design tokens, theme provider, MUI components)
 * - Generates detailed JSON report with migration recommendations
 *
 * Migration Status Detection:
 * - 'migrated': Uses MUI components only (no custom UI wrapper components)
 * - 'mixed': Uses both MUI and custom UI components (needs consolidation)
 * - 'not_migrated': Uses only custom UI components (needs M3 migration)
 * - 'expressive': Fully adopted M3 Expressive with design tokens
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
  category: 'ui' | 'features' | 'layout' | 'library' | 'documents' | 'main' | 'other';
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
  isDemo: boolean;
  migrationStatus: 'migrated' | 'mixed' | 'not_migrated' | 'expressive' | 'unknown';
  // M3 Expressive specific fields
  usesDesignTokens: boolean;
  usesThemeProvider: boolean;
  usesM3Components: boolean;
}

interface InventoryReport {
  generatedAt: string;
  totalComponents: number;
  componentsByCategory: Record<string, number>;
  components: ComponentInfo[];
  unusedComponents: string[];
  mostUsedComponents: Array<{ name: string; count: number }>;
  recommendations: string[];
  migrationSummary: Record<'migrated' | 'mixed' | 'not_migrated' | 'expressive' | 'unknown', number>;
  m3ExpressiveAdoption: {
    withDesignTokens: number;
    withThemeProvider: number;
    withM3Components: number;
    fullyExpressive: number;
  };
}

const FRONTEND_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

function categorizeComponent(filePath: string): ComponentInfo['category'] {
  const relativePath = path.relative(COMPONENTS_DIR, filePath);

  if (relativePath.startsWith('ui/') || relativePath.startsWith('ui\\')) {
    return 'ui';
  } else if (relativePath.startsWith('features/') || relativePath.startsWith('features\\')) {
    return 'features';
  } else if (relativePath.startsWith('layout/') || relativePath.startsWith('layout\\')) {
    return 'layout';
  } else if (relativePath.startsWith('library/') || relativePath.startsWith('library\\')) {
    return 'library';
  } else if (relativePath.startsWith('documents/') || relativePath.startsWith('documents\\') ||
             relativePath.startsWith('document/') || relativePath.startsWith('document\\')) {
    return 'documents';
  } else if (relativePath.startsWith('main/') || relativePath.startsWith('main\\')) {
    return 'main';
  }

  return 'other';
}

function calculateComplexity(linesOfCode: number, dependencies: number): ComponentInfo['complexity'] {
  if (linesOfCode < 50 && dependencies < 3) return 'simple';
  if (linesOfCode < 200 && dependencies < 10) return 'medium';
  return 'complex';
}

function findRelatedFiles(componentPath: string): { hasTests: boolean; hasStories: boolean; hasDocs: boolean } {
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

  const docPatterns = [
    path.join(dir, `${baseName}.md`),
    path.join(dir, 'README.md'),
  ];

  return {
    hasTests: testPatterns.some(p => fs.existsSync(p)),
    hasStories: storyPatterns.some(p => fs.existsSync(p)),
    hasDocs: docPatterns.some(p => fs.existsSync(p)),
  };
}

function analyzeComponents(): InventoryReport {
  console.log('Initializing TypeScript project...');

  const project = new Project({
    tsConfigFilePath: path.join(FRONTEND_DIR, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });

  console.log('Analyzing components...');

  const componentFiles = project.getSourceFiles()
    .filter(sf => {
      const filePath = sf.getFilePath();
      return filePath.includes('/components/') &&
             filePath.endsWith('.tsx') &&
             !filePath.includes('.test.') &&
             !filePath.includes('.stories.') &&
             !filePath.includes('node_modules') &&
             !filePath.includes('/Figma UI Files/');
    });

  console.log(`Found ${componentFiles.length} component files`);

  const components: ComponentInfo[] = [];
  const importMap = new Map<string, Set<string>>();

  // First pass: collect all components
  for (const sourceFile of componentFiles) {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(SRC_DIR, filePath);
    const componentName = path.basename(filePath, '.tsx');

    // Get exported names
    const exports = sourceFile.getExportedDeclarations();
    const exportNames: string[] = [];
    exports.forEach((declarations, name) => {
      exportNames.push(name);
    });

    // Count lines (excluding imports and blank lines)
    const text = sourceFile.getFullText();
    const lines = text.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('import ') && !trimmed.startsWith('//');
    });

    // Get dependencies (imported modules)
    const dependencies: string[] = [];
    sourceFile.getImportDeclarations().forEach(imp => {
      const moduleSpecifier = imp.getModuleSpecifierValue();
      if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('@/')) {
        dependencies.push(moduleSpecifier);
      }
    });

    // Determine migration flags and M3 Expressive adoption
    const importDecls = sourceFile.getImportDeclarations();
    const usesMUI = importDecls.some(imp => {
      const mod = imp.getModuleSpecifierValue();
      return mod.startsWith('@mui/material') || mod.startsWith('@mui/icons-material');
    });
    const usesCustomUI = importDecls.some(imp => {
      const mod = imp.getModuleSpecifierValue();
      // local UI layer patterns
      return mod.includes('/components/ui/') || mod.startsWith('../ui') || mod.startsWith('./ui') || mod.includes('src/components/ui/');
    });

    // M3 Expressive feature detection
    const usesDesignTokens = text.includes('var(--') || text.includes('theme.palette') || text.includes('theme.spacing');
    const usesThemeProvider = importDecls.some(imp => {
      const mod = imp.getModuleSpecifierValue();
      return mod.includes('@mui/material/styles') || mod.includes('ThemeProvider');
    }) || text.includes('useTheme()') || text.includes('useTheme(');
    const usesM3Components = importDecls.some(imp => {
      const mod = imp.getModuleSpecifierValue();
      // Check for common M3 components
      return mod.includes('@mui/material/') && (
        mod.includes('Card') || mod.includes('Button') || mod.includes('TextField') ||
        mod.includes('Dialog') || mod.includes('AppBar') || mod.includes('Chip')
      );
    });

    const isDemo = filePath.includes('Figma UI Files');
    let migrationStatus: ComponentInfo['migrationStatus'] = 'unknown';

    // Determine migration status with M3 Expressive detection
    if (usesMUI && !usesCustomUI && usesDesignTokens && usesThemeProvider) {
      migrationStatus = 'expressive'; // Fully adopted M3 Expressive
    } else if (usesMUI && !usesCustomUI) {
      migrationStatus = 'migrated'; // Uses MUI but may not fully use design tokens
    } else if (usesMUI && usesCustomUI) {
      migrationStatus = 'mixed'; // Mixed usage, needs consolidation
    } else if (!usesMUI && usesCustomUI) {
      migrationStatus = 'not_migrated'; // Still using custom UI only
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
      isReusable: category === 'ui' || category === 'library',
      usesMUI,
      usesCustomUI,
      isDemo,
      migrationStatus,
      usesDesignTokens,
      usesThemeProvider,
      usesM3Components,
    };

    components.push(component);
    importMap.set(filePath, new Set());
  }

  console.log('Analyzing imports and usage...');

  // Second pass: analyze all source files to find component usage
  const allSourceFiles = project.getSourceFiles()
    .filter(sf => {
      const p = sf.getFilePath();
      return !p.includes('node_modules') && !p.includes('/Figma UI Files/');
    });

  for (const sourceFile of allSourceFiles) {
    const imports = sourceFile.getImportDeclarations();

    for (const imp of imports) {
      const moduleSpecifier = imp.getModuleSpecifierValue();

      // Resolve relative imports
      if (moduleSpecifier.startsWith('.')) {
        const currentDir = path.dirname(sourceFile.getFilePath());
        const resolvedPath = path.resolve(currentDir, moduleSpecifier);

        // Try with extensions
        const possiblePaths = [
          resolvedPath + '.tsx',
          resolvedPath + '.ts',
          resolvedPath + '/index.tsx',
          resolvedPath + '/index.ts',
        ];

        for (const possiblePath of possiblePaths) {
          const component = components.find(c => c.path === possiblePath);
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

  console.log('Generating report...');

  // Generate statistics
  const componentsByCategory = components.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const unusedComponents = components
    .filter(c => c.usageCount === 0)
    .map(c => c.relativePath);

  const mostUsedComponents = components
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10)
    .map(c => ({ name: c.name, count: c.usageCount }));

  // Generate recommendations
  const recommendations: string[] = [];

  const componentsWithoutTests = components.filter(c => !c.hasTests);
  if (componentsWithoutTests.length > 0) {
    recommendations.push(
      `${componentsWithoutTests.length} components lack test coverage. Consider adding tests for: ` +
      componentsWithoutTests.slice(0, 5).map(c => c.name).join(', ') +
      (componentsWithoutTests.length > 5 ? '...' : '')
    );
  }

  const componentsWithoutStories = components.filter(c => c.isReusable && !c.hasStories);
  if (componentsWithoutStories.length > 0) {
    recommendations.push(
      `${componentsWithoutStories.length} reusable components lack Storybook stories. Consider documenting: ` +
      componentsWithoutStories.slice(0, 5).map(c => c.name).join(', ') +
      (componentsWithoutStories.length > 5 ? '...' : '')
    );
  }

  if (unusedComponents.length > 0) {
    recommendations.push(
      `${unusedComponents.length} components appear unused. Consider archiving or removing them.`
    );
  }

  const complexComponents = components.filter(c => c.complexity === 'complex');
  if (complexComponents.length > 0) {
    recommendations.push(
      `${complexComponents.length} components are marked as complex (>200 LOC or >10 dependencies). Consider refactoring: ` +
      complexComponents.slice(0, 5).map(c => c.name).join(', ') +
      (complexComponents.length > 5 ? '...' : '')
    );
  }

  // M3 Expressive specific recommendations
  const mixedComponents = components.filter(c => c.migrationStatus === 'mixed');
  if (mixedComponents.length > 0) {
    recommendations.push(
      `${mixedComponents.length} components have mixed MUI/custom UI usage. Consolidate to pure MUI for M3 consistency: ` +
      mixedComponents.slice(0, 5).map(c => c.name).join(', ') +
      (mixedComponents.length > 5 ? '...' : '')
    );
  }

  const notMigratedComponents = components.filter(c => c.migrationStatus === 'not_migrated');
  if (notMigratedComponents.length > 0) {
    recommendations.push(
      `${notMigratedComponents.length} components still use custom UI only. Migrate to Material UI components: ` +
      notMigratedComponents.slice(0, 5).map(c => c.name).join(', ') +
      (notMigratedComponents.length > 5 ? '...' : '')
    );
  }

  // Migration summary
  const migrationSummary = components.reduce((acc, c) => {
    acc[c.migrationStatus] = (acc[c.migrationStatus] || 0) + 1;
    return acc;
  }, {
    migrated: 0,
    mixed: 0,
    not_migrated: 0,
    expressive: 0,
    unknown: 0,
  } as Record<'migrated' | 'mixed' | 'not_migrated' | 'expressive' | 'unknown', number>);

  // M3 Expressive adoption metrics
  const m3ExpressiveAdoption = {
    withDesignTokens: components.filter(c => c.usesDesignTokens).length,
    withThemeProvider: components.filter(c => c.usesThemeProvider).length,
    withM3Components: components.filter(c => c.usesM3Components).length,
    fullyExpressive: components.filter(c => c.migrationStatus === 'expressive').length,
  };

  const migratedWithoutTokens = components.filter(c => c.migrationStatus === 'migrated' && !c.usesDesignTokens);
  if (migratedWithoutTokens.length > 0) {
    recommendations.push(
      `${migratedWithoutTokens.length} migrated components don't use design tokens. Adopt M3 Expressive theming: ` +
      migratedWithoutTokens.slice(0, 5).map(c => c.name).join(', ') +
      (migratedWithoutTokens.length > 5 ? '...' : '')
    );
  }

  const fullyExpressivePercent = ((m3ExpressiveAdoption.fullyExpressive / components.length) * 100).toFixed(1);
  recommendations.push(
    `M3 Expressive Adoption: ${fullyExpressivePercent}% (${m3ExpressiveAdoption.fullyExpressive}/${components.length}) fully adopted. ` +
    `Target: 80%+ for complete M3 Expressive migration.`
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
    m3ExpressiveAdoption,
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

    console.log(`\n=== M3 Migration Status ===`);
    console.log(`Expressive (Fully Adopted): ${report.migrationSummary.expressive}`);
    console.log(`Migrated (MUI Only): ${report.migrationSummary.migrated}`);
    console.log(`Mixed (MUI + Custom UI): ${report.migrationSummary.mixed}`);
    console.log(`Not Migrated (Custom UI Only): ${report.migrationSummary.not_migrated}`);
    console.log(`Unknown: ${report.migrationSummary.unknown}`);

    console.log(`\n=== M3 Expressive Adoption ===`);
    console.log(`Components with Design Tokens: ${report.m3ExpressiveAdoption.withDesignTokens}`);
    console.log(`Components with Theme Provider: ${report.m3ExpressiveAdoption.withThemeProvider}`);
    console.log(`Components with M3 Components: ${report.m3ExpressiveAdoption.withM3Components}`);
    console.log(`Fully Expressive: ${report.m3ExpressiveAdoption.fullyExpressive}`);

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
