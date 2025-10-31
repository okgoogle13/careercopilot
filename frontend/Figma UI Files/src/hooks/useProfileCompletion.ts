import { useState, useCallback, useEffect } from 'react';
import type { UserProfile as AuthUserProfile } from '../api/authService';

// Local types
export interface ProfileCompletion {
  personalInfoComplete: boolean;
  professionalSummaryComplete: boolean;
  skillsComplete: boolean;
  experienceComplete: boolean;
  educationComplete: boolean;
  documentsUploaded: boolean;
  overallPercentage: number;
}

export enum OnboardingStep {
  WELCOME = 'welcome',
  UPLOAD = 'upload',
  REVIEW = 'review',
  COMPLETE = 'complete'
}

export interface OnboardingStatus {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isComplete: boolean;
  isFirstTimeUser: boolean;
  hasUploadedDocuments: boolean;
  profileCompletion: ProfileCompletion;
}

// Extend the UserProfile from auth service with additional fields needed for this hook
export interface UserProfile extends Omit<AuthUserProfile, 'uid'> {
  id: string; // Alias for uid
  completionPercentage: number;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseProfileCompletionReturn {
  // State
  profile: UserProfile | null;
  onboardingStatus: OnboardingStatus;
  isLoading: boolean;
  error: string | null;

  // Tracking
  completionPercentage: number;
  isProfileComplete: boolean;
  isOnboardingComplete: boolean;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboardingStep: (step: OnboardingStep) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  calculateCompletion: () => ProfileCompletion;
  clearError: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  uid: '',
  email: '',
  displayName: '',
  personalInfo: {
    fullName: '',
  },
  preferences: {},
  completionPercentage: 0,
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Custom hook for tracking profile completion and onboarding status
 * Manages the onboarding workflow and profile completion metrics
 */
export const useProfileCompletion = (): UseProfileCompletionReturn => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>({
    isFirstTimeUser: true,
    currentStep: OnboardingStep.WELCOME,
    completedSteps: [],
    isComplete: false,
    hasUploadedDocuments: false,
    profileCompletion: {
      personalInfoComplete: false,
      professionalSummaryComplete: false,
      skillsComplete: false,
      experienceComplete: false,
      educationComplete: false,
      documentsUploaded: false,
      overallPercentage: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate loading from localStorage or Firebase
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        calculateCompletionMetrics(parsedProfile);
      } else {
        // First time user
        setProfile(null);
        setOnboardingStatus((prev) => ({
          ...prev,
          isFirstTimeUser: true,
          currentStep: OnboardingStep.WELCOME,
          completedSteps: [],
          isComplete: false,
          hasUploadedDocuments: false,
          profileCompletion: {
            personalInfoComplete: false,
            professionalSummaryComplete: false,
            skillsComplete: false,
            experienceComplete: false,
            educationComplete: false,
            documentsUploaded: false,
            overallPercentage: 0,
          },
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate profile completion metrics
  const calculateCompletion = useCallback((): ProfileCompletion => {
    if (!profile) {
      return {
        personalInfoComplete: false,
        professionalSummaryComplete: false,
        skillsComplete: false,
        experienceComplete: false,
        educationComplete: false,
        documentsUploaded: false,
        overallPercentage: 0,
      };
    }

    // Type-safe checks for profile completion
    const personalInfo = profile.personalInfo || {};
    const skills = profile.skills || {};
    const experience = profile.experience || [];
    const education = profile.education || [];

    const checks = {
      personalInfoComplete: !!(personalInfo.fullName && personalInfo.phone),
      professionalSummaryComplete: !!profile.professionalSummary,
      skillsComplete: !!(Array.isArray(skills.technical) && skills.technical.length > 0),
      experienceComplete: experience.length > 0,
      educationComplete: education.length > 0,
      documentsUploaded: onboardingStatus.hasUploadedDocuments,
    };

    const completedItems = Object.values(checks).filter(Boolean).length;
    const totalItems = Object.keys(checks).length;
    const overallPercentage = Math.round((completedItems / Math.max(1, totalItems)) * 100);

    return {
      ...checks,
      overallPercentage,
    };
  }, [profile, onboardingStatus.hasUploadedDocuments]);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      setIsLoading(true);
      setError(null);
      try {
        // Create a new profile object with the updates
        const updatedProfile = {
          ...profile,
          ...updates,
          // Ensure required fields are always present
          id: updates.id ?? profile?.id ?? '',
          email: updates.email ?? profile?.email ?? '',
          displayName: updates.displayName ?? profile?.displayName ?? '',
          personalInfo: {
            ...profile?.personalInfo,
            ...updates.personalInfo,
          },
          preferences: {
            ...profile?.preferences,
            ...updates.preferences,
          },
          updatedAt: new Date().toISOString(),
        } as UserProfile;

        setProfile(updatedProfile);

        // Persist to localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

        // In a real app, this would call an API endpoint
        calculateCompletionMetrics(updatedProfile);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
        setError(errorMessage);
        console.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [profile]
  );

  // Complete onboarding step
  const completeOnboardingStep = useCallback(async (step: OnboardingStep) => {
    setOnboardingStatus((prev) => {
      const completedSteps = [...prev.completedSteps];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }

      // Determine next step
      const stepOrder: OnboardingStep[] = [
        OnboardingStep.WELCOME,
        OnboardingStep.UPLOAD,
        OnboardingStep.REVIEW,
        OnboardingStep.COMPLETE
      ];
      
      const currentIndex = stepOrder.indexOf(step);
      const nextStep = currentIndex < stepOrder.length - 1 
        ? stepOrder[currentIndex + 1] 
        : OnboardingStep.COMPLETE;

      return {
        ...prev,
        completedSteps,
        currentStep: nextStep,
        isComplete: nextStep === OnboardingStep.COMPLETE,
      };
    });
  }, []);

  // Skip onboarding
  const skipOnboarding = useCallback(async () => {
    setOnboardingStatus((prev) => ({
      ...prev,
      currentStep: OnboardingStep.COMPLETE,
      completedSteps: [...prev.completedSteps, OnboardingStep.COMPLETE],
      isComplete: true,
    }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (profile) {
        const updatedProfile: UserProfile = {
          ...profile,
          onboardingComplete: true,
          updatedAt: new Date().toISOString(),
        };
        setProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        setOnboardingStatus((prev) => ({
          ...prev,
          isComplete: true,
          currentStep: OnboardingStep.COMPLETE,
          completedSteps: [...prev.completedSteps, OnboardingStep.COMPLETE],
        }));
        
        // Mark onboarding as complete in the profile
        await updateProfile({ onboardingComplete: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding';
      setError(errorMessage);
      console.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Calculate completion metrics when profile changes
  const calculateCompletionMetrics = useCallback((profile: UserProfile | null) => {
    if (!profile) return;
    
    const completion = calculateCompletion();
    setCompletionPercentage(completion.overallPercentage);
    setIsProfileComplete(completion.overallPercentage >= 100);
  }, [calculateCompletion]);

  // Track document upload
  const handleDocumentUpload = useCallback(() => {
    setOnboardingStatus((prev) => ({
      ...prev,
      hasUploadedDocuments: true,
    }));
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const completion = calculateCompletion();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    profile,
    onboardingStatus,
    isLoading,
    error,
    completionPercentage: completion.overallPercentage,
    isProfileComplete: completion.overallPercentage === 100,
    isOnboardingComplete: onboardingStatus.currentStep === 'complete',
    fetchProfile,
    updateProfile,
    completeOnboardingStep,
    skipOnboarding,
    completeOnboarding,
    calculateCompletion,
    clearError,
  };
}
