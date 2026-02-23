#!/usr/bin/env node
/**
 * Fix remaining @/components/ui imports
 * Updates generic ui imports to @/components (for re-exports from electric, m3-expressive, custom)
 */

import fs from 'fs';
import path from 'path';

function fixRemainingImports(content) {
  let result = content;

  // Replace generic @/components/ui imports with @/components
  // This works because we have root barrel exports now
  result = result.replace(/from\s+['"]@\/components\/ui['"]/g, "from '@/components'");

  // Also fix @/components/design-system imports (point to @/components for consolidation)
  result = result.replace(/from\s+['"]@\/components\/design-system['"]/g, "from '@/components'");

  // Fix specific paths like @/components/design-system/Badge -> @/components
  result = result.replace(/from\s+['"]@\/components\/design-system\/(\w+)['"]/g, "from '@/components/electric/$1'");
  result = result.replace(/from\s+['"]@\/components\/design-system\/Button\/Button['"]/g, "from '@/components/electric/button'");
  result = result.replace(/from\s+['"]@\/components\/electric\/Button\/Button['"]/g, "from '@/components/electric/button'");
  result = result.replace(/from\s+['"]@\/components\/electric\/Select['"]/g, "from '@/components/electric/select'");

  return result;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = fixRemainingImports(content);

    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`✗ Error processing ${filePath}: ${error.message}`);
    }
  }

  return false;
}

function processDirectory(dir) {
  let updatedCount = 0;

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        if (!['node_modules', '.next', 'dist', 'build', '.git', '_backup', 'coverage'].includes(file.name)) {
          updatedCount += processDirectory(fullPath);
        }
      } else if (file.name.match(/\.(tsx|jsx|ts|js)$/) && !file.name.endsWith('.d.ts')) {
        if (processFile(fullPath)) {
          updatedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }

  return updatedCount;
}

const frontendDir = '/Applications/careercopilot/frontend/src';
console.log('Fixing remaining import paths...\n');
const count = processDirectory(frontendDir);
console.log(`\n✅ Updated ${count} files`);
