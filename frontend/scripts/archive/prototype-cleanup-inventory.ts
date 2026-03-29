#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project, SourceFile } from 'ts-morph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(FRONTEND_ROOT, '..');
const SRC_ROOT = path.join(FRONTEND_ROOT, 'src');
const PROTOTYPE_ROOT = path.join(SRC_ROOT, 'prototype-features');
const APP_PATH = path.join(SRC_ROOT, 'App.tsx');
const PROTOTYPE_ROUTES_PATH = path.join(PROTOTYPE_ROOT, 'prototype-routes.tsx');
const ROUTE_MATRIX_PATH = path.join(
  REPO_ROOT,
  'docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json'
);
const PRIMARY_GAP_MAP_PATH = path.join(
  REPO_ROOT,
  'docs/project/active/frontend-source-of-truth-migration/control/gap-map.json'
);
const ARCHIVE_GAP_MAP_PATH = path.join(
  REPO_ROOT,
  'docs/project/active/frontend-source-of-truth-migration/control/archive/gap-map.json'
);
const DEFAULT_JSON_OUT = path.join(REPO_ROOT, 'docs/manifests/prototype-features-cleanup-map.json');
const DEFAULT_CSV_OUT = path.join(REPO_ROOT, 'docs/manifests/prototype-features-cleanup-map.csv');

type FileKind =
  | 'route_manifest'
  | 'page'
  | 'component'
  | 'hook'
  | 'service'
  | 'type_or_config'
  | 'doc'
  | 'other';

type UsageClass =
  | 'runtime_support_route'
  | 'harvest_candidate'
  | 'support_only_reference'
  | 'definitely_unused'
  | 'likely_unused_review_needed';

type RecommendedAction =
  | 'keep_support_only'
  | 'merge_candidate'
  | 'quarantine_reference'
  | 'delete_candidate'
  | 'review_needed';

interface RouteMatrixRow {
  current_route: string;
  target_route: string;
  family: string;
  status: string;
  current_runtime_owner?: string;
  target_runtime_owner?: string;
  target_component_surfaces?: string[];
  notes?: string;
}

interface GapFeature {
  feature_id: string;
  owner_route?: string;
  owner_surface?: string;
  reference_components?: string[];
  new_components?: string[];
  deferred_components?: string[];
}

interface CleanupRecord {
  file_path: string;
  file_kind: FileKind;
  exported_symbols: string[];
  imported_by: string[];
  imported_by_count: number;
  runtime_reachable: boolean;
  reachable_from_prototype_routes: boolean;
  direct_prototype_route_entry: boolean;
  canonical_route_owner: string | null;
  canonical_owner_family: string | null;
  target_state_status: string | null;
  target_runtime_owner: string | null;
  target_component_surfaces: string[];
  gap_feature_refs: string[];
  usage_class: UsageClass;
  recommended_action: RecommendedAction;
  delete_safe_now: boolean;
  evidence: string[];
}

interface CleanupReport {
  generated_at: string;
  scope: string;
  runtime_truth: string;
  prototype_route_mount: string;
  summary: {
    total_files: number;
    runtime_reachable: number;
    direct_route_entries: number;
    definitely_unused: number;
    delete_candidates: number;
    keep_support_only: number;
    merge_candidates: number;
    quarantine_reference: number;
    review_needed: number;
  };
  records: CleanupRecord[];
}

function normalize(value: string): string {
  return value.split(path.sep).join('/');
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return readJson<T>(filePath);
}

function getProject(): Project {
  return new Project({
    tsConfigFilePath: path.join(FRONTEND_ROOT, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  });
}

function getInternalEdges(sourceFile: SourceFile): SourceFile[] {
  const results = new Set<SourceFile>();
  for (const decl of sourceFile.getImportDeclarations()) {
    const target = decl.getModuleSpecifierSourceFile();
    if (target) results.add(target);
  }
  for (const decl of sourceFile.getExportDeclarations()) {
    const target = decl.getModuleSpecifierSourceFile();
    if (target) results.add(target);
  }
  return [...results];
}

function buildReachableSet(start: SourceFile, edges: Map<string, string[]>): Set<string> {
  const visited = new Set<string>();
  const queue = [normalize(start.getFilePath())];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const next of edges.get(current) ?? []) {
      if (!visited.has(next)) queue.push(next);
    }
  }
  return visited;
}

function classifyFileKind(relativePath: string): FileKind {
  if (relativePath === 'prototype-routes.tsx') return 'route_manifest';
  if (relativePath.endsWith('.md')) return 'doc';
  if (relativePath.endsWith('.d.ts') || relativePath.endsWith('.json')) return 'type_or_config';
  if (relativePath.includes('/hooks/')) return 'hook';
  if (relativePath.includes('/services/')) return 'service';
  if (relativePath.includes('/pages/') || relativePath.endsWith('Page.tsx')) return 'page';
  if (relativePath.endsWith('.tsx') || relativePath.endsWith('.ts')) return 'component';
  return 'other';
}

