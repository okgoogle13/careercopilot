/**
 * Profile and onboarding related types
 */

export type OnboardingStep = 'welcome' | 'upload' | 'review' | 'complete';

/**
 * Represents a user's profile with completion tracking
 */
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  personalInfo?: {
    fullName: string;
    phone?: string;
    address?: string;
    linkedIn?: string;
    portfolio?: string;
  };
  professionalSummary?: string;
  skills?: {
    technical: string[];
    soft: string[];
    certifications: string[];
  };
  experience?: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    graduationDate: string;
  }>;
  completionPercentage: number;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile completion tracking
 */
export interface ProfileCompletion {
  personalInfoComplete: boolean;
  professionalSummaryComplete: boolean;
  skillsComplete: boolean;
  experienceComplete: boolean;
  educationComplete: boolean;
  documentsUploaded: boolean;
  overallPercentage: number; // 0-100
}

/**
 * Onboarding status
 */
export interface OnboardingStatus {
  isFirstTimeUser: boolean;
  currentStep: OnboardingStep;
  stepsCompleted: OnboardingStep[];
  hasUploadedDocuments: boolean;
  profileCompletion: ProfileCompletion;
}

/**
 * Document upload for onboarding
 */
export interface OnboardingDocument {
  id: string;
  file: File;
  type: 'resume' | 'cover_letter' | 'cv' | 'other';
  uploadedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedData?: {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills?: string[];
    experience?: Array<{
      title: string;
      company: string;
      duration: string;
    }>;
  };
}

/**
 * Onboarding completion data
 */
export interface OnboardingCompletion {
  userId: string;
  completedAt: string;
  stepsCompleted: OnboardingStep[];
  documentsProcessed: number;
  profileInitialized: boolean;
}
