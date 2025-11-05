// Application status enum
export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected';

// Priority level enum
export type PriorityLevel = 'low' | 'medium' | 'high';

// Document type enum
export type DocumentType = 'resume' | 'cover_letter' | 'ksc';

// Timeline event type
export type TimelineEventType =
  | 'applied'
  | 'interview'
  | 'followup'
  | 'offer'
  | 'rejection'
  | 'note';

/**
 * Represents a single job application
 */
export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  jobDescription: string;
  jobUrl?: string;
  status: ApplicationStatus;
  priority: PriorityLevel;
  appliedDate: string; // ISO date string
  notes?: string;
  documents?: ApplicationDocument[];
  timeline?: TimelineEvent[];
}

/**
 * Represents a document associated with an application
 */
export interface ApplicationDocument {
  id: string;
  type: DocumentType;
  name: string;
  url?: string;
  version?: number;
  createdAt?: string; // ISO date string
}

/**
 * Represents a timeline event for an application
 */
export interface TimelineEvent {
  id: string;
  date: string; // ISO date string
  event: string;
  type: TimelineEventType;
}

/**
 * Request payload for creating a new application
 */
export interface CreateApplicationRequest {
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  jobDescription: string;
  jobUrl?: string;
  documents?: string[]; // document IDs
  deadline?: string; // ISO date string
  priority: PriorityLevel;
  notes?: string;
}

/**
 * Request payload for updating an application
 */
export interface UpdateApplicationRequest {
  jobTitle?: string;
  company?: string;
  location?: string;
  salary?: string;
  jobDescription?: string;
  status?: ApplicationStatus;
  priority?: PriorityLevel;
  notes?: string;
}

/**
 * Response from create application API
 */
export interface CreateApplicationResponse {
  id: string;
  message: string;
  application: Application;
}

/**
 * Application statistics
 */
export interface ApplicationStats {
  total: number;
  applied: number;
  interviewing: number;
  offer: number;
  rejected: number;
}

/**
 * Application filter options
 */
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  priority?: PriorityLevel[];
  dateRange?: {
    from: string;
    to: string;
  };
  company?: string;
  search?: string;
}

/**
 * Parsed job posting information
 */
export interface ParsedJobPosting {
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  jobDescription: string;
}
