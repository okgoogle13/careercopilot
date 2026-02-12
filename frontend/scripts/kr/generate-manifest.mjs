#!/usr/bin/env node
import { writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// Try to import sharp, but make it optional
let sharp = null;
try {
  const sharpModule = await import('sharp');
  sharp = sharpModule.default;
} catch (err) {
  console.warn('⚠️  sharp not available, will use default aspect ratios');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const MANIFEST_VERSION = '6.0.0';
const BASE_DIR = join(__dirname, '../../public/assets/kr-solidarity');
const OUTPUT_PATH = join(__dirname, '../../public/assets/kerala-rage-kr-solidarity-manifest.json');

// Layer mapping based on category
const CATEGORY_TO_LAYER = {
  devotional: 'spiritual',
  portrait: 'resistance',
  symbol: 'cultural',
  abstract: 'atmospheric',
  street: 'resistance',
  texture: 'substrate'
};

// Priority mapping
const CATEGORY_TO_PRIORITY = {
  devotional: 'CRITICAL',
  portrait: 'CRITICAL',
  symbol: 'HIGH',
  abstract: 'HIGH',
  street: 'HIGH',
  texture: 'HIGH'
};

// Semantic mapping
const LAYER_TO_SEMANTICS = {
  spiritual: {
    functional_role: 'symbolic-anchor',
    semantic_weight: 'mythic',
    layering_role: 'foreground-dominant'
  },
  resistance: {
    functional_role: 'editorial-hero',
    semantic_weight: 'heroic',
    layering_role: 'foreground'
  },
  cultural: {
    functional_role: 'icon-anchor',
    semantic_weight: 'iconic',
    layering_role: 'mid-layer'
  },
  atmospheric: {
    functional_role: 'background-texture',
    semantic_weight: 'atmospheric',
    layering_role: 'overlay'
  },
  substrate: {
    functional_role: 'material-base',
    semantic_weight: 'material',
    layering_role: 'background-base'
  }
};

// Layering compatibility rules
const LAYERING_COMPATIBILITY = {
  spiritual: {
    can_overlay_with: ['substrate', 'atmospheric'],
    cannot_overlay_with: ['spiritual', 'resistance']
  },
  resistance: {
    can_overlay_with: ['substrate', 'atmospheric'],
    cannot_overlay_with: ['resistance', 'spiritual']
  },
  cultural: {
    can_overlay_with: ['substrate', 'atmospheric'],
    cannot_overlay_with: ['cultural']
  },
  atmospheric: {
    can_overlay_with: ['substrate'],
    cannot_overlay_with: ['atmospheric']
  },
  substrate: {
    can_overlay_with: [],
    cannot_overlay_with: ['substrate']
  }
};

// Usage rules by layer
const LAYER_TO_USAGE_RULES = {
  spiritual: {
    scale_suitability: ['hero-only', 'large-section'],
    small_ui_safe: false
  },
  resistance: {
    scale_suitability: ['hero-only', 'feature'],
    small_ui_safe: false
  },
  cultural: {
    scale_suitability: ['hero', 'section', 'card'],
    small_ui_safe: true
  },
  atmospheric: {
    scale_suitability: ['hero', 'section'],
    small_ui_safe: true
  },
  substrate: {
    scale_suitability: ['hero-background', 'global-overlay'],
    small_ui_safe: false
  }
};

// Special case for paint splash (atmospheric but can overlay with atmospheric)
const SPECIAL_CASES = {
  'paint-splash': {
    layering_compatibility: {
      can_overlay_with: ['substrate', 'atmospheric'],
      cannot_overlay_with: []
    }
  }
};

/**
 * Recursively find all PNG files
 */
function findPngFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  
  list.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findPngFiles(filePath));
    } else {
      if (extname(file).toLowerCase() === '.png') {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

/**
 * Extract metadata from filename
 * Format: kr-solidarity__<category>__<name>__v<version>.png
 */
function parseFilename(filepath) {
  const filename = basename(filepath, '.png');
  const parts = filename.split('__');
  
  if (parts.length < 3) {
    console.warn(`Warning: Unexpected filename format: ${filename}`);
    return null;
  }
  
  const category = parts[1];
  const namePart = parts[2];
  
  // Extract readable name from name part
  const name = namePart
    .replace(/kr-solidarity--[^-]+--/g, '')
    .split('--')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    category,
    name,
    filename
  };
}

/**
 * Calculate aspect ratio from dimensions
 */
function calculateAspectRatio(width, height) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  
  // Common aspect ratios
  if (Math.abs(w / h - 1) < 0.05) return '1:1';
  if (Math.abs(w / h - 16/9) < 0.05) return '16:9';
  if (Math.abs(w / h - 3/4) < 0.05) return '3:4';
  if (Math.abs(w / h - 4/3) < 0.05) return '4:3';
  if (Math.abs(w / h - 2/1) < 0.05) return '2:1';
  
  return `${Math.round(w)}:${Math.round(h)}`;
}

