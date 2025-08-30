import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStatus } from './useAuthStatus';

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

interface DocumentType {
  id: string;
  originalFilename: string;
}

interface UseAnalysisDataReturn {
  // Documents data
  documents: DocumentType[];
  documentsLoading: boolean;
  documentsError: string | null;

  // Analysis data
  analysisResult: AtsResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;

  // Actions
  performAnalysis: (
    documentId: string,
    jobDescription: string
  ) => Promise<void>;
  clearAnalysis: () => void;
}

/**
 * Custom hook that manages all data fetching and API operations for the Analysis page.
 * Encapsulates document fetching, ATS analysis, and error handling.
 */
export const useAnalysisData = (): UseAnalysisDataReturn => {
  const {
    isAuthenticated,
    isLoading: authLoading,
    getAuthToken,
  } = useAuthStatus();

  // Documents state
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  // Analysis state
  const [analysisResult, setAnalysisResult] = useState<AtsResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  /**
   * Fetch user's documents from API
   */
  const fetchDocuments = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    try {
      setDocumentsLoading(true);
      setDocumentsError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      const response = await fetch('/api/v1/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load documents';
      setDocumentsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDocumentsLoading(false);
    }
  }, [isAuthenticated, authLoading, getAuthToken]);

  /**
   * Perform ATS analysis on selected document and job description
   */
  const performAnalysis = useCallback(
    async (documentId: string, jobDescription: string) => {
      if (!documentId || !jobDescription) {
        toast.error('Please select a resume and paste a job description.');
        return;
      }

      if (!isAuthenticated) {
        toast.error('You must be logged in to perform analysis.');
        return;
      }

      setIsAnalyzing(true);
      setAnalysisResult(null);
      setAnalysisError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Unable to get authentication token');
        }

        const response = await fetch(
          `/api/v1/analysis/ats-score/${documentId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              job_description: jobDescription,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Analysis request failed');
        }

        const result: AtsResult = await response.json();
        setAnalysisResult(result);
        toast.success('Analysis complete!');
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Analysis failed';
        setAnalysisError(errorMessage);
        toast.error(`Analysis failed: ${errorMessage}`);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [isAuthenticated, getAuthToken]
  );

  /**
   * Clear current analysis results
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  // Fetch documents when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchDocuments();
    } else if (!authLoading && !isAuthenticated) {
      setDocumentsLoading(false);
      setDocumentsError('You must be logged in to view documents.');
    }
  }, [isAuthenticated, authLoading, fetchDocuments]);

  return {
    // Documents data
    documents,
    documentsLoading,
    documentsError,

    // Analysis data
    analysisResult,
    isAnalyzing,
    analysisError,

    // Actions
    performAnalysis,
    clearAnalysis,
  };
};

export type { AtsResult, DocumentType, KeywordPlacementSuggestion };
