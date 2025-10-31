import React from 'react';
import { BarChart3, Upload } from 'lucide-react';
import { Button } from './ui/button';

interface AnalysisViewProps {
  onAnalyzeDocument?: () => void;
}

export function AnalysisView({ onAnalyzeDocument }: AnalysisViewProps) {
  return (
    <div className="flex-1 overflow-auto" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-semibold mb-2"
              style={{ color: 'var(--on-surface)', fontSize: '2rem' }}
            >
              ATS Analysis
            </h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>
              Get AI-powered insights on your resume's ATS compatibility
            </p>
          </div>
          <Button
            onClick={onAnalyzeDocument}
            className="transition-all duration-300"
            style={{
              background: 'var(--tertiary)',
              color: 'var(--on-tertiary)',
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Analyze Document
          </Button>
        </div>

        {/* Placeholder content */}
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed"
          style={{
            borderColor: 'rgba(244, 114, 182, 0.3)',
            background: 'rgba(30, 30, 35, 0.4)',
          }}
        >
          <div
            className="p-6 rounded-full mb-4"
            style={{
              background: 'rgba(244, 114, 182, 0.1)',
            }}
          >
            <BarChart3 className="w-12 h-12" style={{ color: 'var(--tertiary)' }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--on-surface)' }}>
            Analysis View
          </h3>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            ATS analysis dashboard will be housed here
          </p>
        </div>
      </div>
    </div>
  );
}
