export interface MasterStatusResponse {
  has_master: boolean;
  active_version: number | null;
  updated_at: string | null;
}

export interface ChunkMatch {
  chunk_id: string;
  label: string;
  score: number;
  matched_terms: string[];
  snippet: string;
}

export interface ATSPreview {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
}

export interface QuickApplyArtifacts {
  tailored_resume: string;
  cover_letter: string;
  ksc_response: string;
}

export interface AnalyzeJobFromUrlResponse {
  job_title: string;
  company_name: string;
  normalized_job_description: string;
  chunk_matches: ChunkMatch[];
  ats_preview: ATSPreview;
  artifacts: QuickApplyArtifacts;
  export_pack: Record<string, string>;
}
