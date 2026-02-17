#!/usr/bin/env node
/**
 * Comprehensive JSX tag fixer
 * Handles both opening and closing tags to match
 */

import fs from 'fs';
import path from 'path';

function fixAllMismatchedTags(content) {
  let result = content;

  // Map of opening tags to their correct closing tags
  const tagMaps = [
    // Electric components - ensure matching
    ['ElectricButton', 'Button'],
    ['ElectricCard', 'Card'],
    ['ElectricAlert', 'Alert'],
    ['ElectricContainer', 'Container'],
    ['ElectricDialog', 'Dialog'],
    ['ElectricTabs', 'Tabs'],
    ['ElectricBreadcrumb', 'Breadcrumb'],
    ['ElectricDrawer', 'Drawer'],
    ['ElectricPopover', 'Popover'],
    ['ElectricTooltip', 'Tooltip'],
    ['ElectricInput', 'Input'],
    ['ElectricSelect', 'Select'],
    ['ElectricCheckbox', 'Checkbox'],
    ['ElectricSwitch', 'Switch'],
    ['ElectricRadioGroup', 'RadioGroup'],
    ['ElectricSlider', 'Slider'],
    ['ElectricProgress', 'Progress'],
    ['ElectricSkeleton', 'Skeleton'],
    ['ElectricAvatar', 'Avatar'],
    ['ElectricBadge', 'Badge'],
    ['ElectricPagination', 'Pagination'],
    ['ElectricDivider', 'Divider'],
    ['ElectricEmptyState', 'EmptyState'],
    ['ElectricGrid', 'Grid'],
    ['ElectricDatePicker', 'DatePicker'],
    ['ElectricSearchInput', 'SearchInput'],
    ['ElectricTextarea', 'Textarea'],
    ['ElectricTable', 'Table'],
    ['ElectricTableHeader', 'TableHeader'],
    ['ElectricTableBody', 'TableBody'],
    ['ElectricTableRow', 'TableRow'],
    ['ElectricTableHead', 'TableHead'],
    ['ElectricTableCell', 'TableCell'],
  ];

  for (const [oldName, newName] of tagMaps) {
    // Fix opening tags: <ElectricButton...> -> <Button...>
    result = result.replace(new RegExp(`<${oldName}([\\s>])`, 'g'), `<${newName}$1`);

    // Fix closing tags: </ElectricButton> -> </Button>
    result = result.replace(new RegExp(`</${oldName}>`, 'g'), `</${newName}>`);

    // Fix self-closing: <ElectricButton.../> -> <Button.../>
    result = result.replace(new RegExp(`<${oldName}\\s`, 'g'), `<${newName} `);
  }

  return result;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixAllMismatchedTags(content);

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
        if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file.name)) {
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
console.log('Comprehensive JSX tag fixing...\n');
const count = processDirectory(frontendDir);
console.log(`\n✅ Fixed ${count} files`);
