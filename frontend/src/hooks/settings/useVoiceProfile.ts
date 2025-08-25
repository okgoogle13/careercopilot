import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../../utils/apiClient';
import { ApiError } from '../../utils/errors';
import type { VoiceProfile } from '../../components/settings/VoiceProfileSettings';

export const useVoiceProfile = (initialProfile: VoiceProfile | null) => {
  const [voiceProfile, setVoiceProfile] =
    useState<VoiceProfile | null>(initialProfile);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newProfile = await apiClient.post<VoiceProfile>(
        '/profile/generate-voice-profile'
      );
      setVoiceProfile(newProfile);
      toast.success('Successfully generated and saved your voice profile!');
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'An unknown error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    voiceProfile,
    isGenerating,
    handleGenerate,
  };
};
