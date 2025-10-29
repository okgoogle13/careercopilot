/**
 * Workflow API Service
 * Handles application package generation and workflow status tracking
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ApplicationPackageRequest {
  jobDescription: string;
  profileId: string;
  includeKSC?: boolean;
  includeCoverLetter?: boolean;
  includeResume?: boolean;
}

export interface GeneratedDocument {
  type: 'resume' | 'cover_letter' | 'ksc';
  content: string;
  fileName: string;
  downloadUrl?: string;
}

export interface ApplicationPackage {
  id: string;
  jobTitle: string;
  documents: GeneratedDocument[];
  generatedAt: string;
  processingTimeSeconds: number;
}

export interface WorkflowStatus {
  workflowId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  estimatedTimeRemaining?: number;
  error?: string;
  result?: ApplicationPackage;
}

export interface Workflow {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  processingTimeSeconds?: number;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/workflows`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const workflowService = {
  /**
   * Generate complete application package
   */
  async generateApplicationPackage(
    request: ApplicationPackageRequest
  ): Promise<ApplicationPackage> {
    try {
      const response = await apiClient.post('/generate-application', request);
      return response.data;
    } catch (error) {
      console.error('Generate application package error:', error);
      throw error;
    }
  },

  /**
   * Get workflow status
   */
  async getWorkflowStatus(workflowId: string): Promise<WorkflowStatus> {
    try {
      const response = await apiClient.get(`/status/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error('Get workflow status error:', error);
      throw error;
    }
  },

  /**
   * List all workflows for user
   */
  async listWorkflows(userId?: string): Promise<Workflow[]> {
    try {
      const response = await apiClient.get('/', {
        params: { userId },
      });
      return response.data.workflows;
    } catch (error) {
      console.error('List workflows error:', error);
      throw error;
    }
  },

  /**
   * Cancel workflow
   */
  async cancelWorkflow(workflowId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post(`/${workflowId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel workflow error:', error);
      throw error;
    }
  },

  /**
   * Poll workflow status (useful for progress tracking)
   */
  async pollWorkflowStatus(
    workflowId: string,
    maxAttempts: number = 120,
    intervalMs: number = 1000
  ): Promise<WorkflowStatus> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        attempts++;

        try {
          const status = await this.getWorkflowStatus(workflowId);

          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(interval);
            resolve(status);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Workflow polling timeout'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, intervalMs);
    });
  },
};
