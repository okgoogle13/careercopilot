import * as fs from 'fs';
import * as path from 'path';

// Define the shape of our raw inventory items
interface RawComponent {
  name: string;
  absolutePath: string;
  relativePath: string;
  category: string;
}

interface LayeredBlueprint {
  L1_PRIMITIVE: RawComponent[];
  L2_SHARED: RawComponent[];
  L3_LAYOUT: RawComponent[];
  L4_PAGE: RawComponent[];
  UNKNOWN: RawComponent[];
}

function determineLayer(relativePath: string): keyof LayeredBlueprint {
  // L1_PRIMITIVE: matches /ui/ or /kerala-rage/
  if (relativePath.includes('/ui/') || relativePath.includes('/kerala-rage/')) {
    return 'L1_PRIMITIVE';
  }

  // L2_SHARED: matches /shared/ or /resume/
  if (relativePath.includes('/shared/') || relativePath.includes('/resume/')) {
    return 'L2_SHARED';
  }

  // L3_LAYOUT: matches /layouts/ or /*Shell.tsx
  if (relativePath.includes('/layouts/') || relativePath.endsWith('Shell.tsx')) {
    return 'L3_LAYOUT';
  }

  // L4_PAGE: matches /pages/ or /features/
  if (relativePath.includes('/pages/') || relativePath.includes('/features/')) {
    return 'L4_PAGE';
  }

  return 'UNKNOWN';
}

import { fileURLToPath } from 'url';

function main() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const frontendDir = path.resolve(currentDir, '..');
  const rootDir = path.resolve(frontendDir, '..');
  const rawInventoryPath = path.join(frontendDir, 'tmp_raw_inventory.json');

  if (!fs.existsSync(rawInventoryPath)) {
    console.error(`Error: Raw inventory not found at ${rawInventoryPath}`);
    process.exit(1);
  }

  const rawInventory: RawComponent[] = JSON.parse(fs.readFileSync(rawInventoryPath, 'utf8'));

  const blueprint: LayeredBlueprint = {
    L1_PRIMITIVE: [],
    L2_SHARED: [],
    L3_LAYOUT: [],
    L4_PAGE: [],
    UNKNOWN: [],
  };

  rawInventory.forEach((comp) => {
    const layer = determineLayer(comp.relativePath);
    blueprint[layer].push(comp);
  });

  const outputPath = path.join(rootDir, 'docs', 'design', 'layered-component-blueprint.json');
  fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));

  console.log(`✅ Layered blueprint generated at ${outputPath}`);
  console.log(`L1_PRIMITIVE: ${blueprint.L1_PRIMITIVE.length}`);
  console.log(`L2_SHARED: ${blueprint.L2_SHARED.length}`);
  console.log(`L3_LAYOUT: ${blueprint.L3_LAYOUT.length}`);
  console.log(`L4_PAGE: ${blueprint.L4_PAGE.length}`);
  console.log(`UNKNOWN: ${blueprint.UNKNOWN.length}`);
}

main();
