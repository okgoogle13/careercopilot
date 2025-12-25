// Shared types for API responses and requests

// Base API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  userId: string | null;
  error?: string;
}
// Application related types
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  notes?: string;
}

export interface InterviewSchedule {
  id: string;
  type: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  interviewer?: string;
  feedback?: string;
}

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "interviewing"
  | "offer_received"
  | "rejected"
  | "archived";

export interface ApplicationBase {
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  status: ApplicationStatus;
  source?: "email" | "manual" | "job_board";
  jobId?: string;
  appliedDate?: string;
  deadline?: string;
  salary?: string;
  location?: string;
  notes?: string;
  rating?: number;
  isFavorite?: boolean;
  contacts?: Contact[];
  interviews?: InterviewSchedule[];
  documents?: {
    resumeId?: string;
    coverLetterId?: string;
    kscId?: string;
  };
  // Using unknown to avoid circular dependency with firebase-admin
  // These will be properly typed when used with Firestore
  createdAt: unknown;
  updatedAt: unknown;
  archived?: boolean;
}

export interface Application extends ApplicationBase {
  id: string;
}

export interface ApplicationCreate extends Omit<
  ApplicationBase,
  "createdAt" | "updatedAt" | "userId" | "id"
> {
  // All required fields from ApplicationBase except those in Omit
}

export interface ApplicationUpdate extends Partial<
  Omit<ApplicationBase, "id" | "userId" | "createdAt">
> {
  // All fields optional except those in Omit
}

export interface BulkUpdate {
  status?: ApplicationStatus;
  rating?: number;
  archived?: boolean;
}
