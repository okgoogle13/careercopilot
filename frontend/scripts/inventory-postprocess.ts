#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(FRONTEND_DIR, 'component-inventory.json');
const OUT_DIR = path.join(FRONTEND_DIR, 'reports');

interface ComponentInfo {
  name: string;
  relativePath: string;
  category: 'ui' | 'features' | 'layout' | 'library' | 'documents' | 'main' | 'other';
  usageCount: number;
  hasTests: boolean;
  hasStories: boolean;
  linesOfCode: number;
  isReusable: boolean;
  usesMUI: boolean;
  usesCustomUI: boolean;
  isDemo: boolean;
  migrationStatus: 'migrated' | 'mixed' | 'not_migrated' | 'expressive' | 'unknown';
}

interface InventoryReport {
  generatedAt: string;
  totalComponents: number;
  componentsByCategory: Record<string, number>;
  components: ComponentInfo[];
  migrationSummary?: Record<'migrated' | 'mixed' | 'not_migrated' | 'expressive' | 'unknown', number>;
}

function toCSV<T extends Record<string, any>>(rows: T[], headers?: string[]) {
  const cols = headers ?? Object.keys(rows[0] ?? {});
  const esc = (v: any) => {
    const s = String(v ?? '');
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
}

function main() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error('Report not found at', REPORT_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const report: InventoryReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  const comps = report.components;

  // Filters
  const nonDemo = comps.filter(c => !c.isDemo);
  const essential = nonDemo
    .filter(c => ['ui', 'layout', 'features'].includes(c.category))
    .sort((a, b) => b.usageCount - a.usageCount);

  const niceToHave = nonDemo
    .filter(c => c.isReusable ? c.usageCount <= 1 : (['library', 'documents', 'main'].includes(c.category) || c.usageCount <= 1))
    .sort((a, b) => b.usageCount - a.usageCount);

  const migrationBreakdownOverall = nonDemo.reduce((acc, c) => {
    acc[c.migrationStatus] = (acc[c.migrationStatus] ?? 0) + 1;
    return acc;
  }, { migrated: 0, mixed: 0, not_migrated: 0, expressive: 0, unknown: 0 } as Record<string, number>);

  const migrationByCategory: Record<string, Record<string, number>> = {};
  for (const c of nonDemo) {
    migrationByCategory[c.category] = migrationByCategory[c.category] || { migrated: 0, mixed: 0, not_migrated: 0, expressive: 0, unknown: 0 };
    migrationByCategory[c.category][c.migrationStatus]++;
  }

  const topNotMigrated = nonDemo.filter(c => c.migrationStatus === 'not_migrated').sort((a,b) => b.usageCount - a.usageCount).slice(0, 50);
  const topMixed = nonDemo.filter(c => c.migrationStatus === 'mixed').sort((a,b) => b.usageCount - a.usageCount).slice(0, 50);

  // Write JSONs
  fs.writeFileSync(path.join(OUT_DIR, 'essential.json'), JSON.stringify(essential, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'nice-to-have.json'), JSON.stringify(niceToHave, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'migration-breakdown.json'), JSON.stringify({ overall: migrationBreakdownOverall, byCategory: migrationByCategory, topNotMigrated, topMixed }, null, 2));

  // Write CSVs (selected fields)
  const pick = (c: ComponentInfo) => ({
    name: c.name,
    path: c.relativePath,
    category: c.category,
    usageCount: c.usageCount,
    migrationStatus: c.migrationStatus,
    usesMUI: c.usesMUI,
    usesCustomUI: c.usesCustomUI,
    hasTests: c.hasTests,
    hasStories: c.hasStories,
  });
  const essentialCSV = toCSV(essential.map(pick));
  const niceCSV = toCSV(niceToHave.map(pick));
  fs.writeFileSync(path.join(OUT_DIR, 'essential.csv'), essentialCSV);
  fs.writeFileSync(path.join(OUT_DIR, 'nice-to-have.csv'), niceCSV);

  // Summary for markdown injection
  const summary = {
    generatedAt: report.generatedAt,
    totalComponents: report.totalComponents,
    nonDemoCount: nonDemo.length,
    migrationSummary: migrationBreakdownOverall,
    topEssential: essential.slice(0, 20).map(pick),
    topNotMigrated: topNotMigrated.slice(0, 20).map(pick),
    topMixed: topMixed.slice(0, 20).map(pick)
  };
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

  console.log('Reports written to', OUT_DIR);
}

main();
