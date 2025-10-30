/**
 * Template API Service
 * Handles document templates and theme management
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Template {
  id: string;
  name: string;
  type: 'resume' | 'cover_letter' | 'ksc';
  category?: string;
  description?: string;
  thumbnail?: string;
  previewUrl?: string;
  isDefault: boolean;
  isCustom: boolean;
  config: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    spacing?: Record<string, number>;
    layout?: string;
  };
}

export interface TemplateCustomization {
  templateId: string;
  customizations: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    spacing?: Record<string, number>;
  };
  previewData?: Record<string, any>;
}

export type TemplateType = 'resume' | 'cover_letter' | 'ksc';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/templates`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const templateService = {
  /**
   * List all available templates
   */
  async listTemplates(type?: TemplateType): Promise<Template[]> {
    try {
      const response = await apiClient.get('/', {
        params: { type },
      });
      return response.data.templates;
    } catch (error) {
      console.error('List templates error:', error);
      throw error;
    }
  },

  /**
   * Get specific template details
   */
  async getTemplate(templateId: string): Promise<Template> {
    try {
      const response = await apiClient.get(`/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Get template error:', error);
      throw error;
    }
  },

  /**
   * Select template as default for user
   */
  async selectTemplate(
    templateId: string,
    userId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/${templateId}/select`, {
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Select template error:', error);
      throw error;
    }
  },

  /**
   * Create custom template
   */
  async createCustomTemplate(data: Partial<Template>): Promise<Template> {
    try {
      const response = await apiClient.post('/custom', data);
      return response.data;
    } catch (error) {
      console.error('Create custom template error:', error);
      throw error;
    }
  },

  /**
   * Update custom template
   */
  async updateCustomTemplate(templateId: string, data: Partial<Template>): Promise<Template> {
    try {
      const response = await apiClient.put(`/${templateId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update custom template error:', error);
      throw error;
    }
  },

  /**
   * Delete custom template
   */
  async deleteCustomTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Delete custom template error:', error);
      throw error;
    }
  },

  /**
   * Get template preview
   */
  async getTemplatePreview(
    templateId: string,
    previewData: Record<string, any>
  ): Promise<{ previewHtml: string; previewUrl: string }> {
    try {
      const response = await apiClient.post(`/${templateId}/preview`, {
        previewData,
      });
      return response.data;
    } catch (error) {
      console.error('Get template preview error:', error);
      throw error;
    }
  },
};
