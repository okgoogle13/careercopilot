/**
 * Document Generation API Service
 * Handles cover letter, resume, and KSC response generation
 */

import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface CoverLetterRequest {
  jobDescription: string;
  profileId: string;
  tone?: 'professional' | 'conversational' | 'formal';
  companyName?: string;
}

export interface CoverLetterResponse {
  success: boolean;
  coverLetter: string;
  message: string;
  processingTimeSeconds: number;
}

export interface TailoredResumeRequest {
  jobDescription: string;
  profileId: string;
  templateId?: string;
}

export interface TailoredResumeResponse {
  success: boolean;
  resume: string;
  downloadUrl?: string;
  message: string;
  processingTimeSeconds: number;
}

export interface OptimizeContentRequest {
  content: string;
  jobDescription: string;
  contentType: 'resume' | 'cover_letter' | 'general';
}

export interface OptimizeContentResponse {
  success: boolean;
  optimizedContent: string;
  suggestions: Array<{
    section: string;
    current: string;
    suggested: string;
    rationale: string;
  }>;
  estimatedScoreImprovement: number;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/documents`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const documentService = {
  /**
   * Generate cover letter
   */
  async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
    try {
      const response = await apiClient.post('/generate-cover-letter', request);
      return response.data;
    } catch (error) {
      console.error('Generate cover letter error:', error);
      throw error;
    }
  },

  /**
   * Generate tailored resume
   */
  async generateTailoredResume(request: TailoredResumeRequest): Promise<TailoredResumeResponse> {
    try {
      const response = await apiClient.post('/generate-tailored-resume', request);
      return response.data;
    } catch (error) {
      console.error('Generate tailored resume error:', error);
      throw error;
    }
  },

  /**
   * Optimize content for job application
   */
  async optimizeContent(request: OptimizeContentRequest): Promise<OptimizeContentResponse> {
    try {
      const response = await apiClient.post('/optimize-content', request);
      return response.data;
    } catch (error) {
      console.error('Optimize content error:', error);
      throw error;
    }
  },

  /**
   * Generate KSC response
   */
  async generateKSCResponse(request: {
    userProfile: Record<string, any>;
    kscStatement: string;
  }): Promise<{
    success: boolean;
    response: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    message: string;
    processingTimeSeconds: number;
  }> {
    try {
      const response = await apiClient.post('/generate-ksc-response', request);
      return response.data;
    } catch (error) {
      console.error('Generate KSC response error:', error);
      throw error;
    }
  },

  /**
   * Download document as PDF
   */
  async downloadDocumentPDF(documentId: string, fileName?: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/${documentId}/download`, {
        responseType: 'blob',
        params: { fileName },
      });
      return response.data;
    } catch (error) {
      console.error('Download document PDF error:', error);
      throw error;
    }
  },
  async processRedline(
    documentId: number,
    file: File,
    edits: unknown[]
  ): Promise<{ blob: Blob; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('edits', JSON.stringify(edits));
    formData.append('document_id', String(documentId));

    try {
      const response = await apiClient.post('/process/redline', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const disposition = response.headers['content-disposition'] ?? '';
      const match = disposition.match(/filename[^;=\n]*=["']?([^"'\n;]+)["']?/);
      const filename = match?.[1] ?? `redlined_${file.name}`;

      return { blob: response.data, filename };
    } catch (error) {
      console.error('Document redline error:', error);
      throw error;
    }
  },
};
