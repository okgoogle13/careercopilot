#!/usr/bin/env node
/**
 * Fix component imports to use aliased names (without Electric prefix)
 */

import fs from 'fs';
import path from 'path';

const componentRenamings = [
  // Electric components
  ['ElectricBadge', 'Badge'],
  ['ElectricButton', 'Button'],
  ['ElectricCheckbox', 'Checkbox'],
  ['ElectricDivider', 'Divider'],
  ['ElectricInput', 'Input'],
  ['ElectricProgress', 'Progress'],
  ['ElectricRadioGroup', 'RadioGroup'],
  ['ElectricSearchInput', 'SearchInput'],
  ['ElectricSelect', 'Select'],
  ['ElectricSkeleton', 'Skeleton'],
  ['ElectricSlider', 'Slider'],
  ['ElectricSwitch', 'Switch'],
  ['ElectricTextarea', 'Textarea'],
  ['ElectricAlert', 'Alert'],
  ['ElectricBreadcrumb', 'Breadcrumb'],
  ['ElectricCard', 'Card'],
  ['ElectricContainer', 'Container'],
  ['ElectricDialog', 'Dialog'],
  ['ElectricDrawer', 'Drawer'],
  ['ElectricEmptyState', 'EmptyState'],
  ['ElectricGrid', 'Grid'],
  ['ElectricTabs', 'Tabs'],
  ['ElectricAvatar', 'Avatar'],
  ['ElectricDatePicker', 'DatePicker'],
  ['ElectricPagination', 'Pagination'],
  ['ElectricPopover', 'Popover'],
  ['ElectricTable', 'Table'],
  ['ElectricTableHeader', 'TableHeader'],
  ['ElectricTableBody', 'TableBody'],
  ['ElectricTableRow', 'TableRow'],
  ['ElectricTableHead', 'TableHead'],
  ['ElectricTableCell', 'TableCell'],
  ['ElectricTooltip', 'Tooltip'],
];

function fixImports(content) {
  let result = content;

  for (const [oldName, newName] of componentRenamings) {
    // Fix named imports: { ElectricButton } -> { Button }
    // But keep it backward compatible - support both
    // Replace: import { ElectricButton, ... } from '@/components/electric'
    // With: import { Button, ... } from '@/components/electric'

    // Handle various import patterns
    result = result.replace(new RegExp(`\\b${oldName}\\b(?=\\s*[,}])`, 'g'), newName);
  }

  return result;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixImports(content);

    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }

  return false;
}

function processDirectory(dir) {
  let fixedCount = 0;

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        if (!['node_modules', '.next', 'dist', 'build', '.git', '_backup'].includes(file.name)) {
          fixedCount += processDirectory(fullPath);
        }
      } else if (file.name.match(/\.(tsx|jsx)$/)) {
        if (processFile(fullPath)) {
          fixedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }

  return fixedCount;
}

const frontendDir = '/Applications/careercopilot/frontend/src';
console.log('Fixing component imports to use aliased names...\n');
const count = processDirectory(frontendDir);
console.log(`\n✅ Updated ${count} files`);
