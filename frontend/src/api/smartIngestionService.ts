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
  documentType: 'resume' | 'ksc' | 'voice';
  extractedData: Record<string, any>;
  tags: ContextTags;
  metadata: {
    fileName: string;
    fileType: string;
    uploadDate: string;
    storageUri: string;
    fileSizeBytes?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFilters {
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
  /**
   * Upload document and get AI-suggested tags
   * Step 1 of Smart Ingestion workflow
   */
  async uploadAndTag(file: File): Promise<UploadAndTagResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/upload-and-tag', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      console.error('Upload and tag error:', error);
      throw error;
    }
  },

  /**
   * Extract structured data and save to asset library
   * Step 2 of Smart Ingestion workflow
   */
  async extractAndSave(request: ExtractAndSaveRequest): Promise<ExtractAndSaveResponse> {
    try {
      const response = await apiClient.post('/extract-and-save', request);
      return response.data;
    } catch (error) {
      console.error('Extract and save error:', error);
      throw error;
    }
  },

  /**
   * Get all assets in user's asset library
   */
  async getAssetLibrary(userId?: string): Promise<AssetDocument[]> {
    try {
      const response = await apiClient.get('/asset-library', {
        params: { userId },
      });
      return response.data.assets;
    } catch (error) {
      console.error('Get asset library error:', error);
      throw error;
    }
  },

  /**
   * Get specific asset by ID
   */
  async getAssetById(assetId: string): Promise<AssetDocument> {
    try {
      const response = await apiClient.get(`/asset-library/${assetId}`);
      return response.data;
    } catch (error) {
      console.error('Get asset by ID error:', error);
      throw error;
    }
  },

  /**
   * Delete an asset from library
   */
  async deleteAsset(assetId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/asset-library/${assetId}`);
      return response.data;
    } catch (error) {
      console.error('Delete asset error:', error);
      throw error;
    }
  },

  /**
   * Search assets with filters
   */
  async searchAssets(filters: DocumentFilters): Promise<AssetDocument[]> {
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
