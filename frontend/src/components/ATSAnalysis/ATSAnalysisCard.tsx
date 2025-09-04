import React from 'react';

interface ATSAnalysisCardProps {
  jobDescription?: string;
  onNavigateToTemplates: () => void;
}

const ATSAnalysisCard: React.FC<ATSAnalysisCardProps> = ({
  jobDescription,
  onNavigateToTemplates,
}) => {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisComplete, setAnalysisComplete] = React.useState(false);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate ATS analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisComplete(true);
    } catch (error) {
      console.error('ATS analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewTemplates = () => {
    onNavigateToTemplates();
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
          <svg
            className='w-5 h-5 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>ATS Compliance Analysis</h3>
          <p className='text-sm text-gray-600'>
            Optimize your resume for applicant tracking systems
          </p>
        </div>
      </div>

      {!analysisComplete ? (
        <div className='space-y-4'>
          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800 mb-3'>
              Run an ATS analysis to get personalized template recommendations based on your job
              description.
            </p>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !jobDescription}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isAnalyzing || !jobDescription
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isAnalyzing ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                  Analyzing...
                </div>
              ) : (
                'Run ATS Analysis'
              )}
            </button>
            {!jobDescription && (
              <p className='text-xs text-gray-500 mt-2'>
                Add a job description to enable ATS analysis
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <svg className='w-4 h-4 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-sm font-medium text-green-800'>Analysis Complete</span>
            </div>
            <p className='text-sm text-green-700 mb-3'>
              Found 5 optimized templates that match your job requirements with 85%+ ATS
              compatibility.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 text-center'>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>92%</div>
              <div className='text-xs text-gray-600'>Best Match Score</div>
            </div>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>5</div>
              <div className='text-xs text-gray-600'>Recommended Templates</div>
            </div>
          </div>

          <button
            onClick={handleViewTemplates}
            className='w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium'
          >
            View Optimized Templates
          </button>
        </div>
      )}
    </div>
  );
};

export default ATSAnalysisCard;
