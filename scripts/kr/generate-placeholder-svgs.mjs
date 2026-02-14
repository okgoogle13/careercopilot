#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenMapPath = path.join(
  __dirname,
  '../../frontend/public/assets/kr-solidarity-ui-token-map.json'
);
const publicRoot = path.join(__dirname, '../../frontend/public');

function toLocalAssetPath(assetPath) {
  if (!assetPath.startsWith('/assets/')) {
    throw new Error(`Invalid canonical_svg_path: ${assetPath}`);
  }
  return path.join(publicRoot, assetPath.replace(/^\//, ''));
}

function placeholderSvg(entry) {
  const title = `${entry.id} ${entry.name}`;
  const desc = `Contract-valid placeholder for ${entry.id}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="${entry.id}-title ${entry.id}-desc">
  <title id="${entry.id}-title">${title}</title>
  <desc id="${entry.id}-desc">${desc}</desc>
  <g id="base">
    <rect x="32" y="32" width="448" height="448" rx="32" fill="var(--kr-surface)" stroke="var(--kr-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g id="content">
    <path d="M96 352 L176 272 L256 320 L336 208 L416 256" fill="none" stroke="var(--kr-primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="176" cy="272" r="16" fill="var(--kr-secondary)"/>
    <circle cx="336" cy="208" r="16" fill="var(--kr-secondary)"/>
  </g>
  <g id="accent">
    <path d="M128 128 Q256 64 384 128" fill="none" stroke="var(--kr-tertiary)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M128 384 Q256 448 384 384" fill="none" stroke="var(--kr-text)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;
}

function loadTokenMap() {
  return JSON.parse(fs.readFileSync(tokenMapPath, 'utf8'));
}

function isTargetId(id) {
  const n = Number(id.replace('KR-UI-', ''));
  return n >= 8 && n <= 19;
}

function main() {
  const tokenMap = loadTokenMap();
  const gaps = Array.isArray(tokenMap.ui_kit_gaps) ? tokenMap.ui_kit_gaps : [];
  const targets = gaps.filter((item) => item?.id && isTargetId(item.id));

  if (targets.length !== 12) {
    throw new Error(`Expected 12 KR-UI entries (008-019), found ${targets.length}`);
  }

  let written = 0;

  for (const entry of targets) {
    if (!entry.canonical_svg_path) {
      throw new Error(`Missing canonical_svg_path for ${entry.id}`);
    }
    const localPath = toLocalAssetPath(entry.canonical_svg_path);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, placeholderSvg(entry), 'utf8');
    written += 1;
  }

  console.log(`Wrote ${written} placeholder SVGs.`);
}

main();
