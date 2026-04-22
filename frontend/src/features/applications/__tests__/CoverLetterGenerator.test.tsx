import React from 'react';
import { render, screen } from '@testing-library/react';
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
  ArrowLeft: () => <span data-testid="icon-arrow-left" />,
  ArrowRight: () => <span data-testid="icon-arrow-right" />,
  Building: () => <span data-testid="icon-building" />,
  CheckCircle2: () => <span data-testid="icon-check-circle" />,
  Copy: () => <span data-testid="icon-copy" />,
  Download: () => <span data-testid="icon-download" />,
  FileText: () => <span data-testid="icon-file-text" />,
  RefreshCw: () => <span data-testid="icon-refresh" />,
  Settings: () => <span data-testid="icon-settings" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
}));

(jest as any).unstable_mockModule('@careercopilot/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

(jest as any).unstable_mockModule('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

(jest as any).unstable_mockModule('@/services/api', () => ({
  api: {
    getUserProfile: jest.fn(),
  },
}));

(jest as any).unstable_mockModule('@/services/genkit', () => ({
  genkitApi: {
    analyzeJobFromUrl: jest.fn(),
    generateCoverLetter: jest.fn(),
  },
}));

(jest as any).unstable_mockModule('@/utils/exportEngine', () => ({
  exportToPdf: jest.fn(),
}));

(jest as any).unstable_mockModule('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: jest.fn(),
  }),
}));

(jest as any).unstable_mockModule('file-saver', () => ({
  saveAs: jest.fn(),
  default: { saveAs: jest.fn() },
}));

(jest as any).unstable_mockModule('@/features/documents/services/docxExport', () => ({
  exportDocumentAsDocx: jest.fn(),
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
    <section data-testid="application-finalization">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { CoverLetterGenerator } = await import('../CoverLetterGenerator');

describe('CoverLetterGenerator', () => {
  it('renders inside the ApplicationFinalization shell with the first step content', () => {
    render(
      <BrowserRouter>
        <CoverLetterGenerator />
      </BrowserRouter>
    );

    expect(screen.getByTestId('application-finalization')).toBeInTheDocument();
    expect(screen.getByText('Cover Letter Builder')).toBeInTheDocument();
    expect(
      screen.getByText(/Craft an application cover letter tailored to the job you want/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Job Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
  });
});
