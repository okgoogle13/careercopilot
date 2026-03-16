import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
  CheckCircle2: () => <span data-testid="icon-check-circle" />,
  Copy: () => <span data-testid="icon-copy" />,
  Download: () => <span data-testid="icon-download" />,
  RefreshCw: () => <span data-testid="icon-refresh" />,
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
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
  },
}));

const getKSCDraft = jest.fn().mockResolvedValue(null);
const saveKSCDraft = jest.fn().mockResolvedValue(undefined);
const clearKSCDraft = jest.fn().mockResolvedValue(undefined);
const getUserProfile = jest.fn().mockResolvedValue({});

(jest as any).unstable_mockModule('@/services/api', () => ({
  api: {
    getKSCDraft: () => getKSCDraft(),
    saveKSCDraft: (...args: unknown[]) => saveKSCDraft(...args),
    clearKSCDraft: () => clearKSCDraft(),
    getUserProfile: () => getUserProfile(),
  },
}));

(jest as any).unstable_mockModule('@/services/genkit', () => ({
  genkitApi: {
    analyzeJobFromUrl: jest.fn(),
    generateKSCResponse: jest.fn(),
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

(jest as any).unstable_mockModule('@/screens/08_workbench/DocumentWorkbench', () => ({
  DocumentWorkbench: ({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
  }) => (
    <section data-testid="document-workbench">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { KSCGenerator } = await import('../KSCGenerator');

describe('KSCGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inside the DocumentWorkbench shell with the step-one content', async () => {
    render(
      <BrowserRouter>
        <KSCGenerator />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('document-workbench')).toBeInTheDocument();
    });

    expect(screen.getByText('Key Selection Criteria')).toBeInTheDocument();
    expect(
      screen.getByText(/Draft structured KSC responses using the STAR method/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Target Selection Criteria/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 3/i)).toBeInTheDocument();
  });
});