/**
 * Generate manifest entry for an asset
 */
async function generateManifestEntry(filepath, index) {
  const metadata = parseFilename(filepath);
  if (!metadata) return null;
  
  const { category, name, filename } = metadata;
  const layer = CATEGORY_TO_LAYER[category];
  
  if (!layer) {
    console.warn(`Warning: Unknown category "${category}" for ${filename}`);
    return null;
  }
  
  // Get image dimensions
  let aspectRatio = '1:1';
  if (sharp) {
    try {
      const imageMetadata = await sharp(filepath).metadata();
      aspectRatio = calculateAspectRatio(imageMetadata.width, imageMetadata.height);
    } catch (err) {
      console.warn(`Warning: Could not read image metadata for ${filename}: ${err.message}`);
    }
  }
  
  // Build relative path
  const relativePath = filepath.replace(/^.*\/public/, '');
  
  // Check for special cases
  const specialCase = SPECIAL_CASES[name.toLowerCase().replace(/\s+/g, '-')];
  
  return {
    id: `KR-SOLID-${String(index + 1).padStart(3, '0')}`,
    name,
    category,
    layer,
    aspect_ratio: aspectRatio,
    file_path: relativePath,
    priority: CATEGORY_TO_PRIORITY[category] || 'MEDIUM',
    semantics: LAYER_TO_SEMANTICS[layer],
    usage_rules: LAYER_TO_USAGE_RULES[layer],
    layering_compatibility: specialCase?.layering_compatibility || LAYERING_COMPATIBILITY[layer]
  };
}

/**
 * Main generator function
 */
async function generateManifest() {
  console.log('🔍 Scanning for KR Solidarity assets...');
  
  // Find all PNG files
  console.log(`🔍 Searching in: ${BASE_DIR}`);
  console.log('⏳ Starting recursive scan...');
  
  let files = [];
  try {
    files = findPngFiles(BASE_DIR);
    console.log('✅ Recursive scan complete');
  } catch (err) {
    console.error(`❌ Error scanning directory: ${err.message}`);
    process.exit(1);
  }
  
  console.log(`📦 Found ${files.length} assets`);
  
  // Generate entries
  const entries = [];
  for (let i = 0; i < files.length; i++) {
    const entry = await generateManifestEntry(files[i], i);
    if (entry) {
      entries.push(entry);
    }
  }
  
  // Sort for determinism: first by category, then by name
  entries.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
  
  // Reassign sequential IDs after sorting
  entries.forEach((entry, idx) => {
    entry.id = `KR-SOLID-${String(idx + 1).padStart(3, '0')}`;
  });
  
  // Build manifest
  const manifest = {
    project: 'kerala-rage kr-solidarity',
    version: MANIFEST_VERSION,
    last_updated: new Date().toISOString().split('T')[0],
    strategy: 'Layered Identity System',
    total_assets: entries.length,
    layers: ['substrate', 'atmospheric', 'cultural', 'resistance', 'spiritual'],
    assets: entries
  };
  
  // Write to file
  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Manifest generated: ${OUTPUT_PATH}`);
  console.log(`📊 Total assets: ${entries.length}`);
  console.log('📋 Assets by layer:');
  
  const layerCounts = entries.reduce((acc, entry) => {
    acc[entry.layer] = (acc[entry.layer] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(layerCounts).forEach(([layer, count]) => {
    console.log(`   ${layer}: ${count}`);
  });
}

// Run generator
generateManifest().catch(err => {
  console.error('❌ Error generating manifest:', err);
  process.exit(1);
});
