/**
 * ELECTRIC ALCHEMIST: UPLOAD RESUME
 *
 * Upload resume component using Electric Alchemist Design System v4.4.
 */

import React, { useState } from 'react';
import { Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import { Container, Card, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

export const UploadResume: React.FC<UploadResumeProps> = ({ onNext, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
  };

  return (
    <div className="min-h-screen bg-surface py-8 flex items-center">
      <Container size="md">
        <div className="text-center mb-8">
          <h1 className="text-hero text-3xl font-semibold mb-2">Create Your Master Profile</h1>
          <p className="text-human text-base text-on-surface-variant">
            Upload your existing documents. We'll extract the information to build your profile.
          </p>
        </div>

        <Card variant="default" className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant hover:border-primary hover:bg-primary/2'
            )}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/20 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-hero text-lg font-semibold mb-2">Drag & Drop Your Resume</h2>
            <p className="text-human text-sm text-on-surface-variant mb-4">
              or click to browse files
            </p>
            <Button variant="outline">Upload Files</Button>
            <p className="text-data text-xs text-on-surface-variant mt-4">
              Supported formats: PDF, DOCX, TXT
            </p>
          </div>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="default" onClick={onNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default UploadResume;
