import { useState, useEffect } from 'react';
import { CareerDatabase, MatchAnalysis, StructuredAchievement } from '../../../types/career';
import { genkitService } from '../../../api/genkitService';

interface UseTailoredResumeProps {
  careerData: CareerDatabase;
  analysis: MatchAnalysis;
  onUpdate?: (data: CareerDatabase) => void;
}

export function useTailoredResume({ careerData, analysis, onUpdate }: UseTailoredResumeProps) {
  const [achievements, setAchievements] = useState<StructuredAchievement[]>(
    careerData.Structured_Achievements
  );
  const [tailoredSummary, setTailoredSummary] = useState(analysis.Tailored_Summary);
  const [isPolishing, setIsPolishing] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  // Sync achievements if careerData changes from outside
  useEffect(() => {
    setAchievements(careerData.Structured_Achievements);
  }, [careerData.Structured_Achievements]);

  const handlePolish = async (achId: string, field: keyof StructuredAchievement) => {
    setIsPolishing(`${achId}-${String(field)}`);
    try {
      const ach = achievements.find((a) => a.Achievement_ID === achId);
      if (!ach) return;
      const polishedText = await genkitService.refineAchievementField(ach, field as string);
      setSuggestions((prev) => ({ ...prev, [`${achId}-${String(field)}`]: polishedText }));
    } catch (error) {
      console.error('Failed to polish text:', error);
      alert('Failed to polish text. Please try again.');
    } finally {
      setIsPolishing(null);
    }
  };

  const applySuggestion = (achId: string, field: keyof StructuredAchievement) => {
    const suggestion = suggestions[`${achId}-${String(field)}`];
    if (!suggestion) return;

    const updatedAchievements = achievements.map((a) =>
      a.Achievement_ID === achId ? { ...a, [field]: suggestion } : a
    );

    setAchievements(updatedAchievements);

    if (onUpdate) {
      onUpdate({
        ...careerData,
        Structured_Achievements: updatedAchievements,
      });
    }

    setSuggestions((prev) => {
      const next = { ...prev };
      delete next[`${achId}-${String(field)}`];
      return next;
    });
  };

  const discardSuggestion = (achId: string, field: keyof StructuredAchievement) => {
    setSuggestions((prev) => {
      const next = { ...prev };
      delete next[`${achId}-${String(field)}`];
      return next;
    });
  };

  const getAchievementsForEntry = (entryId: string) => {
    const entryAchievements = achievements.filter((a) => a.Entry_ID === entryId);

    return entryAchievements.sort((a, b) => {
      const aIsRecommended = analysis.Recommended_Achievement_IDs.includes(a.Achievement_ID);
      const bIsRecommended = analysis.Recommended_Achievement_IDs.includes(b.Achievement_ID);
      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;
      return 0;
    });
  };

  const workEntries = careerData.Career_Entries.filter(
    (e) => e.Entry_Type === 'Work Experience'
  ).sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

  const educationEntries = careerData.Career_Entries.filter((e) => e.Entry_Type === 'Education');

  return {
    achievements,
    tailoredSummary,
    setTailoredSummary,
    isPolishing,
    suggestions,
    handlePolish,
    applySuggestion,
    discardSuggestion,
    getAchievementsForEntry,
    workEntries,
    educationEntries,
  };
}
