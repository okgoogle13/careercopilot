#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const MANIFEST_PATH = join(
  __dirname,
  '../../public/assets/kr-solidarity-manifest.json'
);
const OUTPUT_PATH = join(__dirname, '../../public/assets/kr-solidarity-hero-registry.json');
const REGISTRY_VERSION = '2.0.0';

// M3 Expressive motion system
const M3_EXPRESSIVE_BEZIER = [0.34, 1.56, 0.64, 1];

// Typography pressure states (from Kerala Rage design canon)
const TYPOGRAPHY_STATES = {
  pressure_state: {
    wght: 900,
    wdth: 75,
  },
  solidarity_state: {
    wght: 800,
    wdth: 120,
  },
  melancholy_state: {
    wght: 475,
    wdth: 97.5,
  },
};

// Motion configuration
const MOTION_CONFIG = {
  bezier: M3_EXPRESSIVE_BEZIER,
  scroll_wght_range: [300, 800],
  transition_duration: 400,
};

/**
 * Get assets by layer from manifest
 */
function getAssetsByLayer(manifest, layer) {
  return manifest.assets.filter((asset) => asset.layer === layer);
}

/**
 * Get random asset from layer (for auto selection)
 */
function getRandomAssetId(assets) {
  if (assets.length === 0) return 'auto';
  const randomIndex = Math.floor(Math.random() * assets.length);
  return assets[randomIndex].id;
}

/**
 * Generate hero composition recipes
 */
