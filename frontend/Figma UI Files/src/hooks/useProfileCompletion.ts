import { useState, useCallback, useEffect } from 'react';
import {
  UserProfile,
  ProfileCompletion,
  OnboardingStatus,
  OnboardingStep,
} from '../types/profile';

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
  displayName: '',
  email: '',
  completionPercentage: 0,
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Custom hook for tracking profile completion and onboarding status
 * Manages the onboarding workflow and profile completion metrics
 */
export function useProfileCompletion(): UseProfileCompletionReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>({
    isFirstTimeUser: true,
    currentStep: 'welcome',
    stepsCompleted: [],
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
          currentStep: 'welcome',
        }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch profile';
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

    const checks = {
      personalInfoComplete: !!(
        profile.personalInfo?.fullName &&
        profile.personalInfo?.phone
      ),
      professionalSummaryComplete: !!profile.professionalSummary,
      skillsComplete: !!(
        profile.skills?.technical &&
        profile.skills.technical.length > 0
      ),
      experienceComplete: !!(
        profile.experience && profile.experience.length > 0
      ),
      educationComplete: !!(
        profile.education && profile.education.length > 0
      ),
      documentsUploaded: onboardingStatus.hasUploadedDocuments,
    };

    const completedItems = Object.values(checks).filter(Boolean).length;
    const totalItems = Object.keys(checks).length;
    const overallPercentage = Math.round((completedItems / totalItems) * 100);

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
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);

        // Persist to localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

        // In a real app, this would call an API endpoint
        calculateCompletionMetrics(updatedProfile);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update profile';
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
  const completeOnboardingStep = useCallback(
    async (step: OnboardingStep) => {
      setOnboardingStatus((prev) => {
        const stepsCompleted = [...prev.stepsCompleted];
        if (!stepsCompleted.includes(step)) {
          stepsCompleted.push(step);
        }

        // Determine next step
        const stepOrder: OnboardingStep[] = [
          'welcome',
          'upload',
          'review',
          'complete',
        ];
        const currentIndex = stepOrder.indexOf(step);
        const nextStep =
          currentIndex < stepOrder.length - 1
            ? stepOrder[currentIndex + 1]
            : 'complete';

        return {
          ...prev,
          stepsCompleted,
          currentStep: nextStep,
        };
      });
    },
    []
  );

  // Skip onboarding
  const skipOnboarding = useCallback(async () => {
    setOnboardingStatus((prev) => ({
      ...prev,
      currentStep: 'complete',
      stepsCompleted: [...prev.stepsCompleted, 'complete'],
    }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (profile) {
        const updatedProfile = {
          ...profile,
          onboardingComplete: true,
        };
        setProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }

      setOnboardingStatus((prev) => ({
        ...prev,
        isFirstTimeUser: false,
        currentStep: 'complete',
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to complete onboarding';
      setError(errorMessage);
      console.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Calculate completion metrics when profile changes
  const calculateCompletionMetrics = (updatedProfile: UserProfile) => {
    const completion = calculateCompletion();
    setOnboardingStatus((prev) => ({
      ...prev,
      profileCompletion: completion,
    }));
  };

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
