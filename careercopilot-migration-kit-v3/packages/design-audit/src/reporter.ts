import type { AuditReport } from './types.js';

export function formatHumanReport(report: AuditReport): string {
  const lines = [
    'Design audit report',
    `files_scanned=${report.summary.filesScanned}`,
    `files_with_violations=${report.summary.filesWithViolations}`,
    `total_violations=${report.summary.totalViolations}`,
  ];

  for (const result of report.results) {
    if (result.violations.length === 0) {
      continue;
    }

    lines.push('');
    lines.push(result.filePath);

    for (const violation of result.violations) {
      lines.push(
        `  [${violation.ruleId}] ${violation.line}:${violation.column} ${violation.message}`,
      );
    }
  }

  return lines.join('\n');
}

export function formatJsonReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}
