import { apiGet, apiPost } from './apiClient';
import { ApiResponse } from '@/types/api';

// Types
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  applicationDeadline?: string;
  requirements: string[];
  skills: string[];
  type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote?: boolean;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead';
  isSaved?: boolean;
  applicationStatus?: 'not_applied' | 'applied' | 'reviewing' | 'interviewing' | 'offered' | 'rejected';
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  remote?: boolean;
  experienceLevel?: string[];
  jobType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  coverLetter?: string;
  status: 'submitted' | 'reviewing' | 'interviewing' | 'offered' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}

// API endpoints
const JOB_ENDPOINTS = {
  JOBS: '/jobs',
  JOB_BY_ID: (id: string) => `/jobs/${id}`,
  SAVE_JOB: '/jobs/saved',
  APPLY_JOB: (id: string) => `/jobs/${id}/apply`,
  APPLICATION_STATUS: (id: string) => `/applications/${id}/status`,
  SAVED_JOBS: '/jobs/saved',
  RECOMMENDED_JOBS: '/jobs/recommended',
};

/**
 * Fetch job listings with optional search parameters
 */
export const fetchJobListings = async (
  params: JobSearchParams = {}
): Promise<ApiResponse<{ jobs: JobListing[]; total: number; page: number; limit: number }>> => {
  return apiGet<{ jobs: JobListing[]; total: number; page: number; limit: number }>(
    JOB_ENDPOINTS.JOBS,
    { params }
  );
};

/**
 * Fetch a single job by ID
 */
export const fetchJobById = async (id: string): Promise<ApiResponse<{ job: JobListing }>> => {
  return apiGet<{ job: JobListing }>(JOB_ENDPOINTS.JOB_BY_ID(id));
};

/**
 * Save a job for later
 */
export const saveJob = async (jobId: string): Promise<ApiResponse<{ jobId: string }>> => {
  return apiPost<{ jobId: string }>(JOB_ENDPOINTS.SAVE_JOB, { jobId });
};

/**
 * Apply to a job
 */
export const applyToJob = async (
  jobId: string, 
  resumeId: string, 
  coverLetter?: string
): Promise<ApiResponse<{ 
  applicationId: string; 
  jobId: string; 
  status: string; 
  appliedAt: string 
}>> => {
  return apiPost<{ 
    applicationId: string; 
    jobId: string; 
    status: string; 
    appliedAt: string 
  }>(
    JOB_ENDPOINTS.APPLY_JOB(jobId),
    { resumeId, coverLetter }
  );
};

/**
 * Get application status
 */
export const getApplicationStatus = async (
  applicationId: string
): Promise<ApiResponse<{ 
  status: string; 
  updatedAt: string;
  job: Pick<JobListing, 'id' | 'title' | 'company'>;
}>> => {
  return apiGet<{ 
    status: string; 
    updatedAt: string;
    job: Pick<JobListing, 'id' | 'title' | 'company'>;
  }>(JOB_ENDPOINTS.APPLICATION_STATUS(applicationId));
};

/**
 * Get user's saved jobs
 */
export const getSavedJobs = async (): Promise<ApiResponse<{ jobs: JobListing[] }>> => {
  return apiGet<{ jobs: JobListing[] }>(JOB_ENDPOINTS.SAVED_JOBS);
};

/**
 * Get recommended jobs based on user's profile
 */
export const getRecommendedJobs = async (): Promise<ApiResponse<{ jobs: JobListing[] }>> => {
  return apiGet<{ jobs: JobListing[] }>(JOB_ENDPOINTS.RECOMMENDED_JOBS);
};

/**
 * Search jobs with advanced filters
 */
export const searchJobs = async (
  params: JobSearchParams
): Promise<ApiResponse<{ 
  jobs: JobListing[]; 
  total: number; 
  page: number; 
  limit: number;
  filters: {
    experienceLevels: string[];
    jobTypes: string[];
    salaryRange: { min: number; max: number };
  };
}>> => {
  return apiGet<{ 
    jobs: JobListing[]; 
    total: number; 
    page: number; 
    limit: number;
    filters: {
      experienceLevels: string[];
      jobTypes: string[];
      salaryRange: { min: number; max: number };
    };
  }>('/jobs/search', { params });
};
