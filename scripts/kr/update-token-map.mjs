#!/usr/bin/env node
/**
 * JSON Schema Updater - Add newly generated UI-KIT assets to token map
 * Validates DTCG schema, increments version, updates timestamps
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_MAP_PATH = path.join(__dirname, '../../frontend/public/assets/kr-solidarity-ui-token-map.json');

function loadTokenMap() {
  const data = fs.readFileSync(TOKEN_MAP_PATH, 'utf8');
  return JSON.parse(data);
}

function updateAssetPath(tokenMap, assetId, filePath) {
  const tokenKey = Object.keys(tokenMap.tokens).find(k =>
    tokenMap.tokens[k].ref === assetId
  );

  if (!tokenKey) {
    console.warn(`⚠️  Asset ${assetId} not found in token map`);
    return false;
  }

  tokenMap.tokens[tokenKey].path = filePath;
  tokenMap.tokens[tokenKey].status = 'ready';
  return true;
}

function bumpVersion(tokenMap) {
  const [major, minor, patch] = tokenMap.version.split('.').map(Number);
  tokenMap.version = `${major}.${minor}.${patch + 1}`;
  tokenMap.updated = new Date().toISOString();
}

function validateDTCGSchema(tokenMap) {
  // Minimal DTCG validation
  const required = ['version', 'updated', 'description', 'tokens'];
  for (const field of required) {
    if (!tokenMap[field]) {
      throw new Error(`Missing required DTCG field: ${field}`);
    }
  }

  // Validate token structure
  for (const [key, token] of Object.entries(tokenMap.tokens)) {
    if (!token.ref || !token.type || !token.status) {
      throw new Error(`Invalid token structure for ${key}`);
    }
  }

  return true;
}

function main(assetUpdates = []) {
  console.log('📋 Loading token map...');
  const tokenMap = loadTokenMap();

  // Apply updates (e.g., from Stage 1 asset generation)
  let successCount = 0;
  if (assetUpdates && assetUpdates.length > 0) {
    console.log(`🔄 Applying ${assetUpdates.length} asset updates...`);
    for (const { id, path } of assetUpdates) {
      if (updateAssetPath(tokenMap, id, path)) {
        console.log(`  ✅ ${id}: ${path}`);
        successCount++;
      } else {
        console.log(`  ⚠️  ${id}: not found`);
      }
    }
  }

  // Validate schema
  console.log('🔍 Validating DTCG schema...');
  validateDTCGSchema(tokenMap);
  console.log('  ✅ Schema valid');

  // Bump version
  console.log('📈 Bumping version...');
  const oldVersion = tokenMap.version;
  bumpVersion(tokenMap);
  console.log(`  ✅ ${oldVersion} → ${tokenMap.version}`);

  // Write updated map
  console.log('💾 Writing token map...');
  fs.writeFileSync(TOKEN_MAP_PATH, JSON.stringify(tokenMap, null, 2), 'utf8');

  console.log(`\n✅ Token map updated successfully`);
  console.log(`   - Version: ${tokenMap.version}`);
  console.log(`   - Updated: ${tokenMap.updated}`);
  console.log(`   - Assets updated: ${successCount}`);

  return tokenMap;
}

// Parse CLI arguments or use empty array
const args = process.argv.slice(2);
const assetUpdates = [];

for (let i = 0; i < args.length; i += 2) {
  if (args[i] === '--asset' && args[i + 1]) {
    const [id, filepath] = args[i + 1].split('=');
    if (id && filepath) {
      assetUpdates.push({ id, path: filepath });
    }
  }
}

main(assetUpdates);
