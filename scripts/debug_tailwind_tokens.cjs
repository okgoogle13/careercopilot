#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load tokens
const tokensPath = path.join(__dirname, '../frontend/src/design/tokens/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Test getValue with actual Tailwind paths
function getValue(tokenPath) {
  const keys = tokenPath.split('.');
  let current = tokens;

  for (const key of keys) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[key];
  }

  if (!current) return undefined;

  if (typeof current === 'object') {
    if ('$value' in current) return current.$value;
    if ('value' in current) return current.value;
    return current;  // Return object (THIS IS THE PROBLEM)
  }

  return current;
}

// Test common Tailwind paths from config
const testPaths = [
  'color.semantic.wattle-gold',
  'color.semantic.waratah-crimson',
  'spacing.xs',
  'spacing.sm',
  'radius.pebble',
  'shadow.rest',
  'motion.easing.viscous-breeze'
];

console.log('Testing Tailwind token paths:\n');

testPaths.forEach(path => {
  const value = getValue(path);
  const type = typeof value;
  const isObject = type === 'object';
  const status = isObject ? '❌ OBJECT (BROKEN)' : '✅ PRIMITIVE';

  console.log(`${status} ${path}`);
  console.log(`  Type: ${type}`);
  console.log(`  Value: ${JSON.stringify(value, null, 2)}`);
  console.log('');
});
