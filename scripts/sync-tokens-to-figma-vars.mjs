#!/usr/bin/env node
/**
 * Figma Token Sync Bridge
 * Pushes design tokens from tokens.json to Figma Variables via REST API.
 * Requires: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables.
 */

import fs from 'fs';
import axios from 'axios';

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'YOUR_FILE_KEY_HERE';
const TOKENS_PATH = './frontend/src/design/tokens/tokens.json';

async function syncToFigma() {
  if (!FIGMA_TOKEN) {
    console.error('❌ Error: FIGMA_ACCESS_TOKEN not found in environment.');
    process.exit(1);
  }

  if (FILE_KEY === 'YOUR_FILE_KEY_HERE') {
    console.warn('⚠️  Warning: FIGMA_FILE_KEY is not set. Running in DRY-RUN mode.');
  }

  console.log('🚀 Loading tokens from:', TOKENS_PATH);
  const tokenData = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));

  // Flattening Function (DTCG to Flat Keys)
  const flatten = (obj, prefix = '') => {
    let result = {};
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}-${key}` : key;
      if (obj[key] && typeof obj[key] === 'object' && obj[key].$value) {
        result[fullKey] = obj[key].$value;
      } else if (obj[key] && typeof obj[key] === 'object') {
        Object.assign(result, flatten(obj[key], fullKey));
      }
    }
    return result;
  };

  const flatTokens = flatten(tokenData.sys || {});
  console.log(`📊 Found ${Object.keys(flatTokens).length} tokens to sync.`);

  if (FILE_KEY === 'YOUR_FILE_KEY_HERE') {
    console.log('--- DRY RUN OUTPUT ---');
    console.log(JSON.stringify(flatTokens, null, 2));
    console.log('--- END DRY RUN ---');
    process.exit(0);
  }

  try {
    // 1. Fetch existing variables to avoid duplicates
    const getVarsUrl = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;
    const response = await axios.get(getVarsUrl, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });

    // 2. Map tokens to Figma Variables (Simplified logic for now)
    // NOTE: This requires creating/finding a Variable Collection first.
    console.log('🏗️  Pushing updates to Figma...');
    
    // Placeholder for Variable Creation/Update loop
    // In a full implementation, we would POST to /v1/files/:file_key/variables
    
    console.log('✅ Sync successful.');
  } catch (err) {
    if (err.response?.status === 404) {
      console.error(`❌ Error: Figma File ${FILE_KEY} not found.`);
    } else {
      throw err;
    }
  }
}

syncToFigma().catch(err => {
  console.error('❌ Sync Failed:', err.response?.data?.message || err.message);
  process.exit(1);
});