function generateHeroCompositions(manifest) {
  const compositions = [];

  // Get assets by layer
  const spiritualAssets = getAssetsByLayer(manifest, 'spiritual');
  const resistanceAssets = getAssetsByLayer(manifest, 'resistance');
  const atmosphericAssets = getAssetsByLayer(manifest, 'atmospheric');
  const substrateAssets = getAssetsByLayer(manifest, 'substrate');

  // 1. Devotional Anchor Heroes (one for each spiritual asset)
  spiritualAssets.slice(0, 2).forEach((spiritualAsset, idx) => {
    compositions.push({
      id: `devotional-anchor-hero-${idx + 1}`,
      name: `Devotional Anchor Hero ${idx + 1}`,
      description: `Hero composition featuring ${spiritualAsset.name}`,
      layers: [
        {
          type: 'substrate',
          asset_id: substrateAssets[0]?.id || 'auto',
          z_index: 1,
          opacity: 0.4,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'atmospheric',
          asset_id: 'auto',
          z_index: 2,
          opacity: 0.3,
          blend_mode: 'overlay',
          position: 'center',
        },
        {
          type: 'spiritual',
          asset_id: spiritualAsset.id,
          z_index: 3,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Solidarity Across Borders',
        supporting: 'First Nations, Kerala, Global Resistance',
        ...TYPOGRAPHY_STATES,
      },
      motion: MOTION_CONFIG,
    });
  });

  // 2. Resistance Portrait Heroes (one for each resistance portrait)
  resistanceAssets
    .filter((asset) => asset.category === 'portrait')
    .slice(0, 3)
    .forEach((resistanceAsset, idx) => {
      compositions.push({
        id: `resistance-portrait-hero-${idx + 1}`,
        name: `Resistance Portrait Hero ${idx + 1}`,
        description: `Hero composition featuring ${resistanceAsset.name}`,
        layers: [
          {
            type: 'substrate',
            asset_id: substrateAssets[0]?.id || 'auto',
            z_index: 1,
            opacity: 0.5,
            blend_mode: 'normal',
            position: 'cover',
          },
          {
            type: 'atmospheric',
            asset_id: 'auto',
            z_index: 2,
            opacity: 0.2,
            blend_mode: 'multiply',
            position: 'center',
          },
          {
            type: 'resistance',
            asset_id: resistanceAsset.id,
            z_index: 3,
            opacity: 1,
            blend_mode: 'normal',
            position: 'center',
          },
        ],
        typography: {
          headline: 'The Rage Never Dies',
          supporting: 'Legacy of Resistance',
          ...TYPOGRAPHY_STATES,
        },
        motion: MOTION_CONFIG,
      });
    });

  // 3. Layered Solidarity Hero (multi-layer composite)
  const paintSplashAsset = manifest.assets.find((a) =>
    a.name.toLowerCase().includes('paint splash')
  );

  compositions.push({
    id: 'layered-solidarity-hero',
    name: 'Layered Solidarity Hero',
    description: 'Multi-layer composite with resistance and atmospheric layers',
    layers: [
      {
        type: 'substrate',
        asset_id: substrateAssets[0]?.id || 'auto',
        z_index: 1,
        opacity: 0.6,
        blend_mode: 'normal',
        position: 'cover',
      },
      {
        type: 'atmospheric',
        asset_id: 'auto',
        z_index: 2,
        opacity: 0.25,
        blend_mode: 'screen',
        position: 'center',
      },
      {
        type: 'resistance',
        asset_id: 'auto',
        z_index: 3,
        opacity: 0.7,
        blend_mode: 'normal',
        position: 'left',
      },
      {
        type: 'atmospheric',
        asset_id: paintSplashAsset?.id || 'auto',
        z_index: 4,
        opacity: 0.3,
        blend_mode: 'color-dodge',
        position: 'right',
      },
    ],
    typography: {
      headline: 'Intersectional Resistance',
      supporting: 'Solidarity is Our Weapon',
      ...TYPOGRAPHY_STATES,
    },
    motion: MOTION_CONFIG,
  });

  // 4. Cultural Symbol Heroes
  const culturalAssets = getAssetsByLayer(manifest, 'cultural');
  culturalAssets.slice(0, 2).forEach((culturalAsset, idx) => {
    compositions.push({
      id: `cultural-symbol-hero-${idx + 1}`,
      name: `Cultural Symbol Hero ${idx + 1}`,
      description: `Hero composition featuring ${culturalAsset.name}`,
      layers: [
        {
          type: 'substrate',
          asset_id: substrateAssets[0]?.id || 'auto',
          z_index: 1,
          opacity: 0.45,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'atmospheric',
          asset_id: 'auto',
          z_index: 2,
          opacity: 0.35,
          blend_mode: 'overlay',
          position: 'center',
        },
        {
          type: 'cultural',
          asset_id: culturalAsset.id,
          z_index: 3,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Cultural Roots, Global Struggle',
        supporting: 'Heritage as Resistance',
        ...TYPOGRAPHY_STATES,
      },
      motion: MOTION_CONFIG,
    });
  });

  return compositions;
}

/**
 * Validate layer compatibility
 */
function validateComposition(composition, manifest) {
  const warnings = [];

  for (let i = 0; i < composition.layers.length; i++) {
    const layer1 = composition.layers[i];

    for (let j = i + 1; j < composition.layers.length; j++) {
      const layer2 = composition.layers[j];

      // Find asset in manifest
      const asset1 = manifest.assets.find((a) => a.id === layer1.asset_id);
      const asset2 = manifest.assets.find((a) => a.id === layer2.asset_id);

      if (!asset1 || !asset2) continue;

      // Check compatibility
      const cannotOverlay = asset1.layering_compatibility?.cannot_overlay_with || [];
      if (cannotOverlay.includes(asset2.layer)) {
        warnings.push(
          `Warning: ${composition.id} - ${asset1.layer} (${asset1.id}) cannot overlay with ${asset2.layer} (${asset2.id})`
        );
      }
    }
  }

  return warnings;
}

/**
 * Main generator function
 */
function generateHeroRegistry() {
  console.log('🎨 Generating hero registry from manifest...');

  // Read manifest
  let manifest;
  try {
    const manifestData = readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(manifestData);
  } catch (err) {
    console.error('❌ Error reading manifest:', err.message);
    console.error('   Run "npm run kr:manifest" first to generate the manifest.');
    process.exit(1);
  }

  console.log(`📊 Loaded manifest v${manifest.version} with ${manifest.total_assets} assets`);

  // Generate compositions
  const compositions = generateHeroCompositions(manifest);

  console.log(`🎭 Generated ${compositions.length} hero compositions`);

  // Validate compositions
  let allWarnings = [];
  compositions.forEach((comp) => {
    const warnings = validateComposition(comp, manifest);
    allWarnings = allWarnings.concat(warnings);
  });

  if (allWarnings.length > 0) {
    console.warn('⚠️  Layer compatibility warnings:');
    allWarnings.forEach((w) => console.warn(`   ${w}`));
  }

  // Build registry
  const registry = {
    version: REGISTRY_VERSION,
    registry_name: 'kerala-rage-hero-compositions',
    last_updated: new Date().toISOString().split('T')[0],
    manifest_version: manifest.version,
    m3_expressive_bezier: M3_EXPRESSIVE_BEZIER,
    compositions,
  };

  // Write to file
  writeFileSync(OUTPUT_PATH, JSON.stringify(registry, null, 2));

  console.log(`✅ Hero registry generated: ${OUTPUT_PATH}`);
  console.log(`🎨 Total compositions: ${compositions.length}`);
}

// Run generator
generateHeroRegistry();
