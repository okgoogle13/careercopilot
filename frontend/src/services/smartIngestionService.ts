/**
 * Smart Ingestion API Service
 * Handles AI-powered document ingestion, tag suggestion, and asset library management
 */

import { apiGet, apiPost, apiDelete, ApiResponse } from './apiClient';

export interface ContextTags {
  roleType: string;
  subsectors: string[];
  confidence?: number;
  [key: string]: string | string[] | number | undefined;
}

export interface UploadAndTagRequest {
  file: File;
  documentType?: 'resume' | 'ksc' | 'voice';
  metadata?: Record<string, any>;
}

export interface UploadAndTagResponseData {
  suggestedTags: ContextTags;
  fileId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  confidenceScores: Record<string, number>;
}

export interface ExtractAndSaveRequest {
  file: File;
  selectedTags: string[];
  fileName: string;
  documentType?: 'resume' | 'ksc' | 'voice';
  metadata?: Record<string, any>;
}

export interface ExtractAndSaveResponseData {
  assetId: string;
  documentUrl: string;
  processedAt: string;
  extractedData: Record<string, any>;
  metadata: {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    mimeType: string;
  };
}

export interface AssetDocument {
  id: string;
  name: string;
  documentType: 'resume' | 'ksc' | 'voice';
  extractedData: Record<string, any>;
  tags: string[];
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

export interface DocumentFilters {
  documentType?: 'resume' | 'ksc' | 'voice';
  roleType?: string;
  subsectors?: string[];
  searchQuery?: string;
  page?: number;
  limit?: number;
}

const INGESTION_BASE_PATH = '/ingestion';

export const smartIngestionService = {
  /**
   * Upload document and get AI-suggested tags
   * @param file The file to upload
   * @returns Promise with suggested tags and file metadata
   */
  async uploadAndTag(
    file: File
  ): Promise<ApiResponse<UploadAndTagResponseData>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiPost<UploadAndTagResponseData>(
      `${INGESTION_BASE_PATH}/upload-and-tag`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  /**
   * Extract structured data and save to asset library
   * @param request Extract and save request data
   * @returns Promise with the saved asset details
   */
  async extractAndSave(
    request: ExtractAndSaveRequest
  ): Promise<ApiResponse<ExtractAndSaveResponseData>> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('fileName', request.fileName);
    formData.append('selectedTags', JSON.stringify(request.selectedTags));
    
    if (request.documentType) {
      formData.append('documentType', request.documentType);
    }
    
    if (request.metadata) {
      formData.append('metadata', JSON.stringify(request.metadata));
    }

    return apiPost<ExtractAndSaveResponseData>(
      `${INGESTION_BASE_PATH}/extract-and-save`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  /**
   * Get all assets in user's asset library
   * @param userId Optional user ID (defaults to current user)
   * @returns Promise with array of asset documents
   */
  async getAssetLibrary(
    userId?: string
  ): Promise<ApiResponse<{ assets: AssetDocument[] }>> {
    const params = userId ? { userId } : undefined;
    return apiGet<{ assets: AssetDocument[] }>(
      `${INGESTION_BASE_PATH}/assets`,
      { params }
    );
  },

  /**
   * Get specific asset by ID
   * @param assetId The ID of the asset to retrieve
   * @returns Promise with the asset document
   */
  async getAssetById(
    assetId: string
  ): Promise<ApiResponse<{ asset: AssetDocument }>> {
    return apiGet<{ asset: AssetDocument }>(
      `${INGESTION_BASE_PATH}/assets/${assetId}`
    );
  },

  /**
   * Delete an asset from library
   * @param assetId The ID of the asset to delete
   * @returns Promise with success status
   */
  async deleteAsset(
    assetId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiDelete<{ success: boolean }>(
      `${INGESTION_BASE_PATH}/assets/${assetId}`
    );
  },

  /**
   * Search assets with filters
   * @param filters Search filters
   * @returns Promise with matching assets
   */
  async searchAssets(
    filters: DocumentFilters
  ): Promise<ApiResponse<{ assets: AssetDocument[]; total: number }>> {
    return apiGet<{ assets: AssetDocument[]; total: number }>(
      `${INGESTION_BASE_PATH}/assets/search`,
      { params: filters }
    );
  },

  /**
   * Health check for Smart Ingestion service
   * @returns Promise with service status
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return apiGet<{ status: string }>(`${INGESTION_BASE_PATH}/health`);
  },

  /**
   * Get confidence scores for suggested tags
   * @param tags Array of tags to get confidence scores for
   * @returns Promise with confidence scores
   */
  async getConfidenceScores(
    tags: string[]
  ): Promise<ApiResponse<Record<string, number>>> {
    return apiPost<Record<string, number>>(
      `${INGESTION_BASE_PATH}/confidence-scores`,
      { tags }
    );
  },
};
