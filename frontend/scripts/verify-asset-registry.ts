/**
 * Asset Registry Integrity Verification Script
 *
 * Verifies that all 12 assets from the Kerala Rage manifest
 * are properly registered in the asset governance system.
 */

import { KR_SOLIDARITY_ASSETS, getAllAssetIds } from '../src/lib/krSolidarityAssets';

const EXPECTED_ASSETS = [
  'KR-SOLID-001',
  'KR-SOLID-002',
  'KR-SOLID-003',
  'KR-SOLID-004',
  'KR-SOLID-005',
  'KR-SOLID-006',
  'KR-SOLID-007',
  'KR-SOLID-008',
  'KR-SOLID-009',
  'KR-SOLID-010',
  'KR-SOLID-011',
  'KR-SOLID-012',
];

console.log('Kerala Rage Asset Registry Integrity Check');
console.log('==========================================\n');

const registeredIds = getAllAssetIds();
const registeredCount = registeredIds.length;
const expectedCount = EXPECTED_ASSETS.length;

console.log(`Total assets registered: ${registeredCount}`);
console.log(`Expected: ${expectedCount}\n`);

// Check for missing assets
const missingAssets = EXPECTED_ASSETS.filter((id) => !registeredIds.includes(id));
if (missingAssets.length > 0) {
  console.error(`❌ Missing assets: ${missingAssets.join(', ')}`);
  process.exit(1);
}

// Check for unexpected assets
const unexpectedAssets = registeredIds.filter((id) => !EXPECTED_ASSETS.includes(id));
if (unexpectedAssets.length > 0) {
  console.warn(`⚠️  Unexpected assets (not in manifest): ${unexpectedAssets.join(', ')}`);
}

// Validate each asset has required fields
let hasErrors = false;
for (const assetId of EXPECTED_ASSETS) {
  const asset = KR_SOLIDARITY_ASSETS[assetId];

  if (!asset.name) {
    console.error(`❌ Asset ${assetId} missing 'name'`);
    hasErrors = true;
  }

  if (!asset.file_path) {
    console.error(`❌ Asset ${assetId} missing 'file_path'`);
    hasErrors = true;
  }

  if (!asset.components_allowed || asset.components_allowed.length === 0) {
    console.error(`❌ Asset ${assetId} has no components_allowed`);
    hasErrors = true;
  }

  if (!asset.intended_context) {
    console.warn(`⚠️  Asset ${assetId} missing 'intended_context' (recommended)`);
  }
}

if (hasErrors) {
  console.error('\n❌ Asset registry has validation errors');
  process.exit(1);
}

console.log('✅ Asset registry is complete and valid\n');

// Print summary
console.log('Asset Summary:');
console.log('==============');
Object.entries(KR_SOLIDARITY_ASSETS).forEach(([id, asset]) => {
  console.log(
    `${id}: ${asset.name} (${asset.priority}, ${asset.components_allowed.length} components)`
  );
});

process.exit(0);
