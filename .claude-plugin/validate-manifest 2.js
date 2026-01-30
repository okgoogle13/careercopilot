#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginJsonPath = path.join(__dirname, 'plugin.json');
const marketplaceJsonPath = path.join(__dirname, 'marketplace.json');

function validateJSON(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✓ ${fileName} - Valid JSON`);
    return true;
  } catch (error) {
    console.error(`✗ ${fileName} - ${error.message}`);
    return false;
  }
}

function validatePlugin(pluginJson) {
  const required = ['name', 'version', 'displayName', 'description', 'capabilities', 'requiredPermissions'];
  const missing = required.filter(field => !pluginJson[field]);

  if (missing.length > 0) {
    console.error(`✗ Missing required fields: ${missing.join(', ')}`);
    return false;
  }

  console.log('✓ Plugin has all required fields');
  return true;
}

function validateMarketplace(marketplaceJson) {
  const required = ['name', 'source', 'description'];
  const missing = required.filter(field => !marketplaceJson[field]);

  if (missing.length > 0) {
    console.error(`✗ Missing required marketplace fields: ${missing.join(', ')}`);
    return false;
  }

  if (!marketplaceJson.source.url) {
    console.error('✗ Marketplace source.url is required');
    return false;
  }

  console.log('✓ Marketplace config has all required fields');
  return true;
}

async function main() {
  console.log('Validating Claude plugin configuration...\n');

  let allValid = true;

  // Validate plugin.json
  console.log('Checking plugin.json:');
  allValid &= validateJSON(pluginJsonPath, 'plugin.json');
  if (allValid) {
    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    allValid &= validatePlugin(pluginJson);
  }

  console.log();

  // Validate marketplace.json
  console.log('Checking marketplace.json:');
  allValid &= validateJSON(marketplaceJsonPath, 'marketplace.json');
  if (allValid) {
    const marketplaceJson = JSON.parse(fs.readFileSync(marketplaceJsonPath, 'utf8'));
    allValid &= validateMarketplace(marketplaceJson);
  }

  console.log();

  // Check README
  const readmePath = path.join(__dirname, 'README.md');
  if (fs.existsSync(readmePath)) {
    console.log('✓ README.md found');
  } else {
    console.log('✗ README.md not found');
    allValid = false;
  }

  console.log();

  if (allValid) {
    console.log('✓ All validation checks passed');
    process.exit(0);
  } else {
    console.log('✗ Validation failed');
    process.exit(1);
  }
}

main();
