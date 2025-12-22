/**
 * Smart Ingestion API Service
 * Handles AI-powered document ingestion, tag suggestion, and asset library management
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ContextTags {
  roleType: string;
  subsectors: string[];
  confidence?: number;
}

export interface UploadAndTagResponse {
  suggestedTags: ContextTags;
  fileId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
}

export interface ExtractAndSaveRequest {
  fileId: string;
  documentType: 'resume' | 'ksc' | 'voice';
  confirmedTags: ContextTags;
}

export interface ExtractAndSaveResponse {
  status: 'success' | 'error';
  assetId: string;
  message: string;
}

export interface AssetDocument {
  id: string;
  name: string;
  documentType: 'resume' | 'ksc' | 'voice';
  extractedData: Record<string, any>;
  tags: string[];  // Changed from ContextTags to string[]
  metadata: {
    fileName: string;
    fileType: string;
    uploadDate: string;
    storageUri: string;
    fileSizeBytes?: number;
    extractedText?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilters {
  documentType?: 'resume' | 'ksc' | 'voice';
  roleType?: string;
  subsectors?: string[];
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/ingestion`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const smartIngestionService = {
  // ... (previous methods)

  /**
   * Search assets with filters
   */
  async searchAssets(filters: AssetFilters): Promise<AssetDocument[]> {
    try {
      const response = await apiClient.get('/asset-library/search', {
        params: filters,
      });
      return response.data.assets;
    } catch (error) {
      console.error('Search assets error:', error);
      throw error;
    }
  },

  /**
   * Health check for Smart Ingestion service
   */
  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },
};
