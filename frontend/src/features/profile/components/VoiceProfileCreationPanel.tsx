/**
 * Voice Profile Creation Panel
 *
 * Entry point component that combines the submission form and status display.
 * Manages voice profile state and API integration.
 */

import { useState, useCallback } from 'react';
import { VoiceSampleSubmissionForm } from './VoiceSampleSubmissionForm';
import { VoiceProfileStatusCard } from './VoiceProfileStatusCard';
import { createVoiceProfile } from '@/api/voiceProfileService';

export interface VoiceProfileCreationPanelProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Main panel for voice profile creation and display.
 * Integrates form submission with status display and error handling.
 */
export function VoiceProfileCreationPanel({ onSuccess, onError }: VoiceProfileCreationPanelProps) {
  const [tone, setTone] = useState<string | undefined>();
  const [vocabularyLevel, setVocabularyLevel] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (sample: string) => {
      setLoading(true);
      setError(null);

      try {
        // Call backend to create voice profile
        const result = await createVoiceProfile([sample]);

        // Note: Backend doesn't return detailed profile, just confirms creation
        // In a real implementation, we'd fetch or cache the profile
        // For now, show success state without specific tone/vocab

        if (onSuccess) {
          onSuccess();
        }

        // Reset form by clearing error
        setError(null);
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
        tone={tone}
        vocabularyLevel={vocabularyLevel}
        loading={loading}
      />

      {/* Submission Form */}
      <VoiceSampleSubmissionForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
