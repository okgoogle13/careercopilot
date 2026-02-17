#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenMapPath = path.join(
  __dirname,
  '../../frontend/public/assets/kr-solidarity-ui-token-map.json'
);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function idNumber(id) {
  return Number(String(id).replace('KR-UI-', ''));
}

function canonicalForRef(tokens, ref) {
  const token = Object.values(tokens).find((entry) => entry?.ref === ref);
  if (!token) return null;
  return token.path || token.canonical_svg_path || null;
}

function promoteUiEntries(doc) {
  doc.tokens = doc.tokens || {};
  const gaps = Array.isArray(doc.ui_kit_gaps) ? doc.ui_kit_gaps : [];
  const keep = [];
  const promote = [];

  for (const gap of gaps) {
    const num = idNumber(gap.id);
    if (num >= 8 && num <= 19) {
      promote.push(gap);
    } else {
      if (num >= 1 && num <= 7) {
        gap.status = 'ready';
      }
      keep.push(gap);
    }
  }

  for (const item of promote) {
    const key = `kr-asset-${slugify(item.name || item.id)}`;
    const canonical = item.canonical_svg_path;
    const entry = {
      ref: item.id,
      path: canonical,
      type: 'ui-kit',
      id: item.id,
      name: item.name,
      kind: item.kind,
      render_mode: item.render_mode,
      canonical_svg_path: canonical,
      scale_safe: item.scale_safe,
      status: 'ready',
    };
    if (Object.prototype.hasOwnProperty.call(item, 'opacity_default')) {
      entry.opacity_default = item.opacity_default;
    }
    if (item.description) {
      entry.description = item.description;
    }

    const existingKey = Object.keys(doc.tokens).find((k) => doc.tokens[k]?.ref === item.id);
    doc.tokens[existingKey || key] = entry;
  }

  doc.ui_kit_gaps = keep;
}

function fixAliases(doc) {
  const tokens = doc.tokens || {};
  const aliases = [
    ['kr-asset-field-grid', 'KR-UI-004'],
    ['kr-asset-field-layout', 'KR-UI-006'],
    ['kr-asset-ink-slam-mark', 'KR-UI-007'],
  ];

  for (const [key, ref] of aliases) {
    if (!tokens[key]) continue;
    const canonical = canonicalForRef(tokens, ref);
    if (canonical) {
      tokens[key].path = canonical;
      tokens[key].status = 'ready';
    }
  }
}

function main() {
  const raw = fs.readFileSync(tokenMapPath, 'utf8');
  const doc = JSON.parse(raw);

  promoteUiEntries(doc);
  fixAliases(doc);
  doc.version = '1.1.0';
  doc.updated = new Date().toISOString();

  fs.writeFileSync(tokenMapPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  console.log('Updated token map to 1.1.0 with KR-UI-008..019 promoted.');
}

main();
