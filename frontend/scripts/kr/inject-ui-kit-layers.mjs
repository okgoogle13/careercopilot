#!/usr/bin/env node
/**
 * Hero Composition Injector - Auto-inject UI-KIT layers into compositions
 * Validates layer compatibility, maintains Z-index stacking
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HERO_REGISTRY_PATH = path.join(
  __dirname,
  '../../public/assets/kr-solidarity/kr-solidarity.hero-registry.json'
);

const UI_KIT_LAYER_RULES = [
  {
    assetId: 'KR-UI-004', // Blueprint Grid
    insertAfter: 'substrate',
    zIndex: 1.5,
    blendMode: 'multiply',
    opacity: 0.1,
    applyTo: ['resistance', 'cultural', 'structural'],
  },
  {
    assetId: 'KR-UI-003', // Screenprint Grit
    insertAfter: 'atmospheric',
    zIndex: 4,
    blendMode: 'overlay',
    opacity: 0.15,
    applyTo: ['*'], // Apply to all compositions
  },
  {
    assetId: 'KR-UI-002', // Halo Disk (optional)
    insertAfter: 'substrate',
    zIndex: 2,
    blendMode: 'screen',
    opacity: 0.5,
    applyTo: ['devotional', 'spiritual'],
  },
];

function loadRegistry() {
  if (!fs.existsSync(HERO_REGISTRY_PATH)) {
    console.error(`❌ Hero registry not found: ${HERO_REGISTRY_PATH}`);
    process.exit(1);
  }
  const data = fs.readFileSync(HERO_REGISTRY_PATH, 'utf8');
  return JSON.parse(data);
}

function injectLayers(registry) {
  let injected = 0;

  for (const composition of registry.compositions) {
    for (const rule of UI_KIT_LAYER_RULES) {
      // Check if rule applies to this composition type
      const shouldApply =
        rule.applyTo.includes('*') || rule.applyTo.some((type) => composition.id.includes(type));

      if (!shouldApply) continue;

      // Check if layer already exists
      if (composition.layers.some((l) => l.asset_id === rule.assetId)) {
        console.log(`⏭️  ${composition.id}: ${rule.assetId} already present`);
        continue;
      }

      // Find insertion point
      const insertIndex = composition.layers.findIndex((l) => l.type === rule.insertAfter);
      if (insertIndex === -1) {
        console.warn(`⚠️  ${composition.id}: insertion point '${rule.insertAfter}' not found`);
        continue;
      }

      // Create new layer
      const newLayer = {
        type: 'ui-kit',
        asset_id: rule.assetId,
        z_index: rule.zIndex,
        opacity: rule.opacity,
        blend_mode: rule.blendMode,
        position: 'cover',
      };

      composition.layers.splice(insertIndex + 1, 0, newLayer);
      console.log(`✅ Injected ${rule.assetId} into ${composition.id}`);
      injected++;
    }
  }

  return { registry, injected };
}

function validateCompatibility(registry) {
  const warnings = [];

  for (const composition of registry.compositions) {
    const layers = composition.layers;
    for (let i = 0; i < layers.length; i++) {
      for (let j = i + 1; j < layers.length; j++) {
        const zIndexConflict = layers[i].z_index > layers[j].z_index && i > j;
        if (zIndexConflict) {
          warnings.push(
            `⚠️  Z-index conflict in ${composition.id}: layer ${i} (z=${layers[i].z_index}) > layer ${j} (z=${layers[j].z_index})`
          );
        }
      }
    }
  }

  return warnings;
}

function main() {
  console.log('📂 Loading hero registry...');
  const registry = loadRegistry();
  console.log(`  ✅ Loaded ${registry.compositions.length} compositions`);

  console.log('\n🔄 Injecting UI-KIT layers...');
  const { registry: updated, injected } = injectLayers(registry);
  console.log(`  📊 Total injected: ${injected}`);

  console.log('\n🔍 Validating compatibility...');
  const warnings = validateCompatibility(updated);

  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warnings:`);
    warnings.forEach((w) => console.log(`  ${w}`));
    process.exit(1);
  }

  console.log('  ✅ All layers compatible');

  console.log('\n💾 Writing hero registry...');
  fs.writeFileSync(HERO_REGISTRY_PATH, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`  ✅ Hero registry updated`);

  console.log('\n✅ Layer injection complete!');
}

main();
