/**
 * ELECTRIC ALCHEMIST: RESUME BUILDER COMPONENT
 *
 * Resume builder using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, Button } from '@/components';

export interface ResumeBuilderProps {
  template: { id: string; name: string; type: 'resume' | 'cover-letter' };
  onNext: () => void;
  onBack: () => void;
  profileName?: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  template,
  onNext,
  onBack,
  profileName,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-hero text-2xl font-semibold mb-2">
          {template.name} - {template.type === 'resume' ? 'Resume' : 'Cover Letter'}
        </h1>
        <p className="text-human text-base text-on-surface-variant mb-6">
          Edit your document using the AI-powered editor.
          {profileName && ` Profile: ${profileName}`}
        </p>
      </div>

      <Card variant="default" className="p-6 mb-6">
        <p className="text-human text-sm text-on-surface-variant">
          Document editor content will be rendered here
        </p>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="default" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ResumeBuilder;

