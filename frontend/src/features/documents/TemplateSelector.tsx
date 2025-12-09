/**
 * ELECTRIC ALCHEMIST: TEMPLATE SELECTOR COMPONENT
 *
 * Template selector using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components';
import { Button } from '@/components/ui/button';

export interface TemplateSelectorProps {
  documentType: 'resume' | 'cover-letter' | 'selection-criteria';
  onSelectTemplate: (templateId: string, type: 'resume' | 'cover-letter') => void;
  onBack: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  documentType,
  onSelectTemplate,
  onBack,
}) => {
  const templates = [
    { id: 'modern-minimal', name: 'Modern Minimal', type: 'resume' as const },
    { id: 'executive-pro', name: 'Executive Pro', type: 'resume' as const },
    { id: 'creative-portfolio', name: 'Creative Portfolio', type: 'resume' as const },
    { id: 'ats-optimized', name: 'ATS Optimized', type: 'resume' as const },
    { id: 'cover-professional', name: 'Professional Cover', type: 'cover-letter' as const },
    { id: 'cover-modern', name: 'Modern Cover', type: 'cover-letter' as const },
  ];

  const filteredTemplates = templates.filter(
    (t) => t.type === (documentType === 'selection-criteria' ? 'resume' : documentType)
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-hero text-2xl font-semibold mb-2">Choose a Template</h1>
        <p className="text-human text-base text-on-surface-variant mb-6">
          Select a template to get started with your {documentType}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            variant="interactive"
            className="cursor-pointer h-full flex flex-col"
            onClick={() => onSelectTemplate(template.id, template.type)}
          >
            <div className="p-6 bg-surface-container rounded-lg mb-4 text-center">
              <p className="text-human text-base font-medium text-on-surface">
                {template.name}
              </p>
            </div>
            <div className="mt-auto">
              <Button
                variant="default"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id, template.type);
                }}
              >
                Select
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  );
};

export default TemplateSelector;

