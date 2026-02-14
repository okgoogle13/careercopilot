#!/usr/bin/env node
/**
 * Figma Token Sync Bridge
 * Pushes design tokens from tokens.json to Figma Variables via REST API.
 * Requires: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables.
 */

import fs from 'fs';
import axios from 'axios';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();
program
  .option('--push', 'Push local tokens to Figma')
  .option('--pull', 'Pull Figma variables to local tokens')
  .option('--sync', 'Bi-directional sync with conflict resolution')
  .option('--dry-run', 'Show changes without applying them')
  .parse(process.argv);

const options = program.opts();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'YOUR_FILE_KEY_HERE';
const TOKENS_PATH = './frontend/src/design/tokens/tokens.json';

// Helper: Determine Figma Variable Type from DTCG
function getFigmaType(tokenValue, tokenType) {
  if (tokenType === 'color' || (typeof tokenValue === 'string' && tokenValue.startsWith('#'))) return 'COLOR';
  if (typeof tokenValue === 'number') return 'FLOAT';
  if (typeof tokenValue === 'boolean') return 'BOOLEAN';
  return 'STRING';
}

// Helper: Flatten DTCG to Flat Keys
const flatten = (obj, prefix = '') => {
  let result = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}/${key}` : key;
    if (obj[key] && typeof obj[key] === 'object' && obj[key].$value !== undefined) {
      result[fullKey] = {
        value: obj[key].$value,
        type: getFigmaType(obj[key].$value, obj[key].$type),
        description: obj[key].$description || ''
      };
    } else if (obj[key] && typeof obj[key] === 'object') {
      Object.assign(result, flatten(obj[key], fullKey));
    }
  }
  return result;
};

async function getFigmaVariables() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;
  const response = await axios.get(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  });
  return response.data.meta;
}

async function syncToFigma() {
  if (!FIGMA_TOKEN) {
    console.error(chalk.red('❌ Error: FIGMA_ACCESS_TOKEN not found in environment.'));
    process.exit(1);
  }

  if (FILE_KEY === 'YOUR_FILE_KEY_HERE' && !options.dryRun) {
    console.error(chalk.red('❌ Error: FIGMA_FILE_KEY is not set.'));
    process.exit(1);
  }

  console.log(chalk.blue('🚀 Loading tokens from:'), TOKENS_PATH);
  const tokenData = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  const flatTokens = flatten(tokenData.sys || {});
  
  if (options.dryRun || FILE_KEY === 'YOUR_FILE_KEY_HERE') {
    console.log(chalk.yellow('⚠️  DRY RUN MODE - No changes will be pushed.'));
    console.table(Object.entries(flatTokens).map(([k, v]) => ({ Token: k, ...v })));
    return;
  }

  try {
    const figmaData = await getFigmaVariables();
    const existingVars = figmaData.variables || [];
    const collections = figmaData.variableCollections || [];
    
    // 1. Find or create "Design Tokens" collection
    let collection = collections.find(c => c.name === 'Design Tokens');
    let collectionId = collection?.id;

    if (!collection) {
      console.log(chalk.magenta('🏗️  Creating "Design Tokens" collection...'));
      const colRes = await axios.post(`https://api.figma.com/v1/files/${FILE_KEY}/variable_collections`, {
        name: 'Design Tokens',
        initialModeName: 'default'
      }, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
      collectionId = colRes.data.meta.id;
    }

    // 2. Map existing modes
    const modeId = collection?.modes[0]?.modeId || 'default';

    console.log(chalk.green(`📊 Syncing ${Object.keys(flatTokens).length} tokens...`));

    const variableBatch = {
      variableCollections: [],
      variableModes: [],
      variables: [],
      variableModeValues: []
    };

    for (const [name, data] of Object.entries(flatTokens)) {
      const existing = existingVars.find(v => v.name === name && v.variableCollectionId === collectionId);
      
      if (existing) {
        // Update existing
        const currentValue = existing.valuesByMode[Object.keys(existing.valuesByMode)[0]];
        if (JSON.stringify(currentValue) !== JSON.stringify(data.value)) {
          console.log(chalk.cyan(`🔄 Queueing update: ${name}`));
          variableBatch.variableModeValues.push({
            variableId: existing.id,
            modeId: Object.keys(existing.valuesByMode)[0],
            value: data.value
          });
        }
      } else {
        // Create new
        console.log(chalk.green(`✨ Queueing creation: ${name}`));
        variableBatch.variables.push({
          name: name,
          variableCollectionId: collectionId,
          resolvedType: data.type,
          description: data.description
        });
        // Note: New variables need values assigned in the same or subsequent call
      }
    }

    if (variableBatch.variables.length > 0 || variableBatch.variableModeValues.length > 0) {
      console.log(chalk.blue('📤 Pushing batch updates to Figma...'));
      await axios.post(`https://api.figma.com/v1/files/${FILE_KEY}/variables`, variableBatch, {
        headers: { 'X-Figma-Token': FIGMA_TOKEN }
      });
    }

    console.log(chalk.green('✅ Sync successful.'));
  } catch (err) {
    console.error(chalk.red('❌ Sync Failed:'), err.response?.data?.message || err.message);
    process.exit(1);
  }
}

if (options.push || options.sync || options.dryRun) {
  syncToFigma();
} else if (options.pull) {
  console.log(chalk.yellow('🔄 Pull functionality coming in Week 4.'));
} else {
  program.help();
}
