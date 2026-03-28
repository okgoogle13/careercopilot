import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnalysisPage } from '../AnalysisPage';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { analysisService } from '@/api/analysisService';

global.fetch = jest.fn();

jest.mock('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));
jest.mock('@/features/ingestion/components/EvidenceUploader', () => ({
  EvidenceUploader: () => <div data-testid="evidence-uploader" />,
}));

jest.mock('lucide-react', () => {
  const original = jest.requireActual('lucide-react');
  return {
    ...original,
    Compass: () => <div data-testid="icon-compass" />,
    Target: () => <div data-testid="icon-target" />,
    Building: () => <div data-testid="icon-building" />,
    Sparkles: () => <div data-testid="icon-sparkles" />,
    Copy: () => <div data-testid="icon-copy" />,
    Building2: () => <div data-testid="icon-building-2" />,
    Gauge: () => <div data-testid="icon-gauge" />,
    Loader2: () => <div data-testid="icon-loader" />,
    UploadCloud: () => <div data-testid="icon-upload" />,
    FileText: () => <div data-testid="icon-file-text" />,
  };
});

jest.mock('@/design/hero/heroRegistry', () => ({
  loadHeroRegistry: jest.fn().mockResolvedValue({}),
}));

jest.mock('@/lib/composeHero', () => ({
  composeHero: jest.fn().mockReturnValue({
    valid: true,
    resolvedLayers: [],
    typography: {},
    animation: {},
    zIndexMap: {},
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AnalysisPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('manifest.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ layers: [], typography: {} }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });

    jest.spyOn(analysisService, 'getATSScore').mockResolvedValue({
      overallScore: 85,
      categories: [{ name: 'Formatting', score: 90, status: 'Good', suggestions: [] }],
      matched_keywords: ['Python'],
      missing_keywords: ['React'],
    });
    jest.spyOn(analysisService, 'getStrategy').mockResolvedValue({
      corporate_profile: { name: 'Community First' },
      strategy_summary: 'Refocus the resume on client advocacy outcomes.',
      optimized_resume: { resume_text: 'Optimized resume text' },
      job_details: {
        role_title: 'Support Worker',
        key_responsibilities: ['Deliver case notes', 'Support community outreach'],
      },
    });
  });

  it('renders the page header and tactical inputs', () => {
    renderWithRouter(<AnalysisPage />);
    expect(screen.getByText(/ATS Analyzer/i)).toBeInTheDocument();
    expect(screen.getByText(/Application Inputs/i)).toBeInTheDocument();
  });

  it('handles input changes for Job URL and Resume Text', () => {
    renderWithRouter(<AnalysisPage />);

    const jobUrlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
    const resumeTextInput = screen.getByPlaceholderText(/Paste your current resume text here/i);

    fireEvent.change(jobUrlInput, { target: { value: 'https://seek.com.au/job/123' } });
    fireEvent.change(resumeTextInput, { target: { value: 'My resume content' } });

    expect(jobUrlInput).toHaveValue('https://seek.com.au/job/123');
    expect(resumeTextInput).toHaveValue('My resume content');
  });

  it('triggers ATS analysis when Calibration Check is clicked', async () => {
    renderWithRouter(<AnalysisPage />);

    const jobUrlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
    const resumeTextInput = screen.getByPlaceholderText(/Paste your current resume text here/i);

    fireEvent.change(resumeTextInput, { target: { value: 'My Resume' } });
    fireEvent.change(jobUrlInput, { target: { value: 'https://seek.com.au/job/123' } });

    fireEvent.click(screen.getByRole('button', { name: /Synthesize Strategy/i }));

    await waitFor(() => {
      expect(analysisService.getStrategy).toHaveBeenCalled();
    });

    const analyzeBtn = screen.getByRole('button', { name: /Calibration Check/i });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(analysisService.getATSScore).toHaveBeenCalled();
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });

  it('mounts salvaged AI output tabs on the canonical analysis page after strategy generation', async () => {
    renderWithRouter(<AnalysisPage />);

    fireEvent.change(screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i), {
      target: { value: 'https://seek.com.au/job/123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Paste your current resume text here/i), {
      target: { value: 'My resume content' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Synthesize Strategy/i }));

    await waitFor(() => {
      expect(analysisService.getStrategy).toHaveBeenCalled();
      expect(screen.getByText(/Key Selection Criteria/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Deliver case notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Support community outreach/i)).toBeInTheDocument();
  });
});
