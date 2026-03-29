import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { ATSScorer } from '../services/atsScorer';
import { ATSScoreResult, CoverLetterScoreResult, DocumentType } from '../../../types/career';

export function useATSScoring(
  documentText: string,
  jobDescription: string,
  documentType: DocumentType = 'resume',
  debounceMs: number = 800
) {
  const [score, setScore] = useState<ATSScoreResult | CoverLetterScoreResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  /**
   * Orchestrator Decision: KR Solidarity v6.1 Authority Model
   * 1. Backend (/api/v1/ats-score) is the Source of Truth for final results.
   * 2. Client-side (ATSScorer) provides immediate heuristic feedback for UX speed.
   */
  const scorer = new ATSScorer();

  const calculate = useCallback(
    debounce((text: string, job: string, type: DocumentType) => {
      setIsCalculating(true);
      try {
        const result = scorer.calculateScore(text, job, type);
        setScore(result);
      } catch (error) {
        console.error('ATS scoring error:', error);
      } finally {
        setIsCalculating(false);
      }
    }, debounceMs),
    []
  );

  useEffect(() => {
    if (documentText && jobDescription) {
      calculate(documentText, jobDescription, documentType);
    }

    return () => {
      calculate.cancel();
    };
  }, [documentText, jobDescription, documentType, calculate]);

  return { score, isCalculating };
}
