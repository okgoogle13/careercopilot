import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

import { ATSSignalBreakdown } from '../ATSSignalBreakdown';
import { useAnalysisPipelineStore } from '@/stores/analysisPipelineStore';

describe('ATSSignalBreakdown', () => {
  const mockPipeline = {
    assetId: 'test-asset',
    atsResult: {
      overallScore: 75,
      keywordMatch: 0.8,
      semanticScore: 0.85,
      formattingScore: 0.92,
      extractionFlags: [],
      breakdown: {
        keywordDensityScore: 80,
        semanticScore: 85,
        educationExperienceScore: 70,
        formattingScore: 92,
      },
    },
    exports: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Reset store state before each test
    useAnalysisPipelineStore.setState({ pipelines: {} });
  });

  it('renders empty state when no ATS result is available', () => {
    useAnalysisPipelineStore.setState({
      pipelines: {
        'test-asset': {
          assetId: 'test-asset',
          exports: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    });

    render(<ATSSignalBreakdown assetId="test-asset" />);
    expect(screen.getByText(/no ats analysis available/i)).toBeInTheDocument();
  });

  it('renders 4 signal cards with correct labels when data available', () => {
    useAnalysisPipelineStore.setState({ pipelines: { 'test-asset': mockPipeline } });

    render(<ATSSignalBreakdown assetId="test-asset" />);

    expect(screen.getByText(/keyword density/i)).toBeInTheDocument();
    expect(screen.getByText(/semantic score/i)).toBeInTheDocument();
    expect(screen.getByText(/education.*experience/i)).toBeInTheDocument();
    expect(screen.getByText(/formatting score/i)).toBeInTheDocument();
  });

  it('displays signal scores on 0-100 scale', () => {
    useAnalysisPipelineStore.setState({ pipelines: { 'test-asset': mockPipeline } });

    render(<ATSSignalBreakdown assetId="test-asset" />);

    // Check that all scores appear
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
  });

  it('uses KR Solidarity archetype styling', () => {
    useAnalysisPipelineStore.setState({ pipelines: { 'test-asset': mockPipeline } });

    const { container } = render(<ATSSignalBreakdown assetId="test-asset" />);

    const signalCards = container.querySelectorAll('[data-archetype="placard"]');
    expect(signalCards.length).toBeGreaterThan(0);
  });

  it('displays status labels for each signal based on score ranges', () => {
    useAnalysisPipelineStore.setState({ pipelines: { 'test-asset': mockPipeline } });

    render(<ATSSignalBreakdown assetId="test-asset" />);

    // Scores 80+ should show "excellent", 60-80 "good", etc.
    const excellentLabels = screen.getAllByText('excellent');
    const goodLabels = screen.getAllByText('good');

    // 80, 85, 92 are excellent (>=80); 70 is good (60-80)
    expect(excellentLabels.length).toBe(3);
    expect(goodLabels.length).toBe(1);
  });

  it('renders header with description when data available', () => {
    useAnalysisPipelineStore.setState({ pipelines: { 'test-asset': mockPipeline } });

    render(<ATSSignalBreakdown assetId="test-asset" />);

    expect(screen.getByText(/ATS Signal Breakdown/)).toBeInTheDocument();
    expect(screen.getByText(/Detailed analysis of your resume/i)).toBeInTheDocument();
  });
});
