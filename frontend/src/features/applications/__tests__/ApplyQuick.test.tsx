import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';

const mockNavigate = jest.fn();
const mockQuickApply = jest.fn() as jest.MockedFunction<(...args: any[]) => any>;

// ESM-compatible mocks — all must precede dynamic imports
(jest as any).unstable_mockModule('@/api/workflowService', () => ({
  workflowService: {
    quickApply: mockQuickApply,
  },
}));

(jest as any).unstable_mockModule('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

(jest as any).unstable_mockModule('lucide-react', () => {
  const cache = new Map<string, any>();
  return new Proxy(
    {},
    {
      get: (_t, prop) => {
        if (typeof prop !== 'string') return undefined;
        if (!cache.has(prop)) {
          const Icon = ({ className }: any) =>
            React.createElement('span', { 'data-testid': `icon-${prop.toLowerCase()}`, className });
          cache.set(prop, Icon);
        }
        return cache.get(prop);
      },
    }
  );
});

const { ApplyQuick } = (await import('../ApplyQuick')) as any;

const mockResult: AnalyzeJobFromUrlResponse = {
  job_title: 'Case Management Lead',
  company_name: 'Worker Centre',
  normalized_job_description: 'Coordinate applications and services.',
  ats_preview: {
    score: 92,
    matched_keywords: ['case management'],
    missing_keywords: ['community engagement'],
  },
  chunk_matches: [
    {
      chunk_id: 'chunk-1',
      label: 'Applications workflow',
      score: 0.82,
      matched_terms: ['case management'],
      snippet: 'Led end-to-end applications workflows.',
    },
  ],
  artifacts: {
    tailored_resume: 'resume content',
    cover_letter: 'cover letter content',
    ksc_response: 'ksc content',
  },
  export_pack: {},
};

function renderPage() {
  const Page = ApplyQuick as React.ComponentType;
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>
  );
}

describe('ApplyQuick', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    mockQuickApply.mockResolvedValue(mockResult);
  });

  it('renders the entry form and keeps analyze disabled until input exists', () => {
    renderPage();

    expect(screen.getByText('Target')).toBeInTheDocument();
    expect(screen.getByText('Job')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How It Works' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Job URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Description/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Start My Application/i });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: 'Support clients with application workflows.' },
    });

    expect(submitBtn).toBeEnabled();
  });

  it('submits job analysis and renders the results panel', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/Job Description/i), {
      target: { value: 'Coordinate applications and service delivery.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Start My Application/i }));

    await waitFor(() => {
      expect(mockQuickApply).toHaveBeenCalledWith({
        jobDescription: 'Coordinate applications and service delivery.',
        jobUrl: undefined,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('92')).toBeInTheDocument();
      expect(screen.getByText('Case Management Lead')).toBeInTheDocument();
      expect(screen.getByText('Worker Centre')).toBeInTheDocument();
    });
  });

  it('shows an error message when analysis fails', async () => {
    mockQuickApply.mockRejectedValue(new Error('API Malfunction'));

    renderPage();

    fireEvent.change(screen.getByLabelText(/Job URL/i), {
      target: { value: 'https://worker-centre.example/jobs/123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Start My Application/i }));

    await waitFor(() => {
      expect(screen.getByText(/API Malfunction/i)).toBeInTheDocument();
    });
  });

  it('toggles the step guide visibility', () => {
    renderPage();

    expect(screen.queryByText(/identify critical skill gaps instantly/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/How It Works/i));
    expect(screen.getByText(/identify critical skill gaps instantly/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Hide Guide/i));
    expect(screen.queryByText(/identify critical skill gaps instantly/i)).not.toBeInTheDocument();
  });
});
