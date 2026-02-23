#!/usr/bin/env node
/**
 * KR-UI Integration Validation Script
 * Validates Stage 2/3 integration requirements:
 * - SVG files exist for KR-UI-001..019
 * - Token map paths are non-null for ready items
 * - No blueprint TODOs or deprecated markers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '../..');
const TOKEN_MAP_PATH = path.join(PROJECT_ROOT, 'frontend/public/assets/kr-solidarity-ui-token-map.json');
const SVG_BASE = path.join(PROJECT_ROOT, 'frontend/public/assets/kr-solidarity/ui-kit/svg');
const HIFI_DIR = path.join(PROJECT_ROOT, 'docs/design/hifi');

let errorCount = 0;

function error(msg) {
  console.error(`❌ ${msg}`);
  errorCount++;
}

function success(msg) {
  console.log(`✅ ${msg}`);
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
}

// 1. Validate SVG files exist for KR-UI-001..019
function validateSvgFiles() {
  console.log('\n📂 Validating SVG files...');

  const tokenMap = JSON.parse(fs.readFileSync(TOKEN_MAP_PATH, 'utf8'));
  const tokens = Object.values(tokenMap.tokens).filter(t =>
    t.ref && t.ref.startsWith('KR-UI-')
  );

  for (const token of tokens) {
    const id = token.ref;
    const num = parseInt(id.replace('KR-UI-', ''));

    if (num < 1 || num > 19) continue;

    const canonical = token.canonical_svg_path || token.path;
    if (!canonical) {
      error(`${id}: Missing canonical_svg_path in token map`);
      continue;
    }

    const fullPath = path.join(PROJECT_ROOT, 'frontend/public', canonical);
    if (!fs.existsSync(fullPath)) {
      error(`${id}: SVG file not found at ${fullPath}`);
    } else {
      success(`${id}: SVG exists at ${canonical}`);
    }
  }
}

// 2. Validate token map paths are non-null for ready items
function validateTokenMapPaths() {
  console.log('\n🗺️  Validating token map paths...');

  const tokenMap = JSON.parse(fs.readFileSync(TOKEN_MAP_PATH, 'utf8'));

  // Check ui_kit_gaps
  for (const gap of tokenMap.ui_kit_gaps || []) {
    if (gap.status === 'ready') {
      const token = Object.values(tokenMap.tokens).find(t => t.ref === gap.id);
      if (!token) {
        error(`${gap.id}: Marked ready in ui_kit_gaps but not found in tokens`);
        continue;
      }

      const path = token.canonical_svg_path || token.path;
      if (!path || path === 'null') {
        error(`${gap.id}: Ready status but null/missing path`);
      } else {
        success(`${gap.id}: Ready with valid path`);
      }
    }
  }
}

// 3. Validate no blueprint contains TODO or deprecated markers
function validateBlueprints() {
  console.log('\n📄 Validating blueprint files...');

  if (!fs.existsSync(HIFI_DIR)) {
    warn(`Hi-fi directory not found: ${HIFI_DIR}`);
    return;
  }

  const files = fs.readdirSync(HIFI_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(HIFI_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const todoMatches = content.match(/TODO\[asset\]/g);
    const deprecatedMatches = content.match(/\[DEPRECATED_STYLE\]/g);
    const needsTokenMatches = content.match(/Needs Token/gi);

    if (todoMatches) {
      error(`${file}: Contains ${todoMatches.length} TODO[asset] markers`);
    }

    if (deprecatedMatches) {
      error(`${file}: Contains ${deprecatedMatches.length} [DEPRECATED_STYLE] markers`);
    }

    if (needsTokenMatches) {
      error(`${file}: Contains ${needsTokenMatches.length} "Needs Token" markers`);
    }

    if (!todoMatches && !deprecatedMatches && !needsTokenMatches) {
      success(`${file}: Clean (no TODO/deprecated markers)`);
    }
  }
}

// 4. Validate render modes in token map
function validateRenderModes() {
  console.log('\n🎨 Validating render modes...');

  const VALID_MODES = [
    'backgroundZ0',
    'watermarkZ0',
    'overlayContained',
    'frameAccent',
    'inline24',
    'stateStamp',
    'overlay',
    'chartFill',
    'frame',
    'tile'
  ];

  const tokenMap = JSON.parse(fs.readFileSync(TOKEN_MAP_PATH, 'utf8'));
  const tokens = Object.values(tokenMap.tokens).filter(t =>
    t.ref && t.ref.startsWith('KR-UI-') && t.render_mode
  );

  for (const token of tokens) {
    if (!VALID_MODES.includes(token.render_mode)) {
      error(`${token.ref}: Invalid render_mode "${token.render_mode}"`);
    } else {
      success(`${token.ref}: Valid render_mode "${token.render_mode}"`);
    }
  }
}

// Main execution
console.log('🚀 KR-UI Integration Validation');
console.log('================================\n');

validateSvgFiles();
validateTokenMapPaths();
validateBlueprints();
validateRenderModes();

console.log('\n================================');
if (errorCount === 0) {
  console.log('✅ All validations passed!');
  process.exit(0);
} else {
  console.error(`❌ ${errorCount} error(s) found`);
  process.exit(1);
}
