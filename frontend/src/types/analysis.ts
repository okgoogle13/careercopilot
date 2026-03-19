// Harvested from proto:types.ts — B3 HARVEST_NOW
// Unblocks Track B (ATSScoreCard, AuditDisplay)

export interface AuditViolation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
}

export interface DocumentAudit {
  overallScore: number;
  scanSimulation: string;
  violations: AuditViolation[];
  recommendations: string[];
}

export interface ATSScoreResult {
  overallScore: number;
  breakdown: {
    keywordMatch: number;
    skillsAlignment: number;
    jobTitleMatch: number;
    experienceRelevance: number;
    formatCompliance: number;
    narrativeQuality?: number;
    personalizationScore?: number;
    toneProfessionalism?: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  keywordDensity: Record<string, number>;
}

export interface CoverLetterScoreResult extends ATSScoreResult {
  keywordPlacement: number;
  narrativeQuality: number;
  personalizationScore: number;
  toneProfessionalism: number;
  lengthCompliance: number;
  callToActionPresent: boolean;
}

export type DocumentType = 'resume' | 'coverLetter';
