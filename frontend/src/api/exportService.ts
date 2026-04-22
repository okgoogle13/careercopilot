import { axiosInstance } from '@/api/axiosConfig';

export type ExportTheme = 'minimal' | 'creative' | 'modern' | 'professional';
export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'json';

export interface ExportResult {
  success: boolean;
  download_url: string;
  file_format: string;
  message?: string;
}

export interface ResumeExportPayload {
  content: Record<string, unknown>;
  job_title?: string;
  format?: ExportFormat;
  expiration_hours?: number;
  theme_id?: ExportTheme;
}

export interface CoverLetterExportPayload {
  content: string;
  job_title?: string;
  company_name?: string;
  format?: ExportFormat;
  expiration_hours?: number;
  theme_id?: ExportTheme;
}

export const exportService = {
  async exportResume(payload: ResumeExportPayload): Promise<ExportResult> {
    const { content, job_title, format = 'pdf', expiration_hours = 1, theme_id } = payload;
    const response = await axiosInstance.post<ExportResult>('/export/resume', content, {
      params: { format, expiration_hours, job_title, theme_id },
    });
    return response.data;
  },

  async exportCoverLetter(payload: CoverLetterExportPayload): Promise<ExportResult> {
    const {
      content,
      job_title,
      company_name,
      format = 'pdf',
      expiration_hours = 1,
      theme_id,
    } = payload;
    const response = await axiosInstance.post<ExportResult>('/export/cover-letter', content, {
      params: { format, expiration_hours, job_title, company_name, theme_id },
    });
    return response.data;
  },
};
