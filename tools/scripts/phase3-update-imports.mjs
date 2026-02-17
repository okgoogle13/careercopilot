#!/usr/bin/env node
/**
 * Phase 3: Update Import Paths
 * Updates all imports from old paths to new consolidated paths
 */

import fs from 'fs';
import path from 'path';

// Mapping of old import paths to new paths
const importMappings = [
  // M3 components: @/components/ui/M3X -> @/components/m3-expressive/x-name
  { regex: /from\s+['"]@\/components\/ui\/M3ActionCard['"]/, replacement: "from '@/components/m3-expressive/action-card'" },
  { regex: /from\s+['"]@\/components\/ui\/M3JobCard['"]/, replacement: "from '@/components/m3-expressive/job-card'" },
  { regex: /from\s+['"]@\/components\/ui\/M3ProfileCard['"]/, replacement: "from '@/components/m3-expressive/profile-card'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Select['"]/, replacement: "from '@/components/m3-expressive/select'" },
  { regex: /from\s+['"]@\/components\/ui\/M3DatePicker['"]/, replacement: "from '@/components/m3-expressive/date-picker'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Menu['"]/, replacement: "from '@/components/m3-expressive/menu'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Chip['"]/, replacement: "from '@/components/m3-expressive/chip'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Alert['"]/, replacement: "from '@/components/m3-expressive/alert'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Breadcrumb['"]/, replacement: "from '@/components/m3-expressive/breadcrumb'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Tabs['"]/, replacement: "from '@/components/m3-expressive/tabs'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Skeleton['"]/, replacement: "from '@/components/m3-expressive/skeleton'" },
  { regex: /from\s+['"]@\/components\/ui\/M3EmptyState['"]/, replacement: "from '@/components/m3-expressive/empty-state'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Sidebar['"]/, replacement: "from '@/components/m3-expressive/sidebar'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Popover['"]/, replacement: "from '@/components/m3-expressive/popover'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Tooltip['"]/, replacement: "from '@/components/m3-expressive/tooltip'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Label['"]/, replacement: "from '@/components/m3-expressive/label'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Separator['"]/, replacement: "from '@/components/m3-expressive/separator'" },
  { regex: /from\s+['"]@\/components\/ui\/M3Avatar['"]/, replacement: "from '@/components/m3-expressive/avatar'" },

  // Custom components: @/components/ui/ComponentName -> @/components/custom/component-name
  { regex: /from\s+['"]@\/components\/ui\/PageHeader['"]/, replacement: "from '@/components/custom/page-header'" },
  { regex: /from\s+['"]@\/components\/ui\/KeywordTag['"]/, replacement: "from '@/components/custom/keyword-tag'" },
  { regex: /from\s+['"]@\/components\/ui\/ATSScoreCircle['"]/, replacement: "from '@/components/custom/ats-score-circle'" },
  { regex: /from\s+['"]@\/components\/ui\/AnimatedButton['"]/, replacement: "from '@/components/custom/animated-button'" },
  { regex: /from\s+['"]@\/components\/ui\/Toast['"]/, replacement: "from '@/components/custom/toast'" },
  { regex: /from\s+['"]@\/components\/ui\/AlertDialog['"]/, replacement: "from '@/components/custom/alert-dialog'" },
  { regex: /from\s+['"]@\/components\/ui\/Collapsible['"]/, replacement: "from '@/components/custom/collapsible'" },
  { regex: /from\s+['"]@\/components\/ui\/DropdownMenu['"]/, replacement: "from '@/components/custom/dropdown-menu'" },
  { regex: /from\s+['"]@\/components\/ui\/Menu['"]/, replacement: "from '@/components/custom/menu'" },
  { regex: /from\s+['"]@\/components\/ui\/ImageWithFallback['"]/, replacement: "from '@/components/custom/image-with-fallback'" },
  { regex: /from\s+['"]@\/components\/ui\/Stepper['"]/, replacement: "from '@/components/custom/stepper'" },
  { regex: /from\s+['"]@\/components\/ui\/TimelineView['"]/, replacement: "from '@/components/custom/timeline-view'" },

  // Root-level M3 directories: @/components/M3ActionCard -> @/components/m3-expressive/action-card
  { regex: /from\s+['"]@\/components\/M3ActionCard['"]/, replacement: "from '@/components/m3-expressive/action-card'" },
  { regex: /from\s+['"]@\/components\/M3JobCard['"]/, replacement: "from '@/components/m3-expressive/job-card'" },
  { regex: /from\s+['"]@\/components\/M3ProfileCard['"]/, replacement: "from '@/components/m3-expressive/profile-card'" },
  { regex: /from\s+['"]@\/components\/M3Select['"]/, replacement: "from '@/components/m3-expressive/select'" },
  { regex: /from\s+['"]@\/components\/M3DatePicker['"]/, replacement: "from '@/components/m3-expressive/date-picker'" },
  { regex: /from\s+['"]@\/components\/M3Menu['"]/, replacement: "from '@/components/m3-expressive/menu'" },
  { regex: /from\s+['"]@\/components\/M3Chip['"]/, replacement: "from '@/components/m3-expressive/chip'" },
  { regex: /from\s+['"]@\/components\/M3Alert['"]/, replacement: "from '@/components/m3-expressive/alert'" },
  { regex: /from\s+['"]@\/components\/M3Breadcrumb['"]/, replacement: "from '@/components/m3-expressive/breadcrumb'" },
  { regex: /from\s+['"]@\/components\/M3Tabs['"]/, replacement: "from '@/components/m3-expressive/tabs'" },

  // design-system paths -> electric paths (for Electric components that were copied there)
  { regex: /from\s+['"]@\/components\/design-system\/Button['"]/, replacement: "from '@/components/electric/button'" },
  { regex: /from\s+['"]@\/components\/design-system\/Card['"]/, replacement: "from '@/components/electric/card'" },
  { regex: /from\s+['"]@\/components\/design-system\/Input['"]/, replacement: "from '@/components/electric/input'" },
  { regex: /from\s+['"]@\/components\/design-system\/Dialog['"]/, replacement: "from '@/components/electric/dialog'" },
  { regex: /from\s+['"]@\/components\/design-system([^'"\s]+)['"]/, replacement: "from '@/components/electric$1'" },
];

// Named import renamings (remove Electric prefix)
const namedImportRenamings = [
  { regex: /{\s*ElectricButton\s*/, replacement: '{ Button ' },
  { regex: /,\s*ElectricButton\s*/, replacement: ', Button ' },
  { regex: /,\s*ElectricButton\s*}/, replacement: ', Button }' },
  { regex: /ElectricButton\s*}/, replacement: 'Button }' },

  // Similar for other Electric components - but be careful not to break M3 imports
  // We'll handle renaming component usage separately
];

function updateImports(content) {
  let result = content;

  // Apply import path mappings
  for (const mapping of importMappings) {
    result = result.replace(mapping.regex, mapping.replacement);
  }

  return result;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = updateImports(content);

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
console.log('Phase 3: Updating import paths...\n');
const count = processDirectory(frontendDir);
console.log(`\n✅ Updated ${count} files`);
