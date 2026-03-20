import { useMutation } from '@tanstack/react-query';
import { refineAchievement, RefineAchievementRequest } from '@/api/aiServices';
import { StructuredAchievement } from '../types';

/**
 * TanStack useMutation wrapper for achievement field refinement.
 * Replaces direct geminiService.refineAchievementField calls in TailoredResumeView.
 */
export function useAIRefinement() {
  const mutation = useMutation({
    mutationFn: (request: RefineAchievementRequest) => refineAchievement(request),
  });

  const refineField = async (
    ach: StructuredAchievement,
    field: keyof StructuredAchievement
  ): Promise<string> => {
    return mutation.mutateAsync({
      achievementId: ach.Achievement_ID,
      field: String(field),
      originalText: ach.Original_Text,
      actionVerb: ach.Action_Verb,
      nounTask: ach.Noun_Task,
      metric: ach.Metric,
      strategy: ach.Strategy,
      outcome: ach.Outcome,
    });
  };

  return {
    refineField,
    isRefining: mutation.isPending,
    activeKey: mutation.isPending
      ? mutation.variables?.achievementId + '-' + mutation.variables?.field
      : null,
    error: mutation.error,
    reset: mutation.reset,
  };
}