function extractCanonicalOwner(text: string): string | null {
  const match = text.match(/CANONICAL ROUTE OWNER:\s*([^\n*]+)/);
  return match ? match[1].trim() : null;
}

function csvEscape(value: string | number | boolean | null | string[]): string {
  const raw = Array.isArray(value) ? value.join(' | ') : value == null ? '' : String(value);
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function main() {
  const args = process.argv.slice(2);
  const jsonOut =
    args.find((arg) => arg.startsWith('--json-out='))?.split('=')[1] ?? DEFAULT_JSON_OUT;
  const csvOut = args.find((arg) => arg.startsWith('--csv-out='))?.split('=')[1] ?? DEFAULT_CSV_OUT;

  const project = getProject();
  const allSourceFiles = project
    .getSourceFiles()
    .filter((file) => normalize(file.getFilePath()).startsWith(normalize(SRC_ROOT)));

  const sourceByPath = new Map<string, SourceFile>(
    allSourceFiles.map((file) => [normalize(file.getFilePath()), file])
  );

  const edges = new Map<string, string[]>();
  const reverseEdges = new Map<string, Set<string>>();

  for (const sourceFile of allSourceFiles) {
    const from = normalize(sourceFile.getFilePath());
    const targets = getInternalEdges(sourceFile)
      .map((target) => normalize(target.getFilePath()))
      .filter((target) => target.startsWith(normalize(SRC_ROOT)));
    edges.set(from, targets);
    for (const target of targets) {
      if (!reverseEdges.has(target)) reverseEdges.set(target, new Set<string>());
      reverseEdges.get(target)!.add(from);
    }
  }

  const appSource = sourceByPath.get(normalize(APP_PATH));
  const prototypeRoutesSource = sourceByPath.get(normalize(PROTOTYPE_ROUTES_PATH));
  if (!appSource || !prototypeRoutesSource) {
    throw new Error('Missing App.tsx or prototype-routes.tsx');
  }

  const runtimeReachable = buildReachableSet(appSource, edges);
  const prototypeReachable = buildReachableSet(prototypeRoutesSource, edges);

  const directPrototypeRouteEntries = new Set(
    getInternalEdges(prototypeRoutesSource).map((file) => normalize(file.getFilePath()))
  );

  const routeMatrix = readJson<{ rows: RouteMatrixRow[] }>(ROUTE_MATRIX_PATH);
  const routeByPath = new Map<string, RouteMatrixRow>();
  for (const row of routeMatrix.rows) {
    routeByPath.set(row.current_route, row);
    routeByPath.set(row.target_route, row);
  }

  const gapMap =
    readJsonIfExists<{ features?: GapFeature[] }>(PRIMARY_GAP_MAP_PATH) ??
    readJsonIfExists<{ features?: GapFeature[] }>(ARCHIVE_GAP_MAP_PATH);
  const gapFeatures = gapMap?.features ?? [];

  const prototypeFiles = fs
    .readdirSync(PROTOTYPE_ROOT, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((filePath) => normalize(filePath).startsWith(normalize(PROTOTYPE_ROOT)))
    .sort((a, b) => a.localeCompare(b));

  const records: CleanupRecord[] = prototypeFiles.map((filePath) => {
    const normalized = normalize(filePath);
    const relativePath = normalize(path.relative(PROTOTYPE_ROOT, filePath));
    const sourceFile = sourceByPath.get(normalized);
    const text = fs.readFileSync(filePath, 'utf-8');
    const canonicalOwnerRaw = extractCanonicalOwner(text);
    const canonicalRouteOwner =
      canonicalOwnerRaw && canonicalOwnerRaw.startsWith('/')
        ? canonicalOwnerRaw.split(/\s+/)[0]
        : null;
    const routeRow = canonicalRouteOwner ? (routeByPath.get(canonicalRouteOwner) ?? null) : null;
    const targetSurfaces = routeRow?.target_component_surfaces ?? [];
    const exportedSymbols = sourceFile
      ? [...sourceFile.getExportedDeclarations().keys()].sort()
      : [];
    const importedBy = [...(reverseEdges.get(normalized) ?? new Set<string>())]
      .map((value) => normalize(path.relative(SRC_ROOT, value)))
      .sort();
    const gapFeatureRefs = gapFeatures
      .filter((feature) => {
        if (canonicalRouteOwner && feature.owner_route === canonicalRouteOwner) return true;
        const componentNames = [
          ...(feature.reference_components ?? []),
          ...(feature.new_components ?? []),
          ...(feature.deferred_components ?? []),
        ];
        return componentNames.some((name) => exportedSymbols.includes(name));
      })
      .map((feature) => feature.feature_id)
      .sort();

    const isRuntimeReachable = runtimeReachable.has(normalized);
    const isPrototypeReachable = prototypeReachable.has(normalized);
    const isDirectRouteEntry = directPrototypeRouteEntries.has(normalized);
    const fileKind = classifyFileKind(relativePath);
    const evidence: string[] = [];

    if (isDirectRouteEntry) evidence.push('directly imported by prototype-routes.tsx');
    if (isRuntimeReachable) evidence.push('reachable from App.tsx via /prototype/*');
    if (canonicalRouteOwner) evidence.push(`declares canonical owner ${canonicalRouteOwner}`);
    if (routeRow?.target_runtime_owner) {
      evidence.push(`target runtime owner ${routeRow.target_runtime_owner}`);
    }
    if (importedBy.length > 0) {
      evidence.push(`imported by ${importedBy.length} file(s)`);
    }

    let usageClass: UsageClass;
    let recommendedAction: RecommendedAction;

    if (!isRuntimeReachable && !canonicalRouteOwner) {
      usageClass = 'definitely_unused';
      recommendedAction = 'delete_candidate';
      evidence.push('not reachable from App.tsx and no canonical owner tag');
    } else if (isRuntimeReachable && canonicalRouteOwner) {
      usageClass = 'harvest_candidate';
      recommendedAction = 'merge_candidate';
      evidence.push('support-only runtime surface mapped to canonical route');
    } else if (isRuntimeReachable) {
      usageClass = 'runtime_support_route';
      recommendedAction = 'keep_support_only';
      evidence.push('mounted support-only runtime surface');
    } else if (canonicalRouteOwner || importedBy.length > 0) {
      usageClass = 'likely_unused_review_needed';
      recommendedAction = 'review_needed';
      evidence.push('not runtime reachable but still referenced or owner-tagged');
    } else {
      usageClass = 'support_only_reference';
      recommendedAction = 'quarantine_reference';
      evidence.push('support-reference file without live runtime reachability');
    }

    return {
      file_path: normalize(path.relative(REPO_ROOT, filePath)),
      file_kind: fileKind,
      exported_symbols: exportedSymbols,
      imported_by: importedBy,
      imported_by_count: importedBy.length,
      runtime_reachable: isRuntimeReachable,
      reachable_from_prototype_routes: isPrototypeReachable,
      direct_prototype_route_entry: isDirectRouteEntry,
      canonical_route_owner: canonicalRouteOwner,
      canonical_owner_family: routeRow?.family ?? null,
      target_state_status: routeRow?.status ?? null,
      target_runtime_owner: routeRow?.target_runtime_owner ?? null,
      target_component_surfaces: targetSurfaces,
      gap_feature_refs: gapFeatureRefs,
      usage_class: usageClass,
      recommended_action: recommendedAction,
      delete_safe_now: recommendedAction === 'delete_candidate',
      evidence,
    };
  });

  const report: CleanupReport = {
    generated_at: new Date().toISOString(),
    scope: 'frontend/src/prototype-features',
    runtime_truth: 'frontend/src/App.tsx',
    prototype_route_mount: '/prototype/*',
    summary: {
      total_files: records.length,
      runtime_reachable: records.filter((record) => record.runtime_reachable).length,
      direct_route_entries: records.filter((record) => record.direct_prototype_route_entry).length,
      definitely_unused: records.filter((record) => record.usage_class === 'definitely_unused')
        .length,
      delete_candidates: records.filter(
        (record) => record.recommended_action === 'delete_candidate'
      ).length,
      keep_support_only: records.filter(
        (record) => record.recommended_action === 'keep_support_only'
      ).length,
      merge_candidates: records.filter((record) => record.recommended_action === 'merge_candidate')
        .length,
      quarantine_reference: records.filter(
        (record) => record.recommended_action === 'quarantine_reference'
      ).length,
      review_needed: records.filter((record) => record.recommended_action === 'review_needed')
        .length,
    },
    records,
  };

  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2) + '\n', 'utf-8');

  const columns: Array<keyof CleanupRecord> = [
    'file_path',
    'file_kind',
    'runtime_reachable',
    'reachable_from_prototype_routes',
    'direct_prototype_route_entry',
    'canonical_route_owner',
    'canonical_owner_family',
    'target_state_status',
    'target_runtime_owner',
    'usage_class',
    'recommended_action',
    'delete_safe_now',
    'imported_by_count',
    'imported_by',
    'target_component_surfaces',
    'gap_feature_refs',
    'evidence',
  ];

  const csvLines = [
    columns.join(','),
    ...records.map((record) =>
      columns.map((column) => csvEscape(record[column] as never)).join(',')
    ),
  ];
  fs.mkdirSync(path.dirname(csvOut), { recursive: true });
  fs.writeFileSync(csvOut, csvLines.join('\n') + '\n', 'utf-8');

  console.log(
    JSON.stringify(
      {
        json_out: normalize(path.relative(REPO_ROOT, jsonOut)),
        csv_out: normalize(path.relative(REPO_ROOT, csvOut)),
        summary: report.summary,
      },
      null,
      2
    )
  );
}

main();
