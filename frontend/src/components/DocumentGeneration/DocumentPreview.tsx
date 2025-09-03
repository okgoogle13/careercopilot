import React, { useState } from 'react';
import './DocumentPreview.css';

interface DocumentPreviewProps {
  documentContent: string;
  templateName?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentContent,
  templateName,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleDownload = async (format: string) => {
    setShowExportOptions(false);

    try {
      if (format === 'pdf') {
        await downloadAsPDF();
      } else if (format === 'docx') {
        await downloadAsWord();
      } else if (format === 'txt') {
        await downloadAsText();
      }
    } catch {
      alert(`Failed to export as ${format}. Please try again.`);
    }
  };

  const downloadAsPDF = async () => {
    try {
      // Method 1: Use browser's print functionality for PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error('Popup blocked');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${templateName || 'Document'}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${documentContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch {
      // Fallback: Create downloadable HTML
      downloadAsHTML();
    }
  };

  const downloadAsWord = async () => {
    // Create a Word-compatible HTML document
    const wordContent = `
      <!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
        <head>
          <meta charset="utf-8">
          <title>${templateName || 'Document'}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 1in; }
            h1, h2, h3 { color: #2c3e50; }
            p { margin-bottom: 12pt; }
          </style>
        </head>
        <body>
          ${documentContent}
        </body>
      </html>
    `;

    const blob = new Blob([wordContent], { type: 'application/msword' });
    downloadBlob(blob, `${templateName || 'document'}.doc`);
  };

  const downloadAsText = async () => {
    // Strip HTML tags and create plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = documentContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    const blob = new Blob([textContent], { type: 'text/plain' });
    downloadBlob(blob, `${templateName || 'document'}.txt`);
  };

  const downloadAsHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${templateName || 'Document'}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 40px;
              line-height: 1.6;
              background: white;
            }
            @media print {
              body { padding: 0; margin: 0; }
            }
          </style>
        </head>
        <body>
          ${documentContent}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadBlob(blob, `${templateName || 'document'}.html`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`document-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Preview{templateName && `: ${templateName}`}
          </h2>

          <div className="flex items-center gap-2">
            {/* Export Options */}
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                Export ↓
              </button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-100"
                  >
                    📄 Download as PDF
                  </button>
                  <button
                    onClick={() => handleDownload('docx')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-100"
                  >
                    📝 Download as Word
                  </button>
                  <button
                    onClick={() => handleDownload('txt')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    📃 Download as Text
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              🖨️ Print
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
            >
              {isFullscreen ? '📉 Exit' : '📈 Fullscreen'}
            </button>
          </div>
        </div>
      </div>

      <div className="preview-content-wrapper">
        <div className="preview-paper">
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: documentContent }}
          />
        </div>
      </div>

      {/* Document Stats */}
      <div className="preview-stats">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Ready to export</span>
          <span>ATS-optimized format</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
