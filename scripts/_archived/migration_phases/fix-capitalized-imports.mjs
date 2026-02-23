#!/usr/bin/env node
/**
 * Fix capitalized electric component imports
 * Changes @/components/electric/Badge -> @/components/electric
 */

import fs from 'fs';
import path from 'path';

function fixCapitalizedImports(content) {
  let result = content;

  // List of electric components that might be imported with capitalization
  const electricComponents = [
    'Badge', 'Button', 'Checkbox', 'Divider', 'Input', 'Progress', 'RadioGroup',
    'SearchInput', 'Select', 'Skeleton', 'Slider', 'Switch', 'Textarea',
    'Alert', 'Breadcrumb', 'Card', 'Container', 'Dialog', 'Drawer',
    'EmptyState', 'Grid', 'Tabs', 'Avatar', 'DatePicker', 'Pagination',
    'Popover', 'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead',
    'TableCell', 'Tooltip',
    // Custom/M3 that were mistakenly put in electric
    'Separator', 'PageHeader', 'ATSScoreCircle', 'TimelineView', 'ElectricCard'
  ];

  for (const comp of electricComponents) {
    // Fix direct imports from electric/ComponentName
    result = result.replace(
      new RegExp(`from\\s+['"]@/components/electric/${comp}['"]`, 'g'),
      "from '@/components/electric'"
    );
  }

  // Also handle cases where component is imported with full path like ElectricCard
  result = result.replace(
    /from\s+['"]@\/components\/electric\/ElectricCard['"]/g,
    "from '@/components/electric'"
  );

  return result;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = fixCapitalizedImports(content);

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
console.log('Fixing capitalized electric component imports...\n');
const count = processDirectory(frontendDir);
console.log(`\n✅ Updated ${count} files`);
