import React, { useState, useEffect, FormEvent } from 'react';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useAuthStatus, useAnalysis } from '../hooks';
import {
  OverallScore,
  ScoreBreakdown,
  Recommendations,
  KeywordLists,
  KeywordPlacementSuggestions,
} from '../components/Analysis';

interface DocumentType {
  id: string;
  originalFilename: string;
}

const AnalysisPage: React.FC = () => {
  // --- State ---
  const { user, loading: authLoading } = useAuthStatus();
  const {
    analysisResult,
    isAnalyzing,
    performAnalysis,
  } = useAnalysis();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // --- Effects ---
  useEffect(() => {
    const fetchDocuments = async (user: User) => {
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/documents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch documents.');
        const data = await response.json();
        setDocuments(data);
        if (data.length > 0) {
          setSelectedDocumentId(data[0].id);
        }
      } catch {
        toast.error('Could not load your documents.');
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      fetchDocuments(user);
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  // --- Handlers ---
  const handleAnalysis = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDocumentId || !jobDescription) {
      toast.error('Please select a resume and paste a job description.');
      return;
    }
    performAnalysis(selectedDocumentId, jobDescription);
  };

  // --- Render Functions ---
  const renderResults = () => {
    if (!analysisResult) return null;

    return (
      <div
        id="results-area"
        className="bg-white shadow-md rounded-lg p-6 animate-fade-in mt-8"
      >
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
        <OverallScore score={analysisResult.overallScore} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScoreBreakdown breakdown={analysisResult.breakdown} />
          <Recommendations recommendations={analysisResult.recommendations} />
          <KeywordLists
            matchedKeywords={analysisResult.matchedKeywords}
            missingKeywords={analysisResult.missingKeywords}
          />
        </div>
        <KeywordPlacementSuggestions
          suggestions={analysisResult.keyword_placement_suggestions || []}
        />
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">ATS Resume Score</h1>
      <p className="text-center text-gray-600 mb-8">
        Select your resume and paste a job description to get an instant ATS
        score and actionable feedback.
      </p>

      <form
        onSubmit={handleAnalysis}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <div className="mb-4">
          <label
            htmlFor="resume-select"
            className="block text-gray-700 font-bold mb-2"
          >
            1. Select Your Resume
          </label>
          <select
            id="resume-select"
            value={selectedDocumentId}
            onChange={e => setSelectedDocumentId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3"
            required
          >
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.originalFilename}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="job-description"
            className="block text-gray-700 font-bold mb-2"
          >
            2. Paste Job Description
          </label>
          <textarea
            id="job-description"
            rows={10}
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
            placeholder="Paste the full job description here..."
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
          >
            {isAnalyzing ? 'Analyzing...' : 'Get My Score'}
          </button>
        </div>
      </form>

      {renderResults()}
    </div>
  );
};

export default AnalysisPage;
