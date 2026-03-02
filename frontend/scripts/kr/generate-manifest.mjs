#!/usr/bin/env node
import { writeFileSync, readdirSync, statSync, readFileSync } from 'fs';
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
// Supports both direct layer names (from filename encoding) and legacy subdirectory names
const CATEGORY_TO_LAYER = {
  // Direct layer names (encoded in kr-solidarity__<layer>__... filename convention)
  atmospheric: 'atmospheric',
  spiritual: 'spiritual',
  resistance: 'resistance',
  cultural: 'cultural',
  substrate: 'substrate',
  // Legacy subdirectory category names
  devotional: 'spiritual',
  portrait: 'resistance',
  hero: 'resistance',
  symbol: 'cultural',
  abstract: 'atmospheric',
  street: 'resistance',
  texture: 'substrate',
  landmark: 'substrate',
  'ui-kit': 'ui-kit',
  uncategorized: 'atmospheric' // temporary staging layer
};

// Priority mapping
const CATEGORY_TO_PRIORITY = {
  // Direct layer names
  atmospheric: 'HIGH',
  spiritual: 'CRITICAL',
  resistance: 'CRITICAL',
  cultural: 'HIGH',
  substrate: 'HIGH',
  // Legacy subdirectory names
  devotional: 'CRITICAL',
  portrait: 'CRITICAL',
  symbol: 'HIGH',
  abstract: 'HIGH',
  street: 'HIGH',
  texture: 'HIGH',
  landmark: 'HIGH',
  'ui-kit': 'MEDIUM',
  uncategorized: 'MEDIUM'
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
  },
  'ui-kit': {
    functional_role: 'ui-element',
    semantic_weight: 'utility',
    layering_role: 'interface'
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
  },
  'ui-kit': {
    can_overlay_with: ['substrate', 'atmospheric', 'cultural', 'resistance', 'spiritual'],
    cannot_overlay_with: []
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
  },
  'ui-kit': {
    scale_suitability: ['ui-component', 'icon'],
    small_ui_safe: true
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
 * Recursively find files by extension
 */
function findFiles(dir, ext) {
  let results = [];
  const list = readdirSync(dir);
  
  list.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, ext));
    } else {
      if (extname(file).toLowerCase() === ext) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

/**
 * Extract metadata from KR Solidarity filename (PNG)
 * Format: kr-solidarity__<category>__<name>__v<version>.png
 */
function parseSolidarityFilename(filepath) {
  const filename = basename(filepath, '.png');
  const parts = filename.split('__');
  
  if (parts.length < 3) {
    // console.warn(`Warning: Unexpected filename format: ${filename}`);
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
    filename,
    type: 'solidarity'
  };
}

/**
 * Extract metadata from UI Kit filename (SVG)
 * Supports two conventions:
 *   New: kr-solidarity__ui-kit__KR-UI-XXX__v1.svg
 *   Legacy: KR-UI-XXX.svg | KR-BRUTALIST-MASK-XXX.svg
 */
function parseUiKitFilename(filepath) {
  const filename = basename(filepath, '.svg');

  // New convention: kr-solidarity__ui-kit__<ID>__v<ver>
  if (filename.includes('__')) {
    const parts = filename.split('__');
    if (parts.length >= 3 && parts[1] === 'ui-kit') {
      const id = parts[2]; // e.g. KR-UI-001 or KR-BRUTALIST-MASK-001
      // Build readable name from ID
      const name = id
        .replace(/^KR-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      return {
        category: 'ui-kit',
        name: `UI Asset — ${name}`,
        filename,
        type: 'ui-kit',
        id
      };
    }
    return null;
  }

  // Legacy convention: KR-UI-XXX or KR-BRUTALIST-MASK-XXX
  if (filename.startsWith('KR-UI-') || filename.startsWith('KR-BRUTALIST-')) {
    const name = filename
      .replace(/^KR-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return {
      category: 'ui-kit',
      name: `UI Asset — ${name}`,
      filename,
      type: 'ui-kit',
      id: filename
    };
  }

  return null;
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
async function generateManifestEntry(filepath, index, type = 'solidarity') {
    let metadata;
    let extension = extname(filepath).toLowerCase();
    
    if (type === 'ui-kit') {
        metadata = parseUiKitFilename(filepath);
    } else {
        metadata = parseSolidarityFilename(filepath);
    }

  if (!metadata) return null;
  
  const { category, name, filename, id: explicitId } = metadata;
  const layer = CATEGORY_TO_LAYER[category];
  
  if (!layer) {
    console.warn(`Warning: Unknown category "${category}" for ${filename}`);
    return null;
  }
  
  // Get image dimensions/aspect ratio
  let aspectRatio = '1:1';
  if (sharp) {
    try {
      // Svg metadata usually works with sharp too
      const imageMetadata = await sharp(filepath).metadata();
      if (imageMetadata.width && imageMetadata.height) {
          aspectRatio = calculateAspectRatio(imageMetadata.width, imageMetadata.height);
      }
    } catch (err) {
      // console.warn(`Warning: Could not read image metadata for ${filename}: ${err.message}`);
    }
  } else if (extension === '.svg') {
      // Fallback for SVG if sharp missing: read viewBox
      try {
          const content = readFileSync(filepath, 'utf8');
          const viewBox = content.match(/viewBox="([^"]+)"/);
          if (viewBox) {
              const [_, BoxStr] = viewBox;
              const [x, y, w, h] = BoxStr.split(' ').map(Number);
              aspectRatio = calculateAspectRatio(w, h);
          }
      } catch (e) {}
  }
  
  // Build relative path
  const relativePath = filepath.replace(/^.*\/public/, '');
  
  // Check for special cases
  const specialCase = SPECIAL_CASES[name.toLowerCase().replace(/\s+/g, '-')];
  
  // ID Generation
  let assetId;
  if (explicitId) {
      assetId = explicitId;
  } else {
      assetId = `KR-SOLID-${String(index + 1).padStart(3, '0')}`;
  }

  return {
    id: assetId,
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
  console.log('🔍 Scanning for KR assets...');
  
  // 1. Find Solidarity PNGs
  const pngFiles = findFiles(BASE_DIR, '.png');
  console.log(`📦 Found ${pngFiles.length} Solidarity (PNG) assets`);
  
  // 2. Find UI Kit SVGs
  const uiKitDir = join(BASE_DIR, 'ui-kit/svg');
  let svgFiles = [];
  try {
      svgFiles = findFiles(uiKitDir, '.svg');
      console.log(`📦 Found ${svgFiles.length} UI Kit (SVG) assets`);
  } catch (e) {
      console.warn('⚠️  UI Kit directory not found or empty');
  }

  // Generate entries
  const entries = [];
  
  // Solidarity Assets (Auto-increment IDs)
  // Sort first for determinism
  pngFiles.sort();
  for (let i = 0; i < pngFiles.length; i++) {
    const entry = await generateManifestEntry(pngFiles[i], i, 'solidarity');
    if (entry) {
      entries.push(entry);
    }
  }

  // UI Kit Assets (Use filename IDs) — deduplicate by ID (subdirs copy main dir files)
  const seenUiKitIds = new Set();
  svgFiles.sort();
  for (let i = 0; i < svgFiles.length; i++) {
      const entry = await generateManifestEntry(svgFiles[i], 0, 'ui-kit');
      if (entry && !seenUiKitIds.has(entry.id)) {
          seenUiKitIds.add(entry.id);
          entries.push(entry);
      }
  }
  
  // Build manifest
  const manifest = {
    project: 'kerala-rage kr-solidarity',
    version: MANIFEST_VERSION,
    last_updated: new Date().toISOString().split('T')[0],
    strategy: 'Layered Identity System',
    total_assets: entries.length,
    layers: ['substrate', 'atmospheric', 'cultural', 'resistance', 'spiritual', 'ui-kit'],
    assets: entries
  };
  
  // Write to file
  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Manifest generated: ${OUTPUT_PATH}`);
  console.log(`📊 Total assets: ${entries.length}`);
}

// Run generator
generateManifest().catch(err => {
  console.error('❌ Error generating manifest:', err);
  process.exit(1);
});
