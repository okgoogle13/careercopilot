import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApplyQuick } from '../ApplyQuick';
import { API_ENDPOINTS } from '@/config/api';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';

const mockNavigate = jest.fn();

global.fetch = jest.fn();

jest.mock('@careercopilot/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section {...props}>{children}</section>
    ),
  },
}));

jest.mock('lucide-react', () => ({
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      data-testid="icon-arrow"
    />
  ),
  Loader2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      data-testid="icon-loader"
    />
  ),
  Link2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      data-testid="icon-link"
    />
  ),
}));

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
    tailored_resume: 'resume',
    cover_letter: 'cover-letter',
    ksc_response: 'ksc',
  },
  export_pack: {},
};

function renderPage() {
  return render(
    <BrowserRouter>
      <ApplyQuick />
    </BrowserRouter>
  );
}

describe('ApplyQuick', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    });
  });

  it('renders the entry form and keeps analyze disabled until input exists', () => {
    renderPage();

    expect(screen.getByText(/Apply Quick/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/https:\/\/company.com\/careers\/role/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Live JD preview will appear here as you type./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze & build pack/i })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/Paste the role description/i), {
      target: { value: 'Support clients with application workflows.' },
    });

    expect(screen.getByRole('button', { name: /analyze & build pack/i })).toBeEnabled();
  });

  it('submits job analysis and renders the extracted results panel', async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/Paste the role description/i), {
      target: { value: 'Coordinate applications and service delivery.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /analyze & build pack/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        API_ENDPOINTS.generateApplication,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer dev-token',
          }),
        })
      );
    });

    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)).toEqual({
      job_description: 'Coordinate applications and service delivery.',
      url: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText('92')).toBeInTheDocument();
      expect(screen.getByText('Case Management Lead')).toBeInTheDocument();
      expect(screen.getByText('Worker Centre')).toBeInTheDocument();
      expect(screen.getByText('Applications workflow')).toBeInTheDocument();
    });
  });

  it('shows an error message when analysis fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/https:\/\/company.com\/careers\/role/i), {
      target: { value: 'https://worker-centre.example/jobs/123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /analyze & build pack/i }));

    await waitFor(() => {
      expect(screen.getByText(/Quick apply analysis failed./i)).toBeInTheDocument();
    });
  });
});
