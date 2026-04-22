/**
 * Voice Profile Creation Panel
 *
 * Entry point component that combines the submission form and status display.
 * Manages voice profile state and API integration.
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VoiceSampleSubmissionForm } from './VoiceSampleSubmissionForm';
import { VoiceProfileStatusCard } from './VoiceProfileStatusCard';
import { createVoiceProfile, getVoiceProfile } from '@/api/voiceProfileService';

export interface VoiceProfileCreationPanelProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Main panel for voice profile creation and display.
 * Integrates form submission with status display and error handling.
 *
 * Backend confirms creation but does not return profile attributes.
 * `profileSaved` tracks local confirmation so the status card can
 * exit the empty state and the form can collapse after a successful submit.
 */
export function VoiceProfileCreationPanel({ onSuccess, onError }: VoiceProfileCreationPanelProps) {
  const [profileSaved, setProfileSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: existingProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['voiceProfile'],
    queryFn: getVoiceProfile,
  });

  useEffect(() => {
    if (existingProfile) {
      setProfileSaved(true);
      if (existingProfile.savedAt) {
        setSavedAt(existingProfile.savedAt);
      }
    }
  }, [existingProfile]);

  const handleSubmit = useCallback(
    async (sample: string) => {
      setLoading(true);
      setError(null);

      try {
        await createVoiceProfile([sample]);

        setProfileSaved(true);
        setSavedAt(new Date().toISOString());

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create voice profile';
        setError(errorMessage);

        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <VoiceProfileStatusCard
        profileSaved={profileSaved}
        savedAt={savedAt}
        loading={loading || isLoadingProfile}
      />

      {/* Submission Form — hidden once a profile is confirmed saved */}
      {!profileSaved && (
        <VoiceSampleSubmissionForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}

      {/* Update affordance — allows re-submission after a profile exists */}
      {profileSaved && !loading && (
        <button
          type="button"
          onClick={() => {
            setProfileSaved(false);
            setSavedAt(undefined);
            setError(null);
          }}
          style={{
            color: 'var(--sys-color-concreteGrey-base)',
            borderColor: 'var(--sys-color-concreteGrey-base)',
            borderRadius: 'var(--sys-shape-blockRiot03)',
          }}
          className="w-full px-6 py-3 border font-display font-bold text-xs uppercase tracking-wide opacity-60 hover:opacity-90 transition-opacity"
        >
          Update Writing Sample
        </button>
      )}
    </div>
  );
}
