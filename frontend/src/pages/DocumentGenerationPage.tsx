import React from 'react';
import TemplateSelector, { Template } from '../components/DocumentGeneration/TemplateSelector';
import DocumentPreview from '../components/DocumentGeneration/DocumentPreview';
import ATSAnalysisCard from '../components/ATSAnalysis/ATSAnalysisCard';

const DocumentGenerationPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [documentContent, setDocumentContent] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = React.useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = React.useState<boolean>(false);
  const [jobDescription, setJobDescription] = React.useState<string>(
    'Software Engineer position requiring React, TypeScript, and Node.js experience.'
  );

  const handleSelectTemplate = async (template: Template) => {
    setSelectedTemplate(template);
    setIsGenerating(true);
    setGenerationStatus('Contacting backend...');

    try {
      // Make API call to backend to select template
      const response = await fetch('http://127.0.0.1:8000/api/v1/templates/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          userData: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          jobDescription: jobDescription || 'Software Engineer position',
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Template selection response:', result);
      setGenerationStatus(`${result.message} - ${result.status}`);

      // Fetch document preview
      setGenerationStatus('Generating preview...');
      const previewResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/documents/preview/${template.id}`
      );

      if (!previewResponse.ok) {
        throw new Error(`Preview failed: ${previewResponse.status}`);
      }

      const previewData = await previewResponse.json();
      setDocumentContent(previewData.previewHtml);
      setGenerationStatus('✅ Document generated successfully!');
    } catch (error) {
      console.error('❌ Template selection failed:', error);
      setGenerationStatus(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      setDocumentContent(`<div style="color: red; padding: 20px;">
        <h3>Error generating document</h3>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <p>Please try again or select a different template.</p>
      </div>`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNavigateToTemplates = () => {
    setShowTemplateSelector(true);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Document Generation</h1>

      {!showTemplateSelector ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Job Description Input */}
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
            <h3 className='text-lg font-semibold mb-4'>Job Description</h3>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder='Paste the job description here for ATS optimization...'
              className='w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={() => setShowTemplateSelector(true)}
              className='mt-3 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
            >
              Skip to Templates
            </button>
          </div>

          {/* ATS Analysis */}
          <ATSAnalysisCard
            jobDescription={jobDescription}
            onNavigateToTemplates={handleNavigateToTemplates}
          />
        </div>
      ) : (
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <button
              onClick={() => setShowTemplateSelector(false)}
              className='flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back to Analysis
            </button>
            <h2 className='text-xl font-semibold'>Select Your Template</h2>
          </div>

          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleSelectTemplate}
            jobDescription={jobDescription}
          />
        </div>
      )}

      {/* Generation Status */}
      {(isGenerating || generationStatus) && (
        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='flex items-center gap-3'>
            {isGenerating && (
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent'></div>
            )}
            <span
              className={`font-medium ${generationStatus.includes('❌') ? 'text-red-600' : generationStatus.includes('✅') ? 'text-green-600' : 'text-blue-600'}`}
            >
              {generationStatus}
            </span>
          </div>
        </div>
      )}

      {/* Document Preview */}
      {selectedTemplate && documentContent && (
        <div className='mt-6'>
          <DocumentPreview documentContent={documentContent} templateName={selectedTemplate.name} />
        </div>
      )}
    </div>
  );
};

export default DocumentGenerationPage;
