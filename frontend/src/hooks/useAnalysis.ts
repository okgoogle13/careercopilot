import { useState } from 'react';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

// --- Type Definitions ---
interface KeywordPlacementSuggestion {
  keyword: string;
  suggested_location: string;
  example_sentence: string;
}

interface AtsResult {
  overallScore: number;
  breakdown: {
    keywordScore: number;
    semanticScore: number;
    formattingScore: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  keyword_placement_suggestions?: KeywordPlacementSuggestion[];
}


interface UseAnalysisReturn {
  analysisResult: AtsResult | null;
  isAnalyzing: boolean;
  error: string | null;
  performAnalysis: (documentId: string, jobDescription: string) => Promise<void>;
}

export const useAnalysis = (): UseAnalysisReturn => {
  const [analysisResult, setAnalysisResult] = useState<AtsResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = async (documentId: string, jobDescription: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('Authentication error.');
      setIsAnalyzing(false);
      toast.error('Authentication error.');
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/analysis/ats-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          document_id: documentId,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis request failed.');
      }

      const result: AtsResult = await response.json();
      setAnalysisResult(result);
      toast.success('Analysis complete!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analysisResult, isAnalyzing, error, performAnalysis };
};
