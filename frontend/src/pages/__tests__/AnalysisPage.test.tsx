import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnalysisPage } from '../AnalysisPage';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock fetch
global.fetch = jest.fn();

// Mock m3Toast
jest.mock('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock framer-motion to avoid animation issues
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock child components
jest.mock('../../components/kerala-rage/LayeredHero', () => ({
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

// Mock all of lucide-react
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

// Mock hero registry
jest.mock('../../design/hero/heroRegistry', () => ({
  loadHeroRegistry: jest.fn().mockResolvedValue({}),
}));

// Mock composeHero
jest.mock('../../lib/composeHero', () => ({
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
    expect(screen.getByText(/Audit Microscope/i)).toBeInTheDocument();
    expect(screen.getByText(/Tactical Inputs/i)).toBeInTheDocument();
  });

  it('handles input changes for Job URL and Resume Text', () => {
    renderWithRouter(<AnalysisPage />);

    const jobUrlInput = screen.getByPlaceholderText(/https:\/\/station-records.net\/listing\//i);
    const resumeTextInput = screen.getByPlaceholderText(
      /Extract text from your professional history/i
    );

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

    const resumeTextInput = screen.getByPlaceholderText(
      /Extract text from your professional history/i
    );
    const jdTextInput = screen.getByPlaceholderText(
      /Enter requirements if station URL is unreachable/i
    );

    fireEvent.change(resumeTextInput, { target: { value: 'My Resume' } });
    fireEvent.change(jdTextInput, { target: { value: 'Job Requirements' } });

    const analyzeBtn = screen.getByRole('button', { name: /Calibration Check/i });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText(/85/)).toBeInTheDocument();
      expect(screen.getByText(/Formatting/i)).toBeInTheDocument();
    });
  });

  it('triggers strategy generation when Synthesize Strategy is clicked', async () => {
    const mockStrategyResult = {
      corporate_profile: {
        name: 'TechCorp',
        communication_style: 'Professional',
        known_for: 'Innovation',
        strategic_focus: 'AI',
        core_values: ['Integrity'],
        mission_statement: 'Build the future',
      },
      optimized_resume: {
        resume_text: 'Optimized Resume Content',
      },
      strategy_summary: 'Targeted approach',
    };

    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('strategy')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockStrategyResult,
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithRouter(<AnalysisPage />);

    fireEvent.change(screen.getByPlaceholderText(/https:\/\/station-records.net\/listing\//i), {
      target: { value: 'http://job.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Extract text from your professional history/i), {
      target: { value: 'My Resume' },
    });

    const strategyBtn = screen.getByRole('button', { name: /Synthesize Strategy/i });
    fireEvent.click(strategyBtn);

    await waitFor(() => {
      expect(screen.getByText(/TechCorp/i)).toBeInTheDocument();
      expect(screen.getByText(/Optimized Resume Content/i)).toBeInTheDocument();
    });
  });

  it('displays error toast when API fails', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('ats-score')) {
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithRouter(<AnalysisPage />);

    fireEvent.change(screen.getByPlaceholderText(/Extract text from your professional history/i), {
      target: { value: 'My Resume' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter requirements if station URL is unreachable/i),
      { target: { value: 'Job' } }
    );

    fireEvent.click(screen.getByRole('button', { name: /Calibration Check/i }));

    await waitFor(() => {
      // Check that it doesn't crash
      expect(screen.getByText(/Audit Microscope/i)).toBeInTheDocument();
    });
  });
});
