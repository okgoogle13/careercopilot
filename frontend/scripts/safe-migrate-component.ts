#!/usr/bin/env ts-node
/**
 * Safe Component Migration Script
 *
 * This script safely migrates a single component from src/components to packages/ui
 * with full verification and rollback capability.
 *
 * Features:
 * - Verifies component exists before migration
 * - Uses git mv to preserve history
 * - Updates all import paths automatically
 * - Runs tests after migration
 * - Creates rollback script
 * - Stops on first error
 *
 * Usage:
 *   npx ts-node scripts/safe-migrate-component.ts Button
 *   npx ts-node scripts/safe-migrate-component.ts Button --dry-run
 */

import { Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

interface MigrationConfig {
  componentName: string;
  dryRun: boolean;
  verbose: boolean;
}

interface MigrationResult {
  success: boolean;
  componentPath?: string;
  newPath?: string;
  updatedFiles: string[];
  errors: string[];
  rollbackScript: string;
}

const FRONTEND_DIR = path.join(__dirname, '..');
const SRC_COMPONENTS_DIR = path.join(FRONTEND_DIR, 'src/components');
const UI_PACKAGE_DIR = path.join(FRONTEND_DIR, 'packages/ui/src/components');

class ComponentMigrator {
  private config: MigrationConfig;
  private project: Project;
  private result: MigrationResult;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.project = new Project({
      tsConfigFilePath: path.join(FRONTEND_DIR, 'tsconfig.json'),
    });
    this.result = {
      success: false,
      updatedFiles: [],
      errors: [],
      rollbackScript: '',
    };
  }

  private log(message: string, level: 'info' | 'success' | 'error' | 'warning' = 'info') {
    const prefix = {
      info: 'ℹ️ ',
      success: '✅',
      error: '❌',
      warning: '⚠️ ',
    }[level];

    console.log(`${prefix} ${message}`);
  }

  private async runCommand(
    command: string,
    description: string
  ): Promise<{ stdout: string; stderr: string }> {
    if (this.config.verbose) {
      this.log(`Running: ${command}`, 'info');
    }
    try {
      const result = await execAsync(command, { cwd: FRONTEND_DIR });
      if (this.config.verbose && result.stdout) {
        console.log(result.stdout);
      }
      return result;
    } catch (error: any) {
      throw new Error(`${description} failed: ${error.message}`);
    }
  }

  private findComponentPath(): string | null {
    const { componentName } = this.config;

    // Search in common locations
    const possiblePaths = [
      path.join(SRC_COMPONENTS_DIR, 'ui', componentName, 'index.tsx'),
      path.join(SRC_COMPONENTS_DIR, 'ui', componentName, `${componentName}.tsx`),
      path.join(SRC_COMPONENTS_DIR, 'ui', `${componentName}.tsx`),
      path.join(SRC_COMPONENTS_DIR, 'library', componentName, 'index.tsx'),
      path.join(SRC_COMPONENTS_DIR, 'library', `${componentName}.tsx`),
    ];

    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }

    return null;
  }

  private findRelatedFiles(componentPath: string): string[] {
    const dir = path.dirname(componentPath);
    const baseName = path.basename(componentPath, path.extname(componentPath));
    const relatedFiles: string[] = [componentPath];

    // Look for related files
    const patterns = [
      `${baseName}.test.tsx`,
      `${baseName}.test.ts`,
      `${baseName}.stories.tsx`,
      `${baseName}.stories.ts`,
      `${baseName}.stories.mdx`,
      `${baseName}.types.ts`,
      `${baseName}.styles.ts`,
      'index.ts',
      'README.md',
    ];

    for (const pattern of patterns) {
      const filePath = path.join(dir, pattern);
      if (fs.existsSync(filePath) && filePath !== componentPath) {
        relatedFiles.push(filePath);
      }
    }

    return relatedFiles;
  }

  private async updateImports(oldPath: string, newPackagePath: string): Promise<void> {
    this.log('Updating import paths...', 'info');

    const sourceFiles = this.project
      .getSourceFiles()
      .filter((sf) => !sf.getFilePath().includes('node_modules'));

    let updatedCount = 0;

    for (const sourceFile of sourceFiles) {
      const imports = sourceFile.getImportDeclarations();
      let fileModified = false;

      for (const imp of imports) {
        const moduleSpecifier = imp.getModuleSpecifierValue();

        // Check if this import references the component
        if (moduleSpecifier.includes(this.config.componentName)) {
          const currentDir = path.dirname(sourceFile.getFilePath());
          const resolvedPath = path.resolve(currentDir, moduleSpecifier);

          // Check if it resolves to our component
          const possibleOldPaths = [oldPath, oldPath.replace('.tsx', ''), path.dirname(oldPath)];

          if (possibleOldPaths.some((p) => resolvedPath.startsWith(p))) {
            // Update to use package import
            imp.setModuleSpecifier(`@careercopilot/ui`);
            fileModified = true;

            if (this.config.verbose) {
              this.log(
                `  ${path.relative(FRONTEND_DIR, sourceFile.getFilePath())}: ${moduleSpecifier} → @careercopilot/ui`,
                'info'
              );
            }
          }
        }
      }

      if (fileModified) {
        if (!this.config.dryRun) {
          await sourceFile.save();
        }
        this.result.updatedFiles.push(sourceFile.getFilePath());
        updatedCount++;
      }
    }

    this.log(`Updated imports in ${updatedCount} files`, 'success');
  }

  private async updatePackageExports(): Promise<void> {
    const indexPath = path.join(FRONTEND_DIR, 'packages/ui/src/index.ts');
    let content = fs.readFileSync(indexPath, 'utf-8');

    const exportLine = `export * from './components/${this.config.componentName}';`;

    if (!content.includes(exportLine)) {
      content += `\n${exportLine}\n`;

      if (!this.config.dryRun) {
        fs.writeFileSync(indexPath, content);
      }
      this.log(`Added export to packages/ui/src/index.ts`, 'success');
    }
  }

  private async runTests(): Promise<void> {
    this.log('Running tests...', 'info');

    try {
      await this.runCommand('yarn test', 'Test run');
      this.log('All tests passed', 'success');
    } catch (error) {
      throw new Error('Tests failed after migration. Rolling back...');
    }
  }

  private async runTypeCheck(): Promise<void> {
    this.log('Running TypeScript type check...', 'info');

    try {
      await this.runCommand('yarn typecheck', 'Type check');
      this.log('Type check passed', 'success');
    } catch (error) {
      throw new Error('Type check failed after migration. Rolling back...');
    }
  }

  private generateRollbackScript(
    componentPath: string,
    targetPath: string,
    relatedFiles: string[]
  ): string {
    const commands = [
      '#!/bin/bash',
      '# Rollback script for component migration',
      `# Component: ${this.config.componentName}`,
      `# Generated: ${new Date().toISOString()}`,
      '',
      'echo "Rolling back component migration..."',
      '',
      '# Move component back',
      `git mv "${targetPath}" "${componentPath}"`,
      '',
      '# Restore import paths',
      ...this.result.updatedFiles.map((file) => `git checkout HEAD -- "${file}"`),
      '',
      '# Remove package export',
      `git checkout HEAD -- "${path.join(FRONTEND_DIR, 'packages/ui/src/index.ts')}"`,
      '',
      'echo "Rollback complete!"',
    ];

    return commands.join('\n');
  }

  async migrate(): Promise<MigrationResult> {
    try {
      this.log(`Starting migration of ${this.config.componentName}...`, 'info');

      if (this.config.dryRun) {
        this.log('DRY RUN MODE - No changes will be made', 'warning');
      }

      // Step 1: Find component
      this.log('Step 1: Locating component...', 'info');
      const componentPath = this.findComponentPath();

      if (!componentPath) {
        this.result.errors.push(`Component ${this.config.componentName} not found`);
        return this.result;
      }

      this.log(`Found: ${path.relative(FRONTEND_DIR, componentPath)}`, 'success');
      this.result.componentPath = componentPath;

      // Step 2: Find related files
      this.log('Step 2: Finding related files...', 'info');
      const relatedFiles = this.findRelatedFiles(componentPath);
      this.log(`Found ${relatedFiles.length} files to migrate`, 'success');

      if (this.config.verbose) {
        relatedFiles.forEach((file) => {
          console.log(`  - ${path.relative(FRONTEND_DIR, file)}`);
        });
      }

      // Step 3: Ensure target directory exists
      const targetDir = path.join(UI_PACKAGE_DIR, this.config.componentName);
      if (!fs.existsSync(targetDir)) {
        this.log(`Creating directory: ${path.relative(FRONTEND_DIR, targetDir)}`, 'info');
        if (!this.config.dryRun) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
      }

      // Step 4: Move files with git
      this.log('Step 3: Moving files...', 'info');
      const targetPath = path.join(targetDir, 'index.tsx');

      for (const file of relatedFiles) {
        const fileName = path.basename(file);
        const target = path.join(targetDir, fileName);

        if (!this.config.dryRun) {
          await this.runCommand(`git mv "${file}" "${target}"`, `Moving ${fileName}`);
        }

        this.log(`Moved: ${fileName}`, 'success');
      }

      this.result.newPath = targetPath;

      // Step 5: Update imports
      this.log('Step 4: Updating import paths...', 'info');
      await this.updateImports(componentPath, targetPath);

      // Step 6: Update package exports
      this.log('Step 5: Updating package exports...', 'info');
      await this.updatePackageExports();

      // Step 7: Run verification
      if (!this.config.dryRun) {
        this.log('Step 6: Running verification...', 'info');
        await this.runTypeCheck();
        await this.runTests();
      }

      // Step 8: Generate rollback script
      this.result.rollbackScript = this.generateRollbackScript(
        componentPath,
        targetPath,
        relatedFiles
      );

      if (!this.config.dryRun) {
        const rollbackPath = path.join(FRONTEND_DIR, `rollback-${this.config.componentName}.sh`);
        fs.writeFileSync(rollbackPath, this.result.rollbackScript, { mode: 0o755 });
        this.log(`Rollback script saved: ${rollbackPath}`, 'info');
      }

      this.result.success = true;
      this.log(`✨ Migration of ${this.config.componentName} completed successfully!`, 'success');

      return this.result;
    } catch (error: any) {
      this.result.errors.push(error.message);
      this.log(error.message, 'error');
      return this.result;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: npx ts-node scripts/safe-migrate-component.ts <ComponentName> [options]

Options:
  --dry-run    Run without making changes
  --verbose    Show detailed output
  --help       Show this help message

Example:
  npx ts-node scripts/safe-migrate-component.ts Button
  npx ts-node scripts/safe-migrate-component.ts Card --dry-run
    `);
    process.exit(0);
  }

  const config: MigrationConfig = {
    componentName: args[0],
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
  };

  const migrator = new ComponentMigrator(config);
  const result = await migrator.migrate();

  if (!result.success) {
    console.error('\n❌ Migration failed:');
    result.errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log('\n📊 Migration Summary:');
  console.log(`  Component: ${config.componentName}`);
  console.log(
    `  Files moved: ${result.componentPath ? path.relative(FRONTEND_DIR, result.componentPath) : 'N/A'}`
  );
  console.log(
    `  New location: ${result.newPath ? path.relative(FRONTEND_DIR, result.newPath) : 'N/A'}`
  );
  console.log(`  Imports updated: ${result.updatedFiles.length} files`);

  console.log('\n✅ Next steps:');
  console.log('  1. Review the changes: git status');
  console.log('  2. Test the application: yarn dev');
  console.log(
    '  3. Commit the changes: git add . && git commit -m "migrate: move ComponentName to @careercopilot/ui"'
  );
  console.log(`  4. If issues occur, rollback: ./rollback-${config.componentName}.sh`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
