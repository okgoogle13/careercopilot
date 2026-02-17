#!/usr/bin/env node
/**
 * Asset Token Replacer - Replace TODO[asset] markers with canonical tokens
 * Reads token map, performs semantic matching, preserves context
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_MAP_PATH = path.join(__dirname, '../../frontend/public/assets/kr-solidarity-ui-token-map.json');
const HIFI_DIR = path.join(__dirname, '../../docs/design/hifi');

// Semantic matchers for TODO descriptions → token IDs
const SEMANTIC_MATCHERS = [
  // Primary UI-KIT assets (001-007)
  { pattern: /wheat.?paste|torn.?edge|tear/i, token: 'KR-UI-001' },
  { pattern: /halo.?disk|radiant.?circle/i, token: 'KR-UI-002' },
  { pattern: /screenprint.?grit|particles|dust/i, token: 'KR-UI-003' },
  { pattern: /blueprint.?grid|technical.?grid|field.?grid/i, token: 'KR-UI-004' },
  { pattern: /charcoal.?paper|neutral.?base/i, token: 'KR-UI-005' },
  { pattern: /blueprint.?layout|watermark|field.?layout/i, token: 'KR-UI-006' },
  { pattern: /screenprint.?stamp|verified|stamp|ink.?slam/i, token: 'KR-UI-007' },

  // Motifs & Icons (008-019)
  { pattern: /elite.?mastery|mastery.?motif/i, token: 'KR-UI-008' },
  { pattern: /mastery.?chart|chart.?pattern/i, token: 'KR-UI-009' },
  { pattern: /success.?screen|success.?motif/i, token: 'KR-UI-010' },
  { pattern: /historical.?record|history.?texture/i, token: 'KR-UI-011' },
  { pattern: /metric.?motif|metric.?graph/i, token: 'KR-UI-012' },
  { pattern: /scanning|holographic/i, token: 'KR-UI-013' },
  { pattern: /resolved.?card|card.?motif/i, token: 'KR-UI-014' },
  { pattern: /priority.?indicator|priority.?halo/i, token: 'KR-UI-015' },
  { pattern: /status.?icon/i, token: 'KR-UI-016' },
  { pattern: /skill.?badge|achievement.?badge/i, token: 'KR-UI-017' },
  { pattern: /grid.?corner|corner.?motif/i, token: 'KR-UI-018' },
  { pattern: /reservoir|motif.?reservoir/i, token: 'KR-UI-019' },

  // KR-SOLID assets
  { pattern: /substrate|laneway|melbourne/i, token: 'KR-SOLID-033' },
  { pattern: /atmospheric|abstract.?solidarity|ink.?atmosphere/i, token: 'KR-SOLID-011' },
  { pattern: /paint.?splash|dynamic.?overlay/i, token: 'KR-SOLID-029' },
  { pattern: /shiva|devotional.?anchor/i, token: 'KR-SOLID-021' },
  { pattern: /elephant|kerala.?elephant/i, token: 'KR-SOLID-031' },
  { pattern: /bhagat.?singh/i, token: 'KR-SOLID-024' },
  { pattern: /trishula/i, token: 'KR-SOLID-031' }, // Fallback to elephant if specific icon not in series yet
];

function loadTokenMap() {
  const data = fs.readFileSync(TOKEN_MAP_PATH, 'utf8');
  return JSON.parse(data);
}

function semanticMatch(todoText, tokenMap) {
  for (const matcher of SEMANTIC_MATCHERS) {
    if (matcher.pattern.test(todoText)) {
      return matcher.token;
    }
  }
  return null; // No match found
}

function extractContext(todoLine) {
  // Extract z-index, opacity, position from TODO comment
  const zIndexMatch = todoLine.match(/z.?index[:\s]+(\d+|z-\d+)/i);
  const opacityMatch = todoLine.match(/opacity[:\s]+([0-9.]+|[0-9]+%)/i);
  const positionMatch = todoLine.match(/position[:\s]+(\w+)/i);

  return {
    zIndex: zIndexMatch ? zIndexMatch[1] : null,
    opacity: opacityMatch ? opacityMatch[1] : null,
    position: positionMatch ? positionMatch[1] : null,
    original: todoLine.trim(),
  };
}

function replaceMarker(content, tokenMap) {
  const todoRegex = /(?:\/\/|-)\s*TODO\[asset\]:\s*(.+?)(?=\n|$)/g;
  let replacements = 0;
  let unmatchedMarkers = [];

  const replaced = content.replace(todoRegex, (match, todoText) => {
    const token = semanticMatch(todoText, tokenMap);
    const context = extractContext(match);

    if (!token) {
      unmatchedMarkers.push({ todo: todoText, context });
      return match; // Keep original if no match
    }

    const tokenKey = Object.keys(tokenMap.tokens).find(
      k => tokenMap.tokens[k].ref === token
    );
    const tokenInfo = tokenKey ? tokenMap.tokens[tokenKey] : null;

    let replacement = `{${token}}`;
    if (tokenInfo) replacement += ` ${tokenInfo.description}`;
    if (context.zIndex) replacement += ` (Z-${context.zIndex}`;
    if (context.opacity) replacement += `, ${context.opacity} opacity`;
    replacement += `)`;

    // Mark planned assets
    if (tokenInfo && tokenInfo.status === 'planned') {
      replacement += ' **[REQUIRES GENERATION]**';
    }

    replacements++;
    return `- ${replacement}`;
  });

  return { replaced, replacements, unmatchedMarkers };
}

async function processAllBlueprints() {
  if (!fs.existsSync(HIFI_DIR)) {
    console.error(`❌ Directory not found: ${HIFI_DIR}`);
    process.exit(1);
  }

  const tokenMap = loadTokenMap();
  const files = fs.readdirSync(HIFI_DIR).filter(f => f.endsWith('-hifi.md'));

  let totalReplacements = 0;
  let allUnmatched = [];

  for (const file of files) {
    const filePath = path.join(HIFI_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const { replaced, replacements, unmatchedMarkers } = replaceMarker(content, tokenMap);

    if (replacements > 0) {
      fs.writeFileSync(filePath, replaced, 'utf8');
      console.log(`✅ ${file}: ${replacements} markers replaced`);
      totalReplacements += replacements;
    } else {
      console.log(`⏭️  ${file}: no markers found`);
    }

    if (unmatchedMarkers.length > 0) {
      allUnmatched.push({ file, markers: unmatchedMarkers });
    }
  }

  console.log(`\n📊 Total replacements: ${totalReplacements}`);

  if (allUnmatched.length > 0) {
    console.log(`\n⚠️  Unmatched markers (${allUnmatched.reduce((sum, u) => sum + u.markers.length, 0)} total):`);
    allUnmatched.forEach(({ file, markers }) => {
      console.log(`\n  ${file}:`);
      markers.forEach(m => console.log(`    - ${m.todo}`));
    });
  }

  // Return exit code based on unmatched markers
  process.exit(allUnmatched.length > 0 ? 1 : 0);
}

processAllBlueprints().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
