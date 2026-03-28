import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

(jest as any).unstable_mockModule('lucide-react', () => ({
  ArrowLeft: () => <span />,
  ArrowRight: () => <span />,
  Building: () => <span />,
  CheckCircle2: () => <span />,
  Copy: () => <span />,
  Download: () => <span />,
  FileText: () => <span />,
  RefreshCw: () => <span />,
  Settings: () => <span />,
  Sparkles: () => <span />,
}));

(jest as any).unstable_mockModule('@careercopilot/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

const toastSuccess = jest.fn();
(jest as any).unstable_mockModule('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: jest.fn(),
  },
}));

const getUserProfile = jest.fn().mockResolvedValue({ name: 'Nishant' });
(jest as any).unstable_mockModule('@/services/api', () => ({
  api: {
    getUserProfile: () => getUserProfile(),
  },
}));

const generateCoverLetter = jest.fn().mockResolvedValue({
  letter_content: 'Generated cover letter body',
});
(jest as any).unstable_mockModule('@/services/genkit', () => ({
  genkitApi: {
    analyzeJobFromUrl: jest.fn(),
    generateCoverLetter: (...args: unknown[]) => generateCoverLetter(...args),
  },
}));

(jest as any).unstable_mockModule('@/utils/exportEngine', () => ({
  exportToPdf: jest.fn(),
}));

const track = jest.fn();
(jest as any).unstable_mockModule('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track,
  }),
}));

const exportDocx = jest.fn().mockResolvedValue(undefined);
(jest as any).unstable_mockModule('@/features/documents/hooks/useDocumentExport', () => ({
  useDocumentExport: () => ({
    exportDocx,
  }),
}));

(jest as any).unstable_mockModule('@/screens/09_finalization/ApplicationFinalization', () => ({
  ApplicationFinalization: ({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
  }) => (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { CoverLetterGenerator } = await import('../CoverLetterGenerator');

describe('CoverLetterGenerator DOCX export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows DOCX export on the review step and delegates to the document export hook', async () => {
    render(
      <BrowserRouter>
        <CoverLetterGenerator />
      </BrowserRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText(/paste the full job description here/i),
      'Job description'
    );
    await userEvent.click(screen.getByRole('button', { name: /next step/i }));

    await userEvent.type(screen.getByPlaceholderText(/e.g. acme corp/i), 'Acme');
    await userEvent.click(screen.getByRole('button', { name: /next step/i }));

    await userEvent.click(screen.getByRole('button', { name: /generate letter/i }));

    await waitFor(() => {
      expect(screen.getByText(/your cover letter/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /download docx/i }));

    expect(exportDocx).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cover-letter',
        content: 'Generated cover letter body',
      })
    );
    expect(track).toHaveBeenCalledWith('document_exported', {
      type: 'cover_letter',
      method: 'docx',
    });
    expect(toastSuccess).toHaveBeenCalled();
  });
});
