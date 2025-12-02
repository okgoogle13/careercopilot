/**
 * ELECTRIC ALCHEMIST: ANALYSIS VIEW
 *
 * Empty state view for analysis using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { BarChart, Upload } from 'lucide-react';
import { Container, Card, Button } from '@/components/ui';

export interface AnalysisViewProps {
  onAnalyzeDocument?: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onAnalyzeDocument }) => {
  return (
    <Container size="xl">
      <div className="py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-hero text-3xl font-semibold mb-2">ATS Analysis</h1>
            <p className="text-human text-base text-on-surface-variant">
              Get AI-powered insights on your resume's ATS compatibility
            </p>
          </div>
          <Button variant="secondary" onClick={onAnalyzeDocument} className="px-6">
            <Upload className="h-4 w-4 mr-2" />
            Analyze Document
          </Button>
        </div>
        <Card variant="default" className="p-16 text-center border-2 border-dashed border-secondary/30 bg-secondary/5">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-4">
              <BarChart className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-hero text-xl font-semibold mb-2">Ready for Analysis</h2>
            <p className="text-human text-sm text-on-surface-variant">
              Upload a document to get your ATS score.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default AnalysisView;

