import React from 'react';
import './DocumentPreview.css';

interface DocumentPreviewProps {
  documentContent: string; // Assuming the document is passed as an HTML string
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentContent }) => {
  return (
    <div className="document-preview">
      <h2>Document Preview</h2>
      <div className="preview-content" dangerouslySetInnerHTML={{ __html: documentContent }} />
    </div>
  );
};

export default DocumentPreview;
