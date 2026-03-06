#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const skillsDir = path.join(ROOT, '.claude/skills');
const registryPath = path.join(skillsDir, 'SKILL_REGISTRY.md');
const outputPath = path.join(ROOT, 'docs/design/generated/skill-registry-hygiene.json');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replaceAll('\\', '/');
}

function parseDeclaredCount(md) {
  const m = md.match(/Active skills:\s*\*\*(\d+)\*\*/);
  return m ? Number(m[1]) : null;
}

function parseActiveRows(md) {
  const rows = [];
  const lines = md.split(/\r?\n/);
  let inTable = false;
  for (const line of lines) {
    if (line.includes('| Skill | Directory | Description |')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) {
      if (rows.length > 0) break;
      continue;
    }
    if (line.startsWith('|---')) continue;
    const parts = line.split('|').map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 3) rows.push({ skill: parts[0], directory: parts[1], description: parts[2] });
  }
  return rows;
}

function main() {
  const registry = fs.readFileSync(registryPath, 'utf8');
  const declaredCount = parseDeclaredCount(registry);
  const tableRows = parseActiveRows(registry);

  const directEntries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const activeSkillDirs = directEntries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_legacy_archive'))
    .map((e) => path.join(skillsDir, e.name))
    .filter((d) => fs.existsSync(path.join(d, 'SKILL.md')));

  const normalize = (v) => v.replaceAll('\\', '/').replace(/^\.\//, '').replace(/^\//, '');
  const tableDirs = new Set(tableRows.map((r) => normalize(r.directory)));
  const discoveredDirs = new Set(activeSkillDirs.map((d) => normalize(rel(d))));

  const orphanedSkillDirs = [...discoveredDirs].filter((d) => !tableDirs.has(d));
  const staleTableDirs = [...tableDirs].filter((d) => !discoveredDirs.has(d));

  const result = {
    generatedAt: new Date().toISOString(),
    declaredCount,
    activeTableCount: tableRows.length,
    discoveredActiveSkillCount: activeSkillDirs.length,
    summaryCountMatchesTable: declaredCount === tableRows.length,
    tableMatchesFilesystem: tableRows.length === activeSkillDirs.length && orphanedSkillDirs.length === 0 && staleTableDirs.length === 0,
    orphanedSkillDirs,
    staleTableDirs,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(`Registry hygiene report: ${rel(outputPath)}`);
  console.log(`Declared: ${declaredCount}, Table: ${tableRows.length}, Filesystem active: ${activeSkillDirs.length}`);

  if (!result.summaryCountMatchesTable || !result.tableMatchesFilesystem) {
    process.exit(1);
  }
}

main();
