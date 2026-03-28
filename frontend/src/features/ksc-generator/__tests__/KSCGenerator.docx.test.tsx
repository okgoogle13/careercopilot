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
  CheckCircle2: () => <span />,
  Copy: () => <span />,
  Download: () => <span />,
  RefreshCw: () => <span />,
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
    info: jest.fn(),
    success: (...args: unknown[]) => toastSuccess(...args),
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

const generateKSCResponse = jest.fn().mockResolvedValue({
  situation: 'Situation',
  task: 'Task',
  action: 'Action',
  result: 'Result',
});
(jest as any).unstable_mockModule('@/services/genkit', () => ({
  genkitApi: {
    analyzeJobFromUrl: jest.fn(),
    generateKSCResponse: (...args: unknown[]) => generateKSCResponse(...args),
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
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { KSCGenerator } = await import('../KSCGenerator');

describe('KSCGenerator DOCX export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows DOCX export on the review step and delegates to the document export hook', async () => {
    render(
      <BrowserRouter>
        <KSCGenerator />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/target selection criteria/i)).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(/demonstrated ability to lead complex projects/i),
      'Leadership criterion'
    );
    await userEvent.click(screen.getByRole('button', { name: /next step/i }));

    await userEvent.type(
      screen.getByPlaceholderText(/describe the context or challenge/i),
      'Situation'
    );
    await userEvent.type(screen.getByPlaceholderText(/what was your responsibility/i), 'Task');
    await userEvent.type(
      screen.getByPlaceholderText(/what specific steps did you take/i),
      'Action'
    );
    await userEvent.type(screen.getByPlaceholderText(/what was the outcome/i), 'Result');

    await userEvent.click(screen.getByRole('button', { name: /generate ksc/i }));

    await waitFor(() => {
      expect(screen.getByText(/generated response/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /download docx/i }));

    expect(exportDocx).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ksc',
        criterion: 'Leadership criterion',
      })
    );
    expect(track).toHaveBeenCalledWith('document_exported', { type: 'ksc', method: 'docx' });
    expect(toastSuccess).toHaveBeenCalled();
  });
});
