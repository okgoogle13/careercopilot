import { m3Toast } from '@/utils/toast';

interface ExportRequest {
  format: 'pdf' | 'docx' | 'txt' | 'json';
  jobTitle?: string;
  companyName?: string;
  expirationHours?: number;
  theme?: 'minimal' | 'creative' | 'modern' | 'professional';
}

interface ExportResponse {
  success: boolean;
  document_type: string;
  file_format: string;
  download_url: string;
  file_size_bytes: number;
  storage_path: string;
  expires_at: string;
  message: string;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const exportService = {
  async exportResume(
    resumeText: string,
    jobTitle: string,
    request: ExportRequest
  ): Promise<ExportResponse | null> {
    try {
      const response = await fetch(`${API_BASE}/api/export/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify({
          content: resumeText,
          job_title: jobTitle,
          format: request.format,
          expiration_hours: request.expirationHours || 24,
          theme_id: request.theme || 'minimal',
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const data: ExportResponse = await response.json();

      // Trigger download
      if (data.download_url) {
        const link = document.createElement('a');
        link.href = data.download_url;
        link.download = `resume.${request.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        m3Toast.success('Downloaded', `Resume exported as ${request.format.toUpperCase()}`);
      }

      return data;
    } catch (error) {
      m3Toast.error('Export Failed', error instanceof Error ? error.message : 'Unknown error');
      console.error('Resume export error:', error);
      return null;
    }
  },

  async exportCoverLetter(
    coverLetterText: string,
    jobTitle: string,
    companyName: string,
    request: ExportRequest
  ): Promise<ExportResponse | null> {
    try {
      const response = await fetch(`${API_BASE}/api/export/cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: JSON.stringify({
          content: coverLetterText,
          job_title: jobTitle,
          company_name: companyName,
          format: request.format,
          expiration_hours: request.expirationHours || 24,
          theme_id: request.theme || 'minimal',
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const data: ExportResponse = await response.json();

      // Trigger download
      if (data.download_url) {
        const link = document.createElement('a');
        link.href = data.download_url;
        link.download = `cover-letter.${request.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        m3Toast.success('Downloaded', `Cover letter exported as ${request.format.toUpperCase()}`);
      }

      return data;
    } catch (error) {
      m3Toast.error('Export Failed', error instanceof Error ? error.message : 'Unknown error');
      console.error('Cover letter export error:', error);
      return null;
    }
  },
};
