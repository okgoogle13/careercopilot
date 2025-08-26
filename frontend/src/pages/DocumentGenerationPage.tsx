import React from 'react';
import TemplateSelector from '../components/DocumentGeneration/TemplateSelector';
import DocumentPreview from '../components/DocumentGeneration/DocumentPreview';

const DocumentGenerationPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);
  const [documentContent, setDocumentContent] = React.useState<string>('');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Here you would fetch or generate the document content based on the template
    setDocumentContent(`<h3>Preview for ${templateId}</h3><p>This is a placeholder preview.</p>`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Generation</h1>
      <TemplateSelector onSelectTemplate={handleSelectTemplate} />
      {selectedTemplate && (
        <DocumentPreview documentContent={documentContent} />
      )}
    </div>
  );
};

export default DocumentGenerationPage;
