import { axiosInstance } from '../api/axiosConfig';

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
  const response = await axiosInstance.post<AuditResponse>('/resume-audit/evaluate', request);

  if (!response.data?.success) {
    throw new Error('Audit failed');
  }

  return response.data.data;
};

export const getAuditHistory = async (limit = 10) => {
  // Assuming we have an endpoint for this in the backend
  const response = await axiosInstance.get('/resume-audit/history', {
    params: { limit },
  });

  return response.data;
};
