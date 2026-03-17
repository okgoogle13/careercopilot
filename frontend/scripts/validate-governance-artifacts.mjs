#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const controlRoot = path.join(
  repoRoot,
  'docs',
  'project',
  'active',
  'frontend-source-of-truth-migration',
  'control'
);

const routeMatrixPath = path.join(controlRoot, 'route-matrix.json');
const gapMapPath = path.join(controlRoot, 'gap-map.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateRouteMatrix(data) {
  assert(data.artifact === 'target_state_route_matrix', 'route-matrix artifact name mismatch');
  assert(
    typeof data.generated_at === 'string' && data.generated_at.length > 0,
    'route-matrix missing generated_at'
  );
  assert(
    data.canonical_plan ===
      'docs/project/active/frontend-source-of-truth-migration/control/blueprint.md',
    `route-matrix canonical_plan must point to control/blueprint.md, found ${data.canonical_plan}`
  );
  assert(Number.isInteger(data.schema_version), 'route-matrix missing integer schema_version');
  assert(Array.isArray(data.rows), 'route-matrix must contain a rows array');
  assert(data.row_count === data.rows.length, 'route-matrix row_count must match rows length');

  const allowedStatuses = new Set(['keep', 'expand', 'merge', 'replace', 'retire']);
  data.rows.forEach((row) => {
    assert(
      typeof row.route_id === 'string' && row.route_id.length > 0,
      'route-matrix row missing route_id'
    );
    assert(
      allowedStatuses.has(row.status),
      `route ${row.route_id} has invalid status ${row.status}`
    );
    if (row.route_class === 'product') {
      assert(
        typeof row.target_route === 'string' && row.target_route.length > 0,
        `route ${row.route_id} missing target_route`
      );
    }
  });
}

function validateGapMap(data, routeMatrix) {
  assert(
    data.artifact === 'backend_feature_frontend_component_gap_map',
    'gap-map artifact name mismatch'
  );
  assert(
    typeof data.generated_at === 'string' && data.generated_at.length > 0,
    'gap-map missing generated_at'
  );
  assert(
    data.canonical_plan ===
      'docs/project/active/frontend-source-of-truth-migration/control/blueprint.md',
    `gap-map canonical_plan must point to control/blueprint.md, found ${data.canonical_plan}`
  );
  assert(
    data.canonical_route_matrix ===
      'docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json',
    `gap-map canonical_route_matrix must point to control/route-matrix.json, found ${data.canonical_route_matrix}`
  );
  assert(Array.isArray(data.features), 'gap-map must contain a features array');

  const productRoutes = new Set(
    routeMatrix.rows.filter((row) => row.route_class === 'product').map((row) => row.target_route)
  );

  data.features.forEach((feature) => {
    assert(
      typeof feature.feature_id === 'string' && feature.feature_id.length > 0,
      'gap-map feature missing feature_id'
    );
    assert(
      typeof feature.owner_route === 'string' && feature.owner_route.length > 0,
      `gap-map feature ${feature.feature_id} missing owner_route`
    );
    assert(
      typeof feature.owner_surface === 'string' && feature.owner_surface.length > 0,
      `gap-map feature ${feature.feature_id} missing owner_surface`
    );
    assert(
      typeof feature.backend_status === 'string' && feature.backend_status.length > 0,
      `gap-map feature ${feature.feature_id} missing backend_status`
    );
    assert(
      typeof feature.frontend_status === 'string' && feature.frontend_status.length > 0,
      `gap-map feature ${feature.feature_id} missing frontend_status`
    );
    assert(
      productRoutes.has(feature.owner_route),
      `gap-map feature ${feature.feature_id} references non-product owner_route ${feature.owner_route}`
    );
  });
}

function main() {
  [routeMatrixPath, gapMapPath].forEach((file) => {
    if (!fs.existsSync(file)) {
      throw new Error(`missing canonical artifact: ${file}`);
    }
  });

  const routeMatrix = readJson(routeMatrixPath);
  const gapMap = readJson(gapMapPath);

  validateRouteMatrix(routeMatrix);
  validateGapMap(gapMap, routeMatrix);

  console.log(
    JSON.stringify(
      {
        ok: true,
        validated: ['route-matrix', 'gap-map'],
        artifacts: {
          route_matrix: routeMatrixPath,
          gap_map: gapMapPath,
        },
      },
      null,
      2
    )
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
