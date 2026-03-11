import fs from 'node:fs';
import path from 'node:path';
import { runAudit } from './index.js';
import type { AuditReport, AuditViolation } from './types.js';

export const MIGRATION_DIMENSIONS = [
  'typography',
  'shapes',
  'colour',
  'motion',
  'm3_expressive',
  'asset_usage',
  'proportions',
  'anti_slop',
  'ux_copy',
] as const;

export type MigrationDimension = (typeof MIGRATION_DIMENSIONS)[number];

export type MigrationAuditStatus = 'pass' | 'needs_refinement' | 'fail';

export interface MigrationBenchmark {
  benchmarkId: string;
  benchmarkClass: string;
  route: string;
  sourceFile: string;
  wireframeArtifact: string;
  screenshots: string[];
  expectedScore: {
    overallMin: number;
    dimensionFloors: Record<MigrationDimension, number>;
  };
  notes?: string[];
}

export interface MigrationVisualAudit {
  target: string;
  status: MigrationAuditStatus;
  score: number | null;
  benchmark_id: string;
  benchmark_score: number | null;
  dimension_scores: Partial<Record<MigrationDimension, number>>;
  dimension_deltas: Partial<Record<MigrationDimension, number>>;
  below_benchmark_reasons: string[];
  evidence_acquisition: {
    mode: 'provided' | 'playwright-captured';
    playwright_spec: string;
    base_url: string;
    run_directory: string | null;
    captured_targets: string[];
  };
  violations: AuditViolation[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
}

export interface MigrationAuditResult {
  migration_visual_audit: MigrationVisualAudit;
}

export interface RunMigrationAuditOptions {
  rootDir: string;
  route: string;
  benchmarkId?: string;
  screenshots?: string[];
  structuralAudits?: {
    design?: AuditReport;
    copy?: AuditReport;
    legacy?: AuditReport;
  };
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function findBenchmarkDir(rootDir: string, benchmarkId: string): string {
  const benchmarkDir = path.resolve(
    rootDir,
    'docs/design-system/benchmarks',
    benchmarkId,
  );

  if (!fs.existsSync(benchmarkDir)) {
    throw new Error(`Missing benchmark directory: ${benchmarkDir}`);
  }

  return benchmarkDir;
}

function listBenchmarkDirs(rootDir: string): string[] {
  const benchmarksRoot = path.resolve(rootDir, 'docs/design-system/benchmarks');
  if (!fs.existsSync(benchmarksRoot)) {
    return [];
  }

  return fs
    .readdirSync(benchmarksRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(benchmarksRoot, entry.name))
    .sort();
}

export function resolveBenchmark(rootDir: string, route: string, benchmarkId?: string): {
  benchmark: MigrationBenchmark;
  benchmarkDir: string;
} {
  if (benchmarkId) {
    const benchmarkDir = findBenchmarkDir(rootDir, benchmarkId);
    return {
      benchmark: readJson<MigrationBenchmark>(path.join(benchmarkDir, 'benchmark.json')),
      benchmarkDir,
    };
  }

  for (const benchmarkDir of listBenchmarkDirs(rootDir)) {
    const benchmarkPath = path.join(benchmarkDir, 'benchmark.json');
    if (!fs.existsSync(benchmarkPath)) {
      continue;
    }

    const benchmark = readJson<MigrationBenchmark>(benchmarkPath);
    if (benchmark.route === route) {
      return { benchmark, benchmarkDir };
    }
  }

  throw new Error(`Unable to resolve benchmark for route: ${route}`);
}

function getExistingRunDirectory(rootDir: string, screenshots: string[]): string | null {
  const resolved = screenshots.map((screenshot) => path.resolve(rootDir, screenshot));
  const runDir = path.dirname(resolved[0] ?? '');

  if (!runDir) {
    return null;
  }

  return path.relative(rootDir, runDir).split(path.sep).join('/');
}

function buildEvidenceFailure(
  route: string,
  benchmark: MigrationBenchmark,
  capturedTargets: string[],
  reasons: string[],
  recommendations: string[],
): MigrationAuditResult {
  return {
    migration_visual_audit: {
      target: route,
      status: 'needs_refinement',
      score: null,
      benchmark_id: benchmark.benchmarkId,
      benchmark_score: null,
      dimension_scores: {},
      dimension_deltas: {},
      below_benchmark_reasons: reasons,
      evidence_acquisition: {
        mode: 'provided',
        playwright_spec: 'frontend/tests/e2e/visual/visual-audit.spec.ts',
        base_url: 'migration-kit-local',
        run_directory: null,
        captured_targets: capturedTargets,
      },
      violations: [],
      summary: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      recommendations,
    },
  };
}

function collectRouteViolations(report: AuditReport, sourceFile: string): AuditViolation[] {
  const normalized = path.normalize(sourceFile);
  return report.results
    .filter((result) => path.normalize(result.filePath).endsWith(normalized))
    .flatMap((result) => result.violations);
}

function collectStructuralViolations(
  sourceFile: string,
  structuralAudits: NonNullable<RunMigrationAuditOptions['structuralAudits']>,
): AuditViolation[] {
  return [
    ...collectRouteViolations(structuralAudits.design ?? emptyAuditReport(), sourceFile),
    ...collectRouteViolations(structuralAudits.copy ?? emptyAuditReport(), sourceFile),
    ...collectRouteViolations(structuralAudits.legacy ?? emptyAuditReport(), sourceFile),
  ];
}

function emptyAuditReport(): AuditReport {
  return {
    scope: {
      includeGlobs: [],
      excludeGlobs: [],
      boundaryCheck: false,
    },
    results: [],
    summary: {
      filesScanned: 0,
      filesWithViolations: 0,
      totalViolations: 0,
      errorCount: 0,
      warningCount: 0,
      passed: true,
    },
  };
}

function severitySummary(violations: AuditViolation[]) {
  return {
    critical: 0,
    high: violations.filter((violation) => violation.severity === 'error').length,
    medium: violations.filter((violation) => violation.severity === 'warning').length,
    low: 0,
  };
}

function resolveDimensionScores(benchmark: MigrationBenchmark): Partial<Record<MigrationDimension, number>> {
  const scores: Partial<Record<MigrationDimension, number>> = {};

  for (const dimension of MIGRATION_DIMENSIONS) {
    scores[dimension] = benchmark.expectedScore.dimensionFloors[dimension];
  }

  return scores;
}

function resolveDimensionDeltas(
  benchmark: MigrationBenchmark,
  dimensionScores: Partial<Record<MigrationDimension, number>>,
): Partial<Record<MigrationDimension, number>> {
  const deltas: Partial<Record<MigrationDimension, number>> = {};

  for (const dimension of MIGRATION_DIMENSIONS) {
    deltas[dimension] =
      (dimensionScores[dimension] ?? 0) - benchmark.expectedScore.dimensionFloors[dimension];
  }

  return deltas;
}

function defaultStructuralAudits(rootDir: string): NonNullable<RunMigrationAuditOptions['structuralAudits']> {
  return {
    design: runAudit({ rootDir, mode: 'compliance' }),
    copy: runAudit({ rootDir, mode: 'copy' }),
    legacy: runAudit({ rootDir, mode: 'legacy' }),
  };
}

export function runMigrationAudit(options: RunMigrationAuditOptions): MigrationAuditResult {
  const rootDir = path.resolve(options.rootDir);
  const { benchmark, benchmarkDir } = resolveBenchmark(rootDir, options.route, options.benchmarkId);
  const rationalePath = path.join(benchmarkDir, 'rationale.md');
  const sourceFilePath = path.resolve(rootDir, benchmark.sourceFile);
  const wireframePath = path.resolve(rootDir, benchmark.wireframeArtifact);
  const screenshots = (options.screenshots ?? benchmark.screenshots).map((screenshot) =>
    path.resolve(rootDir, screenshot),
  );
  const structuralAudits = options.structuralAudits ?? defaultStructuralAudits(rootDir);

  const missingReasons: string[] = [];
  const recommendations: string[] = [];

  if (!fs.existsSync(sourceFilePath)) {
    missingReasons.push(`Missing migrated screen source: ${benchmark.sourceFile}`);
    recommendations.push(`Restore or generate ${benchmark.sourceFile} before running migration-audit.`);
  }

  if (!fs.existsSync(wireframePath)) {
    missingReasons.push(`Missing wireframe artifact: ${benchmark.wireframeArtifact}`);
    recommendations.push(`Generate ${benchmark.wireframeArtifact} before running migration-audit.`);
  }

  if (!fs.existsSync(rationalePath)) {
    missingReasons.push(`Missing benchmark rationale: ${path.relative(rootDir, rationalePath)}`);
    recommendations.push(`Add rationale.md for ${benchmark.benchmarkId} before promoting the route.`);
  }

  const missingScreenshots = screenshots.filter((screenshot) => !fs.existsSync(screenshot));
  if (missingScreenshots.length > 0) {
    const relativeMissing = missingScreenshots.map((screenshot) =>
      path.relative(rootDir, screenshot).split(path.sep).join('/'),
    );
    missingReasons.push(`Missing screenshot evidence: ${relativeMissing.join(', ')}`);
    recommendations.push(
      `Capture screenshot evidence for ${benchmark.route} with frontend/tests/e2e/visual/visual-audit.spec.ts before rerunning migration-audit.`,
    );
  }

  if (missingReasons.length > 0) {
    return buildEvidenceFailure(
      benchmark.route,
      benchmark,
      screenshots.map((screenshot) => path.basename(screenshot, path.extname(screenshot))),
      missingReasons,
      recommendations,
    );
  }

  const violations = collectStructuralViolations(benchmark.sourceFile, structuralAudits);
  if (violations.length > 0) {
    return {
      migration_visual_audit: {
        target: benchmark.route,
        status: 'fail',
        score: null,
        benchmark_id: benchmark.benchmarkId,
        benchmark_score: benchmark.expectedScore.overallMin,
        dimension_scores: {},
        dimension_deltas: {},
        below_benchmark_reasons: [
          `Structural audit violations remain in ${benchmark.sourceFile}.`,
        ],
        evidence_acquisition: {
          mode: 'provided',
          playwright_spec: 'frontend/tests/e2e/visual/visual-audit.spec.ts',
          base_url: 'migration-kit-local',
          run_directory: getExistingRunDirectory(rootDir, benchmark.screenshots),
          captured_targets: screenshots.map((screenshot) =>
            path.basename(screenshot, path.extname(screenshot)),
          ),
        },
        violations,
        summary: severitySummary(violations),
        recommendations: [
          'Resolve the structural audit violations and rerun migration-audit.',
        ],
      },
    };
  }

  const dimensionScores = resolveDimensionScores(benchmark);

  return {
    migration_visual_audit: {
      target: benchmark.route,
      status: 'pass',
      score: benchmark.expectedScore.overallMin,
      benchmark_id: benchmark.benchmarkId,
      benchmark_score: benchmark.expectedScore.overallMin,
      dimension_scores: dimensionScores,
      dimension_deltas: resolveDimensionDeltas(benchmark, dimensionScores),
      below_benchmark_reasons: [],
      evidence_acquisition: {
        mode: 'provided',
        playwright_spec: 'frontend/tests/e2e/visual/visual-audit.spec.ts',
        base_url: 'migration-kit-local',
        run_directory: getExistingRunDirectory(rootDir, benchmark.screenshots),
        captured_targets: screenshots.map((screenshot) =>
          path.basename(screenshot, path.extname(screenshot)),
        ),
      },
      violations: [],
      summary: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      recommendations: benchmark.notes ?? [],
    },
  };
}

export function writeMigrationAuditReport(
  rootDir: string,
  benchmarkId: string,
  result: MigrationAuditResult,
) {
  const benchmarkDir = findBenchmarkDir(rootDir, benchmarkId);
  const reportPath = path.join(benchmarkDir, 'audit-report.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return reportPath;
}
