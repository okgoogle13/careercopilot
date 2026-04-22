import * as fs from 'fs';
import * as path from 'path';
import { composeHero } from '../lib/composeHero';
import { SolidarityManifest, HeroRegistry } from '../design/hero/heroTypes';
import { normalizeManifest } from '../design/hero/normalizeManifest';

const MANIFEST_PATH = path.resolve(process.cwd(), 'public/assets/kr-solidarity-manifest.json');
const REGISTRY_PATH = path.resolve(process.cwd(), 'public/assets/kr-solidarity-hero-registry.json');

function main() {
  const rawManifest: SolidarityManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const manifest = normalizeManifest(rawManifest);

  const existingRegistry: HeroRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

  // Bump version or keep 3.1.0
  let version = existingRegistry.version;
  if (!version.startsWith('3.1')) {
    version = '3.1.0';
  } else {
    // maybe bump patch if already 3.1.0? We'll just set it to 3.1.0
    version = '3.1.0';
  }

  const registry: HeroRegistry = {
    ...existingRegistry,
    version,
    last_updated: new Date().toISOString().split('T')[0],
  };

  // Ensure one landing_default:true (prefer resistance-portrait hero)
  let foundLandingDefault = false;
  for (const comp of registry.compositions) {
    if (comp.id === 'resistance-portrait') {
      comp.landing_default = true;
      foundLandingDefault = true;
    } else {
      comp.landing_default = false;
    }
  }

  if (!foundLandingDefault && registry.compositions.length > 0) {
    registry.compositions[0].landing_default = true;
  }

  // Validate and cleanup
  for (const comp of registry.compositions) {
    const result = composeHero(manifest, registry, comp.id);
    if (!result.valid) {
      console.error(`Composition ${comp.id} failed validation:`, result.error);
    } else {
      console.log(`Composition ${comp.id} passed validation.`);
      if (result.warnings && result.warnings.length > 0) {
        console.warn(`  Warnings:`, result.warnings);
      }
    }
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
  console.log(`Registry regenerated successfully at ${REGISTRY_PATH}`);
}

main();
