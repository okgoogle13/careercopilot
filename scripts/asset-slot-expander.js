#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const out = {
    manifest: 'frontend/public/assets/kerala-rage-kr-solidarity-manifest.json',
    wireframes: '.claude/wireframes',
    report: '.claude/wireframes/placement_report.json',
    batchSize: 20,
    targetUsed: null,
    preferSparseOnly: true,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const n = argv[i + 1];
    if (a === '--manifest' && n) out.manifest = n;
    if (a === '--wireframes' && n) out.wireframes = n;
    if (a === '--report' && n) out.report = n;
    if (a === '--batch-size' && n) out.batchSize = Number.parseInt(n, 10);
    if (a === '--target-used' && n) out.targetUsed = Number.parseInt(n, 10);
    if (a === '--prefer-sparse-only' && n) out.preferSparseOnly = n !== 'false';
  }

  return out;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function classify(asset) {
  const category = String(asset.category || '').toLowerCase();
  const layer = String(asset.layer || '').toLowerCase();

  if (layer === 'substrate' || category === 'substrate') {
    return { z: 'Z-0', token: '--sys-color-charcoalBackground-base' };
  }

  if (['atmospheric', 'cultural', 'resistance'].includes(layer) || ['atmospheric', 'cultural', 'resistance'].includes(category)) {
    return { z: 'Z-1', token: '--sys-color-protestMetalBlue-base' };
  }

  return { z: 'Z-3', token: '--sys-color-inkGold-base' };
}

function ensureAssetsBlock(xml) {
  if (xml.includes('<assets>')) return xml;

  const block = [
    '  <assets>',
    '  </assets>',
  ].join('\n');

  if (xml.includes('</wireframe>')) {
    return xml.replace('</wireframe>', `${block}\n\n</wireframe>`);
  }

  return `${xml.trimEnd()}\n${block}\n`;
}

function addSlot(xml, slotName, zLayer, token, todoText) {
  const slot = [
    `    <slot name="${slotName}" z_layer="${zLayer}" token="${token}">`,
    `      ${todoText}`,
    '    </slot>',
    '',
  ].join('\n');

  const idx = xml.indexOf('</assets>');
  if (idx === -1) return xml;
  return `${xml.slice(0, idx)}${slot}${xml.slice(idx)}`;
}

function main() {
  const args = parseArgs(process.argv);
  const manifest = readJson(args.manifest);
  const report = readJson(args.report);

  const assets = manifest.assets || [];
  const usedIds = new Set((report.used_assets || []).map((x) => x.asset_id));

  const xmlFiles = fs
    .readdirSync(args.wireframes)
    .filter((f) => /^\d+_.*\.xml$/.test(f))
    .sort();

  const withAssets = [];
  const withoutAssets = [];
  for (const f of xmlFiles) {
    const p = path.join(args.wireframes, f);
    const txt = fs.readFileSync(p, 'utf8');
    if (txt.includes('<assets>')) withAssets.push(f);
    else withoutAssets.push(f);
  }

  const preferredTargets = args.preferSparseOnly && withoutAssets.length > 0 ? withoutAssets : xmlFiles;

  const currentUsed = usedIds.size;
  const targetUsed = args.targetUsed || (currentUsed + args.batchSize);
  const needed = Math.max(0, targetUsed - currentUsed);
  const budget = Math.min(args.batchSize, needed > 0 ? needed : args.batchSize);

  const candidates = assets.filter((a) => !usedIds.has(a.id)).slice(0, budget);

  if (candidates.length === 0) {
    console.log(JSON.stringify({ changed_files: [], slots_added: 0, message: 'No unused assets left in current report.' }, null, 2));
    return;
  }

  const changed = new Map();

  for (let i = 0; i < candidates.length; i += 1) {
    const asset = candidates[i];
    const wf = preferredTargets[i % preferredTargets.length];
    const wfPath = path.join(args.wireframes, wf);

    let xml = changed.has(wfPath) ? changed.get(wfPath) : fs.readFileSync(wfPath, 'utf8');
    xml = ensureAssetsBlock(xml);

    const { z, token } = classify(asset);
    const safeId = asset.id.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const slotName = `auto_${safeId}`;
    const todoText = `TODO[asset] asset_id=${asset.id};category=${asset.category};layer=${asset.layer};aspect=${asset.aspect_ratio};priority=${asset.priority}`;

    if (!xml.includes(`name="${slotName}"`)) {
      xml = addSlot(xml, slotName, z, token, todoText);
    }

    changed.set(wfPath, xml);
  }

  for (const [p, content] of changed.entries()) {
    fs.writeFileSync(p, content, 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        changed_files: Array.from(changed.keys()),
        slots_added: candidates.length,
        target_wireframes: preferredTargets,
        batch_assets: candidates.map((a) => a.id),
      },
      null,
      2,
    ),
  );
}

main();
