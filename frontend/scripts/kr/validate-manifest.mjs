#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const MANIFEST_PATH = join(
  __dirname,
  '../../public/assets/kr-solidarity-manifest.json'
);
const ASSET_BASE = join(__dirname, '../../public/assets/kr-solidarity');

// Valid layers
const VALID_LAYERS = ['substrate', 'atmospheric', 'cultural', 'resistance', 'spiritual', 'ui-kit'];

// Validation state
let errorCount = 0;
let warningCount = 0;

/**
 * Log error
 */
function logError(message) {
  console.error(`❌ ${message}`);
  errorCount++;
}

/**
 * Log warning
 */
function logWarning(message) {
  console.warn(`⚠️  ${message}`);
  warningCount++;
}

/**
 * Validate manifest structure
 */
function validateStructure(manifest) {
  console.log('🔍 Validating manifest structure...');

  if (!manifest.version) {
    logError('Missing "version" field');
  }

  if (!manifest.layers || !Array.isArray(manifest.layers)) {
    logError('Missing or invalid "layers" field');
  }

  if (!manifest.assets || !Array.isArray(manifest.assets)) {
    logError('Missing or invalid "assets" field');
    return false;
  }

  if (manifest.total_assets !== manifest.assets.length) {
    logWarning(
      `total_assets (${manifest.total_assets}) does not match assets.length (${manifest.assets.length})`
    );
  }

  return true;
}

/**
 * Validate no duplicate IDs
 */
function validateUniqueIds(assets) {
  console.log('🔍 Checking for duplicate IDs...');

  const ids = new Set();
  const duplicates = [];

  assets.forEach((asset) => {
    if (ids.has(asset.id)) {
      duplicates.push(asset.id);
    }
    ids.add(asset.id);
  });

  if (duplicates.length > 0) {
    logError(`Duplicate IDs found: ${duplicates.join(', ')}`);
  }
}

/**
 * Validate no duplicate file paths
 */
function validateUniqueFilePaths(assets) {
  console.log('🔍 Checking for duplicate file paths...');

  const paths = new Set();
  const duplicates = [];

  assets.forEach((asset) => {
    if (paths.has(asset.file_path)) {
      duplicates.push(asset.file_path);
    }
    paths.add(asset.file_path);
  });

  if (duplicates.length > 0) {
    logError(`Duplicate file paths found: ${duplicates.join(', ')}`);
  }
}

/**
 * Validate layer assignments
 */
function validateLayers(assets) {
  console.log('🔍 Validating layer assignments...');

  assets.forEach((asset) => {
    if (!asset.layer) {
      logError(`Asset ${asset.id} missing "layer" field`);
      return;
    }

    if (!VALID_LAYERS.includes(asset.layer)) {
      logError(`Asset ${asset.id} has invalid layer: "${asset.layer}"`);
    }
  });
}

/**
 * Validate layering compatibility rules
 */
function validateLayeringCompatibility(assets) {
  console.log('🔍 Validating layering compatibility rules...');

  assets.forEach((asset) => {
    if (!asset.layering_compatibility) {
      logError(`Asset ${asset.id} missing "layering_compatibility" field`);
      return;
    }

    const { can_overlay_with, cannot_overlay_with } = asset.layering_compatibility;

    if (!Array.isArray(can_overlay_with)) {
      logError(`Asset ${asset.id} has invalid "can_overlay_with" (must be array)`);
    }

    if (!Array.isArray(cannot_overlay_with)) {
      logError(`Asset ${asset.id} has invalid "cannot_overlay_with" (must be array)`);
    }

    // Check for invalid layers in compatibility rules
    [...can_overlay_with, ...cannot_overlay_with].forEach((layer) => {
      if (!VALID_LAYERS.includes(layer)) {
        logWarning(`Asset ${asset.id} references invalid layer in compatibility: "${layer}"`);
      }
    });

    // Check for overlap between can and cannot
    const overlap = can_overlay_with.filter((l) => cannot_overlay_with.includes(l));
    if (overlap.length > 0) {
      logError(`Asset ${asset.id} has overlapping compatibility rules: ${overlap.join(', ')}`);
    }
  });
}

/**
 * Validate file existence (if assets are on disk)
 */
function validateFileExistence(assets) {
  console.log('🔍 Checking if asset files exist...');

  const missingFiles = [];

  assets.forEach((asset) => {
    // Determine full path based on whether asset content starts with /assets (public) or other
    const fullPath = join(__dirname, '../../public', asset.file_path.replace(/^\//, ''));

    if (!existsSync(fullPath)) {
      missingFiles.push({ id: asset.id, path: asset.file_path });
    }
  });

  if (missingFiles.length > 0) {
    logError(`${missingFiles.length} assets reference missing files:`);
    missingFiles.slice(0, 5).forEach(({ id, path }) => {
      console.error(`   ${id}: ${path}`);
    });
    if (missingFiles.length > 5) {
      console.error(`   ... and ${missingFiles.length - 5} more`);
    }
  }
}

/**
 * Main validation function
 */
function validateManifest() {
  console.log('═══════════════════════════════════════');
  console.log('  KR SOLIDARITY MANIFEST VALIDATOR');
  console.log('═══════════════════════════════════════\n');

  // Check if manifest exists
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifest not found: ${MANIFEST_PATH}`);
    console.error('   Run "npm run kr:manifest" to generate it.\n');
    process.exit(1);
  }

  // Load manifest
  let manifest;
  try {
    const data = readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(data);
  } catch (err) {
    console.error(`❌ Error reading manifest: ${err.message}\n`);
    process.exit(1);
  }

  console.log(`📦 Manifest version: ${manifest.version}`);
  console.log(`📊 Total assets: ${manifest.assets?.length || 0}\n`);

  // Run validations
  if (!validateStructure(manifest)) {
    console.error('\n❌ Manifest structure is invalid. Skipping further validation.\n');
    process.exit(1);
  }

  validateUniqueIds(manifest.assets);
  validateUniqueFilePaths(manifest.assets);
  validateLayers(manifest.assets);
  validateLayeringCompatibility(manifest.assets);
  validateFileExistence(manifest.assets);

  // Summary
  console.log('\n═══════════════════════════════════════');
  console.log('  VALIDATION SUMMARY');
  console.log('═══════════════════════════════════════\n');

  if (errorCount === 0 && warningCount === 0) {
    console.log('✅ All validations passed!');
    console.log('   No errors or warnings found.\n');
    process.exit(0);
  } else {
    if (errorCount > 0) {
      console.error(`❌ ${errorCount} error(s) found`);
    }
    if (warningCount > 0) {
      console.warn(`⚠️  ${warningCount} warning(s) found`);
    }
    console.log('');

    if (errorCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

// Run validator
validateManifest();
