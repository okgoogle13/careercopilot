import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export interface AuditRequest {
  resumeText: string;
  jobDescription?: string;
  strictnessMode?: 'strict' | 'moderate' | 'light';
}

export interface Violation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
}

export interface AuditResult {
  overallScore: number;
  scanSimulation: string;
  violations: Violation[];
  recommendations: string[];
}

export interface AuditResponse {
  success: boolean;
  data: AuditResult;
  meta: {
    processingTime?: number;
    rulesApplied?: number;
    timestamp: string;
  };
}

export const auditResume = async (request: AuditRequest): Promise<AuditResult> => {
  const { data, error } = await supabase.functions.invoke<AuditResponse>('resume-audit', {
    body: request
  });

  if (error) throw new Error(`Audit failed: ${error.message}`);
  // @ts-ignore - Supabase invoke returns the data property directly or error
  if (!data?.success) throw new Error(data?.error || 'Unknown error');

  return data.data;
};

export const getAuditHistory = async (limit = 10) => {
  const { data, error } = await supabase
    .from('resume_audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
