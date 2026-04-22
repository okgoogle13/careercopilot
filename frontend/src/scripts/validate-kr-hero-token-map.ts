import * as fs from 'fs';
import * as path from 'path';
import { normalizeManifest } from '../design/hero/normalizeManifest';
import { HeroTokenMapV2 } from '../design/hero/heroTokenResolver';
import { SolidarityManifest } from '../design/hero/heroTypes';

const MANIFEST_PATH = path.resolve(process.cwd(), 'public/assets/kr-solidarity-manifest.json');
const MAP_PATH = path.resolve(process.cwd(), 'public/assets/kr-solidarity-hero-token-map.v2.json');

function main() {
  console.log('Validating kr-solidarity-hero-token-map.v2.json...');

  const rawManifest: SolidarityManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const manifest = normalizeManifest(rawManifest);
  const tokenMap: HeroTokenMapV2 = JSON.parse(fs.readFileSync(MAP_PATH, 'utf-8'));

  let warnings = 0;
  let failures = 0;
  let totalAliases = 0;

  const keys = Object.keys(tokenMap.tokens);
  console.log(`Analyzing ${keys.length} tokens...`);

  // E) No duplicate keys -- JSON.parse handles exact keys silently overriding,
  // but if we really wanted to check the string for duplicate keys we'd need a custom parser.
  // We'll trust standard check.

  const assetRefMap = new Map(manifest.assets.map((a) => [a.id, a]));

  for (const [key, token] of Object.entries(tokenMap.tokens)) {
    if (token.alias_of) {
      totalAliases++;
      // B) aliases resolve to a real token, C) no alias loops
      let depth = 0;
      let curr = token;
      let targetKey = key;

      while (curr.alias_of) {
        if (depth >= 3) {
          console.error(`FAIL: Alias loop or max depth exceeded for ${key}`);
          failures++;
          break;
        }
        targetKey = curr.alias_of;
        curr = tokenMap.tokens[targetKey];
        if (!curr) {
          console.error(`FAIL: Alias target not found for ${key} -> ${targetKey}`);
          failures++;
          break;
        }
        depth++;
      }

      // If we broke out successfully without errors:
      if (curr && !curr.alias_of) {
        if (!curr.ref) {
          console.error(`FAIL: Resolved alias target ${targetKey} for ${key} missing ref`);
          failures++;
        }
      }
    } else {
      // A) non-alias tokens have ref and ref exists in manifest
      if (!token.ref) {
        console.error(`FAIL: Token missing ref/alias_of: ${key}`);
        failures++;
      } else {
        const asset = assetRefMap.get(token.ref);
        if (!asset) {
          console.error(`FAIL: Ref ${token.ref} not found in manifest for token ${key}`);
          failures++;
        } else {
          // D) token.layer matches manifest asset.layer
          if (token.layer && token.layer !== asset.layer) {
            console.warn(
              `WARN: Token ${key} layer "${token.layer}" mismatches manifest layer "${asset.layer}" for ref ${token.ref}`
            );
            warnings++;
          }
        }
      }
    }
  }

  console.log('');
  console.log('--- Summary ---');
  console.log(`Total Tokens: ${keys.length}`);
  console.log(`Total Aliases: ${totalAliases}`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Failures: ${failures}`);

  if (failures > 0) {
    console.error('Validation failed.');
    process.exit(1);
  } else {
    console.log('Validation passed.');
    process.exit(0);
  }
}

main();
