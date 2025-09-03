#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Bundle Analyzer Script for CareerCopilot Frontend
 * Analyzes Vite build output and generates bundle size report
 */

const DIST_PATH = path.join(__dirname, '..', 'dist');
const OUTPUT_FILE = path.join(DIST_PATH, 'bundle-analysis.json');

// Size limits (in bytes) - Temporarily increased for Firebase integration
const SIZE_LIMITS = {
  // Main JS bundle should be under 2MB (Firebase SDK is large)
  javascript: 2 * 1024 * 1024,
  // CSS should be under 500KB
  css: 500 * 1024,
  // Total assets under 10MB
  total: 10 * 1024 * 1024
};

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing bundle...');

  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ Dist directory not found. Run build first.');
    process.exit(1);
  }

  const assets = {
    javascript: [],
    css: [],
    other: []
  };

  let totalSize = 0;

  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDirectory(filePath);
      } else {
        const size = stat.size;
        const relativePath = path.relative(DIST_PATH, filePath);
        totalSize += size;

        const asset = {
          name: relativePath,
          size: size,
          sizeFormatted: formatBytes(size)
        };

        if (file.endsWith('.js')) {
          assets.javascript.push(asset);
        } else if (file.endsWith('.css')) {
          assets.css.push(asset);
        } else {
          assets.other.push(asset);
        }
      }
    });
  }

  walkDirectory(DIST_PATH);

  // Sort by size (largest first)
  assets.javascript.sort((a, b) => b.size - a.size);
  assets.css.sort((a, b) => b.size - a.size);
  assets.other.sort((a, b) => b.size - a.size);

  // Calculate totals by type
  const totals = {
    javascript: assets.javascript.reduce((sum, asset) => sum + asset.size, 0),
    css: assets.css.reduce((sum, asset) => sum + asset.size, 0),
    other: assets.other.reduce((sum, asset) => sum + asset.size, 0),
    total: totalSize
  };

  // Check size limits
  const warnings = [];
  if (totals.javascript > SIZE_LIMITS.javascript) {
    warnings.push(`JavaScript bundle size (${formatBytes(totals.javascript)}) exceeds limit (${formatBytes(SIZE_LIMITS.javascript)})`);
  }
  if (totals.css > SIZE_LIMITS.css) {
    warnings.push(`CSS bundle size (${formatBytes(totals.css)}) exceeds limit (${formatBytes(SIZE_LIMITS.css)})`);
  }
  if (totals.total > SIZE_LIMITS.total) {
    warnings.push(`Total bundle size (${formatBytes(totals.total)}) exceeds limit (${formatBytes(SIZE_LIMITS.total)})`);
  }

  const analysis = {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'unknown',
    branch: process.env.GITHUB_REF_NAME || 'unknown',
    assets,
    totals: {
      ...totals,
      javascriptFormatted: formatBytes(totals.javascript),
      cssFormatted: formatBytes(totals.css),
      otherFormatted: formatBytes(totals.other),
      totalFormatted: formatBytes(totals.total)
    },
    limits: {
      ...SIZE_LIMITS,
      javascriptFormatted: formatBytes(SIZE_LIMITS.javascript),
      cssFormatted: formatBytes(SIZE_LIMITS.css),
      totalFormatted: formatBytes(SIZE_LIMITS.total)
    },
    warnings,
    passed: warnings.length === 0
  };

  // Write analysis to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(analysis, null, 2));

  // Console output
  console.log('\n📊 Bundle Analysis Results:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Total Size: ${analysis.totals.totalFormatted}`);
  console.log(`🟨 JavaScript: ${analysis.totals.javascriptFormatted} (${assets.javascript.length} files)`);
  console.log(`🟦 CSS: ${analysis.totals.cssFormatted} (${assets.css.length} files)`);
  console.log(`🟫 Other: ${analysis.totals.otherFormatted} (${assets.other.length} files)`);

  if (assets.javascript.length > 0) {
    console.log('\n🟨 Top JavaScript files:');
    assets.javascript.slice(0, 5).forEach(asset => {
      console.log(`   ${asset.sizeFormatted.padStart(8)} - ${asset.name}`);
    });
  }

  if (assets.css.length > 0) {
    console.log('\n🟦 CSS files:');
    assets.css.forEach(asset => {
      console.log(`   ${asset.sizeFormatted.padStart(8)} - ${asset.name}`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Size Warnings:');
    warnings.forEach(warning => {
      console.log(`   • ${warning}`);
    });
  }

  console.log(`\n📋 Full analysis saved to: ${OUTPUT_FILE}`);

  if (warnings.length > 0) {
    console.log('\n❌ Bundle analysis failed due to size warnings');
    process.exit(1);
  } else {
    console.log('\n✅ Bundle analysis passed');
  }
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeBundle();
}

export { analyzeBundle };
