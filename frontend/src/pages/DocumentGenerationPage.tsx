import React from 'react';
import TemplateSelector, { Template } from '../components/DocumentGeneration/TemplateSelector';
import DocumentPreview from '../components/DocumentGeneration/DocumentPreview';

const DocumentGenerationPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [documentContent, setDocumentContent] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = React.useState<string>('');

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
            email: 'john.doe@example.com'
          },
          jobDescription: 'Software Engineer position'
        })
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Template selection response:', result);
      setGenerationStatus(`${result.message} - ${result.status}`);

      // Fetch document preview
      setGenerationStatus('Generating preview...');
      const previewResponse = await fetch(`http://127.0.0.1:8000/api/v1/documents/preview/${template.id}`);
      
      if (!previewResponse.ok) {
        throw new Error(`Preview failed: ${previewResponse.status}`);
      }

      const previewData = await previewResponse.json();
      setDocumentContent(previewData.previewHtml);
      setGenerationStatus('✅ Document generated successfully!');
      
    } catch (error) {
      console.error('❌ Template selection failed:', error);
      setGenerationStatus(`❌ Error: ${error.message}`);
      setDocumentContent(`<div style="color: red; padding: 20px;">
        <h3>Error generating document</h3>
        <p>${error.message}</p>
        <p>Please try again or select a different template.</p>
      </div>`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Generation</h1>
      
      <TemplateSelector 
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleSelectTemplate} 
      />
      
      {/* Generation Status */}
      {(isGenerating || generationStatus) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            {isGenerating && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            )}
            <span className={`font-medium ${generationStatus.includes('❌') ? 'text-red-600' : generationStatus.includes('✅') ? 'text-green-600' : 'text-blue-600'}`}>
              {generationStatus}
            </span>
          </div>
        </div>
      )}
      
      {/* Document Preview */}
      {selectedTemplate && documentContent && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Preview: {selectedTemplate.name}</h2>
          <DocumentPreview documentContent={documentContent} />
        </div>
      )}
    </div>
  );
};

export default DocumentGenerationPage;
