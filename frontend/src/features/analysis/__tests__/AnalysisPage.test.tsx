import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnalysisPage } from '../AnalysisPage';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

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
jest.mock('@/components/SkillBreakdownCard', () => ({
  SkillBreakdownCard: ({ categories, overallScore }: any) => (
    <div data-testid="skill-breakdown">
      <div data-testid="overall-score">{overallScore}</div>
      {categories.map((c: any) => (
        <div key={c.label}>
          {c.label}: {c.value}
        </div>
      ))}
    </div>
  ),
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
    const mockAtsResult = {
      overallScore: 85,
      categories: [{ name: 'Formatting', score: 90, status: 'Good', suggestions: [] }],
      matched_keywords: ['Python'],
      missing_keywords: ['React'],
    };

    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('ats-score')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockAtsResult,
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithRouter(<AnalysisPage />);

    const resumeTextInput = screen.getByPlaceholderText(/Paste your current resume text here/i);
    const jdTextInput = screen.getByLabelText(/Job URL/i);

    fireEvent.change(resumeTextInput, { target: { value: 'My Resume' } });
    fireEvent.change(jdTextInput, { target: { value: 'Job Requirements' } });

    const analyzeBtn = screen.getByRole('button', { name: /Calibration Check/i });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText(/85/)).toBeInTheDocument();
      expect(screen.getByText(/Formatting/i)).toBeInTheDocument();
    });
  });
});
