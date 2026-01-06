/**
 * Email API Service
 * Handles Gmail integration and email scanning for job opportunities
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface EmailConnection {
  connected: boolean;
  email: string;
  lastSyncTime?: string;
  connectionId: string;
}

export interface OpportunityEmail {
  id: string;
  from: string;
  subject: string;
  date: string;
  jobTitle?: string;
  companyName?: string;
  applicationDeadline?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  source: 'email' | 'manual' | 'chrome_extension';
  foundAt: string;
  deadline?: string;
}

export interface EmailScanResult {
  success: boolean;
  opportunitiesFound: number;
  opportunities: JobOpportunity[];
  scanTimestamp: string;
  errors?: string[];
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/email`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const emailService = {
  /**
   * Connect Gmail account (OAuth flow)
   */
  async connectGmail(authCode: string): Promise<EmailConnection> {
    try {
      const response = await apiClient.post('/connect-gmail', { authCode });
      return response.data;
    } catch (error) {
      console.error('Connect Gmail error:', error);
      throw error;
    }
  },

  /**
   * Disconnect Gmail account
   */
  async disconnectEmail(userId?: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post('/disconnect', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Disconnect email error:', error);
      throw error;
    }
  },

  /**
   * Scan inbox for job opportunities
   */
  async scanInbox(userId?: string): Promise<EmailScanResult> {
    try {
      const response = await apiClient.post('/scan-inbox', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Scan inbox error:', error);
      throw error;
    }
  },

  /**
   * Get detected job opportunities from email
   */
  async getOpportunities(userId?: string): Promise<JobOpportunity[]> {
    try {
      const response = await apiClient.get('/opportunities', {
        params: { userId },
      });
      return response.data.opportunities;
    } catch (error) {
      console.error('Get opportunities error:', error);
      throw error;
    }
  },

  /**
   * Get email connection status
   */
  async getConnectionStatus(): Promise<EmailConnection> {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('Get connection status error:', error);
      throw error;
    }
  },

  /**
   * Setup email monitoring with filters
   */
  async setupMonitoring(config: {
    emailFilters: string[];
    keywords: string[];
    autoScan: boolean;
    scanInterval?: number; // minutes
  }): Promise<{ monitoringId: string; success: boolean }> {
    try {
      const response = await apiClient.post('/setup-monitoring', config);
      return response.data;
    } catch (error) {
      console.error('Setup monitoring error:', error);
      throw error;
    }
  },
};
