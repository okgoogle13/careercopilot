import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const scripts = ['frontend/scripts/figmascript1.js', 'frontend/scripts/figmascript2.js'];

function checkSyntax(path) {
  return spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
}

test('figma scripts parse as valid JavaScript', () => {
  const failures = scripts
    .map((path) => ({ path, result: checkSyntax(path) }))
    .filter(({ result }) => result.status !== 0)
    .map(({ path, result }) => `${path}: ${result.stderr.trim()}`);

  assert.deepEqual(failures, []);
});

test('figmascript1 exits immediately after notifying on invalid selection', () => {
  const source = readFileSync('frontend/scripts/figmascript1.js', 'utf8');

  assert.match(
    source,
    /if\s*\(!selection\.length\)\s*\{[\s\S]*?figma\.closePlugin\(\);\s*return;\s*\}/
  );
  assert.match(
    source,
    /if\s*\(!targets\.length\)\s*\{[\s\S]*?figma\.closePlugin\(\);\s*return;\s*\}/
  );
});

test('figmascript2 is plain JavaScript without markdown fences', () => {
  const source = readFileSync('frontend/scripts/figmascript2.js', 'utf8');

  assert.ok(!source.startsWith('```'));
  assert.ok(!source.trimEnd().endsWith('```'));
});
