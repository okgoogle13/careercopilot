import React, { useState } from 'react';
import ResumeUpload from '../ResumeUpload/ResumeUpload';
import ATSAnalysisCard from '../ATSAnalysis/ATSAnalysisCard';
import TemplateSelector, { Template } from '../DocumentGeneration/TemplateSelector';
import DocumentPreview from '../DocumentGeneration/DocumentPreview';

type WorkflowStep = 'upload' | 'analysis' | 'templates' | 'generation' | 'preview' | 'export';

interface ResumeData {
  fileName: string;
  content: string;
  atsScore: number;
  recommendations: string[];
  fileSize: number;
  uploadedAt: Date;
}

export const WorkflowManager: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleResumeUpload = (uploadedData: ResumeData) => {
    setResumeData(uploadedData);
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = () => {
    setCurrentStep('templates');
  };

  const handleTemplateSelect = async (template: Template) => {
    setSelectedTemplate(template);
    setCurrentStep('generation');
    await generateDocument(template);
  };

  const generateDocument = async (template: Template) => {
    setIsGenerating(true);
    setError('');
    
    try {
      // Simulate document generation API call
      const response = await fetch('http://127.0.0.1:8000/api/v1/templates/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          userData: {
            name: 'John Doe', // Would extract from resume
            email: 'john.doe@example.com'
          },
          jobDescription: jobDescription || 'Position requiring relevant experience',
          resumeContent: resumeData?.content
        })
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Fetch preview
      const previewResponse = await fetch(`http://127.0.0.1:8000/api/v1/documents/preview/${template.id}`);
      if (!previewResponse.ok) {
        throw new Error(`Preview failed: ${previewResponse.status}`);
      }

      const previewData = await previewResponse.json();
      setGeneratedContent(previewData.previewHtml);
      setCurrentStep('preview');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
    setCurrentStep('export');
  };

  const stepIndicators = [
    { step: 'upload', label: 'Upload Resume', icon: '📄' },
    { step: 'analysis', label: 'ATS Analysis', icon: '🔍' },
    { step: 'templates', label: 'Select Template', icon: '🎨' },
    { step: 'generation', label: 'Generate Document', icon: '⚙️' },
    { step: 'preview', label: 'Preview & Export', icon: '👁️' }
  ];

  const getStepStatus = (step: WorkflowStep) => {
    const currentIndex = stepIndicators.findIndex(s => s.step === currentStep);
    const stepIndex = stepIndicators.findIndex(s => s.step === step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const goToStep = (step: WorkflowStep) => {
    // Allow navigation to previous steps
    const currentIndex = stepIndicators.findIndex(s => s.step === currentStep);
    const stepIndex = stepIndicators.findIndex(s => s.step === step);
    
    if (stepIndex <= currentIndex) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Optimization Workflow</h1>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepIndicators.map((indicator, index) => (
            <div key={indicator.step} className="flex items-center">
              <div
                className={`relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all ${
                  getStepStatus(indicator.step as WorkflowStep) === 'completed'
                    ? 'bg-green-500 text-white'
                    : getStepStatus(indicator.step as WorkflowStep) === 'current'
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => goToStep(indicator.step as WorkflowStep)}
              >
                {getStepStatus(indicator.step as WorkflowStep) === 'completed' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xl">{indicator.icon}</span>
                )}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  {indicator.label}
                </div>
              </div>
              
              {index < stepIndicators.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  getStepStatus(stepIndicators[index + 1].step as WorkflowStep) === 'completed' || 
                  getStepStatus(stepIndicators[index + 1].step as WorkflowStep) === 'current'
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {currentStep === 'upload' && (
          <div>
            <ResumeUpload 
              onUploadComplete={handleResumeUpload}
              onError={setError}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}
          </div>
        )}

        {currentStep === 'analysis' && resumeData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold mb-4">Resume Analysis Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>File:</span>
                  <span className="font-medium">{resumeData.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span>ATS Score:</span>
                  <span className={`font-bold ${
                    resumeData.atsScore >= 80 ? 'text-green-600' : 
                    resumeData.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {resumeData.atsScore}%
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {resumeData.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold mb-4">Job Description (Optional)</h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for better template matching..."
                className="w-full h-32 p-3 border rounded-lg resize-none"
              />
              <button
                onClick={handleAnalysisComplete}
                className="mt-4 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue to Template Selection
              </button>
            </div>
          </div>
        )}

        {currentStep === 'templates' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Select Your Template</h2>
              <p className="text-gray-600">Choose a template optimized for your ATS score and job requirements</p>
            </div>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              jobDescription={jobDescription}
            />
          </div>
        )}

        {currentStep === 'generation' && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Generating Your Document</h2>
            <p className="text-gray-600">Applying template "{selectedTemplate?.name}" to your resume...</p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 max-w-md mx-auto">
                {error}
                <button 
                  onClick={() => setCurrentStep('templates')}
                  className="ml-2 text-blue-600 underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'preview' && generatedContent && selectedTemplate && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Document Preview</h2>
              <p className="text-gray-600">Review your optimized document and export when ready</p>
            </div>
            <DocumentPreview 
              documentContent={generatedContent}
              templateName={selectedTemplate.name}
            />
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setCurrentStep('templates')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Try Different Template
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Export as PDF
              </button>
            </div>
          </div>
        )}

        {currentStep === 'export' && (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Export Complete!</h2>
            <p className="text-gray-600 mb-6">Your optimized resume has been prepared for download.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentStep('preview')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Preview
              </button>
              <button
                onClick={() => {
                  setCurrentStep('upload');
                  setResumeData(null);
                  setSelectedTemplate(null);
                  setGeneratedContent('');
                  setJobDescription('');
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Start New Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowManager;