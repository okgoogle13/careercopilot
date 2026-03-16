/**
 * Application API Service
 * Handles job application tracking and management
 */

import { axiosInstance } from '@/api/axiosConfig';

export type ApplicationStatus =
  | 'draft'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'archived';

export interface Contact {
  name: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  role?: string;
}

export interface InterviewSchedule {
  interviewDate: string;
  interviewType: 'phone' | 'video' | 'onsite' | 'take-home';
  interviewerNames?: string[];
  notes?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  source: 'email' | 'manual' | 'job_board';
  status: ApplicationStatus;
  appliedDate?: string;
  deadline?: string;
  contacts?: Contact[];
  interviews?: InterviewSchedule[];
  documents?: {
    resumeId: string;
    coverLetterId?: string;
    kscId?: string;
  };
  notes?: string;
  rating?: number; // 1-5
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  integrations?: {
    calendarEventId?: string;
    emailThreadId?: string;
  };
  metadata?: Record<string, any>;
  applicationMetadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationCreate {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  deadline?: string;
  documents?: {
    resumeId?: string;
    coverLetterId?: string;
    kscId?: string;
  };
}

export interface ApplicationUpdate extends Partial<ApplicationCreate> {
  status?: ApplicationStatus;
  rating?: number;
  notes?: string;
  contacts?: Contact[];
}

export interface BulkUpdate {
  status?: ApplicationStatus;
  rating?: number;
  archived?: boolean;
}

const APPLICATIONS_BASE_PATH = '/applications';

export const applicationService = {
  /**
   * Create new application
   */
  async createApplication(data: ApplicationCreate): Promise<Application> {
    try {
      const response = await axiosInstance.post(`${APPLICATIONS_BASE_PATH}/`, data);
      return response.data;
    } catch (error) {
      console.error('Create application error:', error);
      throw error;
    }
  },

  /**
   * Get all applications for user
   */
  async listApplications(
    userId?: string,
    filters?: { status?: ApplicationStatus; company?: string }
  ): Promise<Application[]> {
    try {
      const response = await axiosInstance.get(`${APPLICATIONS_BASE_PATH}/`, {
        params: { userId, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error('List applications error:', error);
      throw error;
    }
  },

  /**
   * Get specific application
   */
  async getApplication(applicationId: string): Promise<Application> {
    try {
      const response = await axiosInstance.get(`${APPLICATIONS_BASE_PATH}/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Get application error:', error);
      throw error;
    }
  },

  /**
   * Update application
   */
  async updateApplication(applicationId: string, updates: ApplicationUpdate): Promise<Application> {
    try {
      const response = await axiosInstance.put(
        `${APPLICATIONS_BASE_PATH}/${applicationId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error('Update application error:', error);
      throw error;
    }
  },

  /**
   * Delete application
   */
  async deleteApplication(applicationId: string): Promise<{ success: boolean }> {
    try {
      const response = await axiosInstance.delete(`${APPLICATIONS_BASE_PATH}/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete application error:', error);
      throw error;
    }
  },

  /**
   * Bulk update applications
   */
  async bulkUpdate(
    applicationIds: string[],
    updates: BulkUpdate
  ): Promise<{ updated: number; success: boolean }> {
    try {
      const response = await axiosInstance.post(`${APPLICATIONS_BASE_PATH}/bulk-update`, {
        applicationIds,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  },

  /**
   * Add contact to application
   */
  async addContact(applicationId: string, contact: Contact): Promise<Application> {
    try {
      const response = await axiosInstance.post(
        `${APPLICATIONS_BASE_PATH}/${applicationId}/contacts`,
        contact
      );
      return response.data;
    } catch (error) {
      console.error('Add contact error:', error);
      throw error;
    }
  },

  /**
   * Schedule interview
   */
  async scheduleInterview(
    applicationId: string,
    interview: InterviewSchedule
  ): Promise<Application> {
    try {
      const response = await axiosInstance.post(
        `${APPLICATIONS_BASE_PATH}/${applicationId}/interviews`,
        interview
      );
      return response.data;
    } catch (error) {
      console.error('Schedule interview error:', error);
      throw error;
    }
  },

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(userId: string, status: ApplicationStatus): Promise<Application[]> {
    try {
      const response = await axiosInstance.get(`${APPLICATIONS_BASE_PATH}/`, {
        params: { userId, status },
      });
      return response.data.applications;
    } catch (error) {
      console.error('Get applications by status error:', error);
      throw error;
    }
  },

  /**
   * Export applications as CSV
   */
  async exportApplications(userId: string): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`${APPLICATIONS_BASE_PATH}/export`, {
        params: { userId },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export applications error:', error);
      throw error;
    }
  },
};
