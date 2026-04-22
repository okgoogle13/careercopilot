import { axiosInstance } from '@/api/axiosConfig';

export interface ExportResult {
  success: boolean;
  download_url: string;
  file_format: string;
  message?: string;
}

export interface ResumeExportPayload {
  content: Record<string, unknown>;
  job_title?: string;
  format?: 'pdf' | 'docx';
  expiration_hours?: number;
}

export interface CoverLetterExportPayload {
  content: string;
  job_title?: string;
  company_name?: string;
  format?: 'pdf' | 'docx';
  expiration_hours?: number;
}

export const exportService = {
  async exportResume(payload: ResumeExportPayload): Promise<ExportResult> {
    const { content, job_title, format = 'pdf', expiration_hours = 1 } = payload;
    const response = await axiosInstance.post<ExportResult>('/export/resume', content, {
      params: { format, expiration_hours, job_title },
    });
    return response.data;
  },

  async exportCoverLetter(payload: CoverLetterExportPayload): Promise<ExportResult> {
    const { content, job_title, company_name, format = 'pdf', expiration_hours = 1 } = payload;
    const response = await axiosInstance.post<ExportResult>('/export/cover-letter', content, {
      params: { format, expiration_hours, job_title, company_name },
    });
    return response.data;
  },
};
