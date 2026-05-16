/**
 * Application API Service
 * Handles job application tracking and management
 */

import { BaseApiService } from '@/api/baseApiService';

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

class ApplicationService extends BaseApiService {
  constructor() {
    super({ basePath: APPLICATIONS_BASE_PATH });
  }

  /**
   * Create new application
   */
  async createApplication(data: ApplicationCreate): Promise<Application> {
    return this.post<Application, ApplicationCreate>('', data);
  }

  /**
   * Get all applications for user
   */
  async listApplications(
    userId?: string,
    filters?: { status?: ApplicationStatus; company?: string }
  ): Promise<Application[]> {
    return this.get<Application[]>('', {
      params: { userId, ...filters },
    });
  }

  /**
   * Get specific application
   */
  async getApplication(applicationId: string): Promise<Application> {
    return this.get<Application>(applicationId);
  }

  /**
   * Update application
   */
  async updateApplication(applicationId: string, updates: ApplicationUpdate): Promise<Application> {
    return this.put<Application, ApplicationUpdate>(applicationId, updates);
  }

  /**
   * Delete application
   */
  async deleteApplication(applicationId: string): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(applicationId);
  }

  /**
   * Bulk update applications
   */
  async bulkUpdate(
    applicationIds: string[],
    updates: BulkUpdate
  ): Promise<{ updated: number; success: boolean }> {
    return this.post<
      { updated: number; success: boolean },
      { applicationIds: string[]; updates: BulkUpdate }
    >('bulk-update', { applicationIds, updates });
  }

  /**
   * Add contact to application
   */
  async addContact(applicationId: string, contact: Contact): Promise<Application> {
    return this.post<Application, Contact>(`${applicationId}/contacts`, contact);
  }

  /**
   * Schedule interview
   */
  async scheduleInterview(
    applicationId: string,
    interview: InterviewSchedule
  ): Promise<Application> {
    return this.post<Application, InterviewSchedule>(`${applicationId}/interviews`, interview);
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(userId: string, status: ApplicationStatus): Promise<Application[]> {
    const response = await this.get<{ applications: Application[] }>('', {
      params: { userId, status },
    });
    return response.applications;
  }

  /**
   * Export applications as CSV
   */
  async exportApplications(userId: string): Promise<Blob> {
    return this.get<Blob>('export', {
      params: { userId },
      responseType: 'blob',
    });
  }
}

export const applicationService = new ApplicationService();
