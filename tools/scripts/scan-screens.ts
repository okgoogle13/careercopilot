// scan-screens.ts — Phase 1.2: Screen Scanner
// Walks frontend/src/screens/*/, reads each mapping.json,
// checks for presence of .wireframe.xml and .tsx files,
// and emits docs/manifests/screens.json.
// Usage:  npx tsx tools/scripts/scan-screens.ts

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const SCREENS_DIR = path.join(ROOT, 'frontend/src/screens');
const OUT = path.join(ROOT, 'docs/manifests/screens.json');

interface ScreenEntry {
  screenId: string;
  dirPath: string;
  hasMapping: boolean;
  hasWireframe: boolean;
  hasTsx: boolean;
  isPaired: boolean;
  mapping: Record<string, unknown> | null;
  wireframePath: string | null;
  tsxFiles: string[];
}

function main() {
  const entries = fs.readdirSync(SCREENS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{2}_/.test(d.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const screens: ScreenEntry[] = [];
  let paired = 0;
  let unpaired = 0;

  for (const dir of entries) {
    const dirPath = path.join(SCREENS_DIR, dir.name);
    const files = fs.readdirSync(dirPath);

    const mappingFile = files.find(f => f === 'mapping.json');
    const wireframeFile = files.find(f => f.endsWith('.wireframe.xml'));
    const tsxFiles = files.filter(f => f.endsWith('.tsx'));

    let mapping: Record<string, unknown> | null = null;
    if (mappingFile) {
      try {
        mapping = JSON.parse(fs.readFileSync(path.join(dirPath, mappingFile), 'utf-8'));
      } catch (_e) {
        mapping = null;
      }
    }

    const hasWireframe = !!wireframeFile;
    const hasTsx = tsxFiles.length > 0;
    const hasMapping = !!mappingFile;
    const isPaired = hasWireframe && hasTsx && hasMapping;

    if (isPaired) paired++;
    else unpaired++;

    screens.push({
      screenId: dir.name,
      dirPath: path.relative(ROOT, dirPath),
      hasMapping,
      hasWireframe,
      hasTsx,
      isPaired,
      mapping,
      wireframePath: wireframeFile ? path.join(dir.name, wireframeFile) : null,
      tsxFiles,
    });
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: screens.length,
    paired,
    unpaired,
    screens,
  }, null, 2));

  console.log(`✅ Scanned ${screens.length} screen directories → ${path.relative(ROOT, OUT)}`);
  console.log(`   Paired (XML + TSX + mapping): ${paired}`);
  console.log(`   Unpaired: ${unpaired}`);

  if (unpaired > 0) {
    console.log('\n⚠️  Unpaired screens:');
    for (const s of screens.filter(s => !s.isPaired)) {
      const missing: string[] = [];
      if (!s.hasWireframe) missing.push('wireframe.xml');
      if (!s.hasTsx) missing.push('.tsx');
      if (!s.hasMapping) missing.push('mapping.json');
      console.log(`   ${s.screenId}: missing ${missing.join(', ')}`);
    }
  }
}

main();
