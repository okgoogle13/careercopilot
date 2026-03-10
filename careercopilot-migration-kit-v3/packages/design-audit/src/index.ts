import {
  auditFile,
  auditLegacyFile,
  collectAuditTargets,
  DEFAULT_EXCLUDE_GLOBS,
  DEFAULT_INCLUDE_GLOBS,
} from './rules.js';
import type {
  AuditFileResult,
  AuditOptions,
  AuditReport,
  AuditSummary,
  AuditViolation,
} from './types.js';

export function createAuditSummary(report: AuditFileResult[]): AuditSummary {
  const scanned = report.filter((fileResult: AuditFileResult) => fileResult.scanned);
  const totalViolations = scanned.reduce(
    (count: number, fileResult: AuditFileResult) => count + fileResult.violations.length,
    0,
  );
  const filesWithViolations = scanned.filter(
    (fileResult: AuditFileResult) => fileResult.violations.length > 0,
  ).length;
  const errorCount = scanned.reduce(
    (count: number, fileResult: AuditFileResult) =>
      count +
      fileResult.violations.filter(
        (violation: AuditViolation) => violation.severity === 'error',
      ).length,
    0,
  );
  const warningCount = scanned.reduce(
    (count: number, fileResult: AuditFileResult) =>
      count +
      fileResult.violations.filter(
        (violation: AuditViolation) => violation.severity === 'warning',
      ).length,
    0,
  );

  return {
    filesScanned: scanned.length,
    filesWithViolations,
    totalViolations,
    errorCount,
    warningCount,
    passed: errorCount === 0,
  };
}

export function runAudit(partialOptions: Partial<AuditOptions>): AuditReport {
  const options: AuditOptions = {
    rootDir: partialOptions.rootDir ?? process.cwd(),
    includeGlobs: partialOptions.includeGlobs ?? DEFAULT_INCLUDE_GLOBS,
    excludeGlobs: partialOptions.excludeGlobs ?? DEFAULT_EXCLUDE_GLOBS,
    boundaryCheck: partialOptions.boundaryCheck ?? false,
    mode: partialOptions.mode ?? 'compliance',
  };

  const targets = collectAuditTargets(options);
  const results = targets.map((filePath: string) =>
    options.mode === 'legacy' ? auditLegacyFile(filePath) : auditFile(filePath),
  );

  return {
    scope: {
      includeGlobs: options.includeGlobs,
      excludeGlobs: options.excludeGlobs,
      boundaryCheck: options.boundaryCheck,
    },
    results,
    summary: createAuditSummary(results),
  };
}

export { formatHumanReport, formatJsonReport } from './reporter.js';
export type {
  AuditOptions,
  AuditReport,
  AuditSeverity,
  AuditSummary,
  AuditViolation,
} from './types.js';
