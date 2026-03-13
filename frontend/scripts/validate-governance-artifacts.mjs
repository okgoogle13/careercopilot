#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const artifacts = [
  {
    name: 'route-family-map',
    file: path.join(repoRoot, '.claude', 'route-family-map.json'),
  },
  {
    name: 'frontend-capability-gap-matrix',
    file: path.join(repoRoot, '.claude', 'plans', 'frontend-capability-gap-matrix.json'),
  },
  {
    name: 'route-family-target-state',
    file: path.join(repoRoot, '.claude', 'plans', 'route-family-target-state.json'),
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateRouteFamilyMap(data) {
  assert(Array.isArray(data.families), 'route-family-map.json must contain a families array');
  assert(
    Array.isArray(data.capability_led_additions),
    'route-family-map.json must contain capability_led_additions'
  );

  const allowedDecisions = new Set(['keep', 'expand', 'merge', 'replace', 'retire']);
  data.families.forEach((family) => {
    assert(typeof family.family === 'string' && family.family.length > 0, 'family name missing');
    assert(allowedDecisions.has(family.decision), `invalid decision for family ${family.family}`);
    assert(Array.isArray(family.runtime_routes), `runtime_routes missing for ${family.family}`);
  });
}

function validateCapabilityGapMatrix(data) {
  assert(
    Array.isArray(data.capability_matrix),
    'frontend-capability-gap-matrix.json must contain capability_matrix'
  );

  data.capability_matrix.forEach((entry) => {
    assert(typeof entry.id === 'string' && entry.id.length > 0, 'capability id missing');
  });
}

function validateRouteFamilyTargetState(data) {
  assert(Array.isArray(data.families), 'route-family-target-state.json must contain families');
  assert(
    Array.isArray(data.cross_family_decisions),
    'route-family-target-state.json must contain cross_family_decisions'
  );
}

function validateCrossArtifactConsistency(
  routeFamilyMap,
  capabilityGapMatrix,
  routeFamilyTargetState
) {
  const routeFamilies = new Set(routeFamilyMap.families.map((family) => family.family));
  const targetFamilies = new Set(routeFamilyTargetState.families.map((family) => family.family));
  const capabilities = new Set(capabilityGapMatrix.capability_matrix.map((entry) => entry.id));

  routeFamilies.forEach((family) => {
    assert(targetFamilies.has(family), `target-state artifact missing family ${family}`);
  });

  routeFamilyMap.families.forEach((family) => {
    for (const capability of family.capability_dependencies ?? []) {
      assert(
        capabilities.has(capability),
        `unknown capability dependency ${capability} on ${family.family}`
      );
    }
  });

  routeFamilyMap.capability_led_additions.forEach((addition) => {
    assert(
      routeFamilies.has(addition.owner_family),
      `unknown owner_family ${addition.owner_family}`
    );
  });
}

function main() {
  const loaded = Object.fromEntries(
    artifacts.map(({ name, file }) => {
      if (!fs.existsSync(file)) {
        throw new Error(`missing artifact: ${file}`);
      }
      return [name, readJson(file)];
    })
  );

  validateRouteFamilyMap(loaded['route-family-map']);
  validateCapabilityGapMatrix(loaded['frontend-capability-gap-matrix']);
  validateRouteFamilyTargetState(loaded['route-family-target-state']);
  validateCrossArtifactConsistency(
    loaded['route-family-map'],
    loaded['frontend-capability-gap-matrix'],
    loaded['route-family-target-state']
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        validated: artifacts.map((artifact) => artifact.name),
      },
      null,
      2
    )
  );
}

main();
