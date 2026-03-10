export type AuditRuleId =
  | 'no-hardcoded-styles'
  | 'no-banned-design-terms'
  | 'boundary-reference-check'
  | 'no-legacy-migration-patterns';

export type AuditSeverity = 'error' | 'warning';

export interface AuditViolation {
  ruleId: AuditRuleId;
  severity: AuditSeverity;
  filePath: string;
  message: string;
  line: number;
  column: number;
  excerpt?: string;
}

export interface AuditFileResult {
  filePath: string;
  scanned: boolean;
  violations: AuditViolation[];
}

export interface AuditSummary {
  filesScanned: number;
  filesWithViolations: number;
  totalViolations: number;
  errorCount: number;
  warningCount: number;
  passed: boolean;
}

export interface AuditReport {
  scope: {
    includeGlobs: string[];
    excludeGlobs: string[];
    boundaryCheck: boolean;
  };
  results: AuditFileResult[];
  summary: AuditSummary;
}

export interface AuditOptions {
  rootDir: string;
  includeGlobs: string[];
  excludeGlobs: string[];
  boundaryCheck: boolean;
  mode?: 'compliance' | 'legacy';
}
