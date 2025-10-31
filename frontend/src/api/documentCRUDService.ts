/**
 * Document CRUD API Service
 * Handles document creation, reading, updating, and deletion
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  uploadDate: string;
  modifiedDate?: string;
  storageUri?: string;
  fileSizeBytes?: number;
}

export interface Document {
  id: string;
  userId: string;
  type: 'resume' | 'cover_letter' | 'ksc' | 'portfolio';
  name: string;
  content: string;
  profileId?: string;
  jobTitle?: string;
  companyName?: string;
  atsScore?: number;
  tags?: string[];
  metadata: DocumentMetadata;
  status: 'draft' | 'final' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUpdate {
  name?: string;
  content?: string;
  status?: 'draft' | 'final' | 'archived';
  tags?: string[];
  jobTitle?: string;
  companyName?: string;
}

export interface DocumentFilters {
  type?: string;
  status?: string;
  profileId?: string;
  limit?: number;
  offset?: number;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/documents-crud`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const documentCRUDService = {
  /**
   * Upload/create document
   */
  async uploadDocument(
    file: File,
    metadata: Partial<Document>
  ): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await apiClient.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  },

  /**
   * Get specific document
   */
  async getDocument(documentId: string): Promise<Document> {
    try {
      const response = await apiClient.get(`/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Get document error:', error);
      throw error;
    }
  },

  /**
   * List documents for user
   */
  async listDocuments(userId?: string, filters?: DocumentFilters): Promise<Document[]> {
    try {
      const response = await apiClient.get('/', {
        params: { userId, ...filters },
      });
      return response.data.documents;
    } catch (error) {
      console.error('List documents error:', error);
      throw error;
    }
  },

  /**
   * Update document
   */
  async updateDocument(
    documentId: string,
    updates: DocumentUpdate
  ): Promise<Document> {
    try {
      const response = await apiClient.put(`/${documentId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update document error:', error);
      throw error;
    }
  },

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  },

  /**
   * Create document version
   */
  async createVersion(
    documentId: string,
    versionData: Partial<Document>
  ): Promise<Document> {
    try {
      const response = await apiClient.post(`/${documentId}/versions`, versionData);
      return response.data;
    } catch (error) {
      console.error('Create version error:', error);
      throw error;
    }
  },

  /**
   * Get document versions
   */
  async getVersions(documentId: string): Promise<Document[]> {
    try {
      const response = await apiClient.get(`/${documentId}/versions`);
      return response.data.versions;
    } catch (error) {
      console.error('Get versions error:', error);
      throw error;
    }
  },

  /**
   * Restore document to specific version
   */
  async restoreVersion(documentId: string, versionId: string): Promise<Document> {
    try {
      const response = await apiClient.post(
        `/${documentId}/versions/${versionId}/restore`
      );
      return response.data;
    } catch (error) {
      console.error('Restore version error:', error);
      throw error;
    }
  },

  /**
   * Download document as file
   */
  async downloadDocument(
    documentId: string,
    format: 'pdf' | 'docx' | 'txt' = 'pdf'
  ): Promise<Blob> {
    try {
      const response = await apiClient.get(`/${documentId}/download`, {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Download document error:', error);
      throw error;
    }
  },

  /**
   * Duplicate document
   */
  async duplicateDocument(
    documentId: string,
    newName?: string
  ): Promise<Document> {
    try {
      const response = await apiClient.post(`/${documentId}/duplicate`, {
        newName,
      });
      return response.data;
    } catch (error) {
      console.error('Duplicate document error:', error);
      throw error;
    }
  },
};
