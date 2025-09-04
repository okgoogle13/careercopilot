import React, { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useAnalysisData } from '../hooks';
import {
  ScoreCircle,
  ScoreBreakdown,
  RecommendationsList,
  KeywordsList,
  KeywordPlacementSuggestions,
} from '../components/AnalysisResults';
import { ATSFeedbackLoop } from '../components/analysis/ATSFeedbackLoop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const AnalysisPage: React.FC = () => {
  // --- State ---
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  // --- Data & Actions ---
  const {
    documents,
    documentsLoading,
    documentsError,
    analysisResult,
    isAnalyzing,
    analysisError,
    performAnalysis,
    clearAnalysis,
  } = useAnalysisData();

  // --- Effects ---
  // Auto-select first document when documents are loaded
  React.useEffect(() => {
    if (documents.length > 0 && !selectedDocumentId) {
      setSelectedDocumentId(documents[0].id);
    }
  }, [documents, selectedDocumentId]);

  // --- Handlers ---
  const handleAnalysis = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedDocumentId || !jobDescription.trim()) {
      toast.error('Please select a resume and paste a job description.');
      return;
    }

    await performAnalysis(selectedDocumentId, jobDescription);
  };

  const handleClearResults = () => {
    clearAnalysis();
    setJobDescription('');
  };

  // --- Render Functions ---
  const renderResults = () => {
    if (!analysisResult) return null;

    return (
      <div id='results-area' className='bg-white shadow-lg rounded-lg p-8 animate-fade-in mt-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold text-gray-900'>Analysis Results</h2>
          <button
            onClick={handleClearResults}
            className='text-gray-500 hover:text-gray-700 text-sm font-medium'
          >
            Clear Results
          </button>
        </div>

        {/* Overall Score Circle */}
        <ScoreCircle score={analysisResult.overallScore} />

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Score Breakdown */}
          <div>
            <ScoreBreakdown breakdown={analysisResult.breakdown} />
          </div>

          {/* Recommendations */}
          <div>
            <RecommendationsList recommendations={analysisResult.recommendations} />
          </div>
        </div>

        {/* Keywords Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <KeywordsList
            title='Matched Keywords'
            keywords={analysisResult.matchedKeywords}
            variant='matched'
          />
          <KeywordsList
            title='Missing Keywords'
            keywords={analysisResult.missingKeywords}
            variant='missing'
          />
        </div>

        {/* Keyword Placement Suggestions */}
        <KeywordPlacementSuggestions
          suggestions={analysisResult.keyword_placement_suggestions || []}
        />
      </div>
    );
  };

  const renderError = () => {
    if (!documentsError && !analysisError) return null;

    const error = documentsError || analysisError;
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <span className='text-red-400'>⚠️</span>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-red-800'>Error</h3>
            <p className='text-sm text-red-700 mt-1'>{error}</p>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render ---
  if (documentsLoading) {
    return (
      <div className='p-8 text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
        <p className='mt-4 text-gray-600'>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className='p-8 max-w-6xl mx-auto'>
      {/* Page Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>ATS Resume Analysis</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Get an instant ATS compatibility score and actionable feedback to optimize your resume for
          any job posting. Our AI analyzes keyword matching, semantic relevance, and formatting
          compliance.
        </p>
      </div>

      {/* Error Display */}
      {renderError()}

      {/* Analysis Form */}
      <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
        <form onSubmit={handleAnalysis} className='space-y-6'>
          {/* Document Selection */}
          <div>
            <label
              htmlFor='resume-select'
              className='block text-sm font-semibold text-gray-900 mb-2'
            >
              1. Select Your Resume
            </label>
            {documents.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <p>No documents found. Please upload a resume first.</p>
              </div>
            ) : (
              <select
                id='resume-select'
                value={selectedDocumentId}
                onChange={e => setSelectedDocumentId(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                {documents.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.originalFilename}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job Description Input */}
          <div>
            <label
              htmlFor='job-description'
              className='block text-sm font-semibold text-gray-900 mb-2'
            >
              2. Paste Job Description
            </label>
            <textarea
              id='job-description'
              rows={12}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical'
              placeholder='Paste the complete job description here. Include responsibilities, requirements, qualifications, and any specific skills mentioned...'
              required
            />
            <p className='text-xs text-gray-500 mt-2'>
              💡 Tip: Include the complete job posting for the most accurate analysis.
            </p>
          </div>

          {/* Submit Button */}
          <div className='text-center'>
            <button
              type='submit'
              disabled={isAnalyzing || documents.length === 0}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg'
            >
              {isAnalyzing ? (
                <>
                  <span className='inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></span>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <span className='mr-2'>🔍</span>
                  Analyze My Resume
                </>
              )}
            </button>

            {isAnalyzing && (
              <p className='text-sm text-gray-600 mt-3'>
                This may take 30-60 seconds. We're analyzing your resume against the job
                requirements...
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {analysisResult && (
        <Tabs defaultValue='classic' className='mt-8'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='classic'>Classic Analysis</TabsTrigger>
            <TabsTrigger value='feedback'>AI Feedback Loop</TabsTrigger>
          </TabsList>

          <TabsContent value='classic' className='mt-6'>
            {renderResults()}
          </TabsContent>

          <TabsContent value='feedback' className='mt-6'>
            <ATSFeedbackLoop
              documentId={selectedDocumentId}
              jobDescription={jobDescription}
              onOptimizationComplete={newScore => {
                toast.success(`Resume optimized! New ATS score: ${newScore}`);
              }}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Help Section */}
      {!analysisResult && (
        <div className='bg-gray-50 rounded-lg p-6 mt-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>How it works:</h3>
          <div className='grid md:grid-cols-3 gap-4 text-sm text-gray-700'>
            <div className='flex items-start space-x-2'>
              <span className='text-blue-500'>1️⃣</span>
              <div>
                <strong>Keyword Analysis:</strong> We compare your resume's keywords against the job
                requirements.
              </div>
            </div>
            <div className='flex items-start space-x-2'>
              <span className='text-blue-500'>2️⃣</span>
              <div>
                <strong>Semantic Matching:</strong> Our AI understands context and related skills
                beyond exact matches.
              </div>
            </div>
            <div className='flex items-start space-x-2'>
              <span className='text-blue-500'>3️⃣</span>
              <div>
                <strong>ATS Compliance:</strong> We check formatting and structure for ATS-friendly
                design.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
