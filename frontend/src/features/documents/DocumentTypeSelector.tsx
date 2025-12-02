/**
 * ELECTRIC ALCHEMIST: DOCUMENT TYPE SELECTOR COMPONENT
 *
 * Document type selector using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Card, Button } from '@/components';

export interface DocumentTypeSelectorProps {
  onSelect: (type: 'resume' | 'cover-letter' | 'selection-criteria') => void;
  onBack: () => void;
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  onSelect,
  onBack,
}) => {
  const documentTypes = [
    {
      id: 'resume',
      label: 'Resume',
      description: 'Create a tailored resume for the job',
    },
    {
      id: 'cover-letter',
      label: 'Cover Letter',
      description: 'Write a compelling cover letter',
    },
    {
      id: 'selection-criteria',
      label: 'Selection Criteria',
      description: 'Address selection criteria',
    },
  ];

  return (
    <div className="min-h-screen bg-surface py-8 flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-hero text-2xl font-semibold mb-2">
            What would you like to create?
          </h1>
          <p className="text-human text-base text-on-surface-variant">
            Select the type of document you want to generate for this opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {documentTypes.map((type) => (
            <Card
              key={type.id}
              variant="interactive"
              className="cursor-pointer h-full text-center"
              onClick={() =>
                onSelect(type.id as 'resume' | 'cover-letter' | 'selection-criteria')
              }
            >
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-container/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-hero text-lg font-semibold mb-2">{type.label}</h3>
                <p className="text-human text-sm text-on-surface-variant">
                  {type.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-start">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentTypeSelector;

