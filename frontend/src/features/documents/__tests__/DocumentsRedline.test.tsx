import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ---------------------------------------------------------------------------
// Module-level mocks (must be before component import)
// ---------------------------------------------------------------------------

(jest as any).unstable_mockModule('@/components/shared/PageHeader', () => ({
  PageHeader: ({ title, description }: { title: string; description?: string }) => (
    <div data-testid="page-header">
      <div>{title}</div>
      {description ? <div>{description}</div> : null}
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state" />,
}));

(jest as any).unstable_mockModule('@/utils/exportEngine', () => ({
  exportToPdf: jest.fn().mockResolvedValue(undefined),
}));

(jest as any).unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: () => 'light',
}));

(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

(jest as any).unstable_mockModule('@/utils/exportEngine', () => ({
  exportToPdf: jest.fn().mockResolvedValue(undefined),
}));

(jest as any).unstable_mockModule('html2canvas', () => ({
  default: jest.fn().mockResolvedValue({ toDataURL: jest.fn(() => 'data:image/png;base64,') }),
}));

(jest as any).unstable_mockModule('jspdf', () => ({
  default: jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
    output: jest.fn(() => new Blob()),
  })),
}));

(jest as any).unstable_mockModule('file-saver', () => ({
  saveAs: jest.fn(),
  default: { saveAs: jest.fn() },
}));

(jest as any).unstable_mockModule('docx', () => ({
  Document: jest.fn(),
  HeadingLevel: {},
  Packer: { toBlob: jest.fn() },
  Paragraph: jest.fn(),
  TextRun: jest.fn(),
}));

(jest as any).unstable_mockModule('@/features/documents/services/docxExport', () => ({
  exportDocumentAsDocx: jest.fn(),
}));

(jest as any).unstable_mockModule('@/features/documents/hooks/useDocumentExport', () => ({
  useDocumentExport: () => ({ exportDocx: jest.fn() }),
}));

(jest as any).unstable_mockModule('zustand', async () => jest.requireActual('zustand'));

(jest as any).unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: jest.fn(() => 'KrDark'),
  default: jest.fn(() => 'KrDark'),
}));

(jest as any).unstable_mockModule('@/api/documentService', () => ({
  documentService: {
    uploadDocumentForRedline: jest.fn(),
    applyRedlineEdits: jest.fn(),
    exportTrackedChanges: jest.fn(),
  },
}));

const { Documents } = (await import('../Documents')) as any;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRedlineBtn(docId = 1) {
  return screen.getByTestId(`redline-btn-${docId}`);
}

function getOverlay() {
  return screen.getByTestId('redline-overlay');
}

function getFileInput() {
  return screen.getByTestId('redline-file-input') as HTMLInputElement;
}

function getEditsInput() {
  return screen.getByTestId('redline-edits-input') as HTMLTextAreaElement;
}

function makeDocxFile(name = 'test.docx') {
  return new File(['docx-content'], name, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Documents — Redline overlay', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    global.URL.revokeObjectURL = jest.fn();
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the overlay when the Redline button on a card is clicked', async () => {
    render(<Documents />);

    const btn = getRedlineBtn(1);
    await userEvent.click(btn);

    expect(getOverlay()).toBeInTheDocument();
  });

  it('renders archive-first copy in the page header', () => {
    render(<Documents />);

    expect(screen.getByRole('heading', { name: /working papers/i })).toBeInTheDocument();
    expect(
      screen.getByText(/keep your resumes, letters, and ksc drafts ready for the next push/i)
    ).toBeInTheDocument();
  });

  it('closes the overlay when the close button is clicked', async () => {
    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));
    expect(getOverlay()).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('redline-close-btn'));
    await waitFor(() => {
      expect(screen.queryByTestId('redline-overlay')).not.toBeInTheDocument();
    });
  });

  it('shows an error and does not call fetch when JSON is invalid', async () => {
    const fetchSpy = global.fetch as jest.Mock;
    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));

    const file = makeDocxFile();
    await userEvent.upload(getFileInput(), file);
    fireEvent.change(getEditsInput(), { target: { value: 'NOT VALID JSON {{{' } });

    await userEvent.click(screen.getByText('Apply Redlines'));

    expect(screen.getByTestId('redline-error')).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows TrackedChangesWorkspace after a successful submission', async () => {
    const mockBlob = new Blob(['docx'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (key: string) =>
          key === 'content-disposition' ? 'attachment; filename=redlined_test.docx' : null,
      },
    });

    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));

    const file = makeDocxFile();
    await userEvent.upload(getFileInput(), file);
    fireEvent.change(getEditsInput(), {
      target: { value: '[{"find":"old","replace":"new"}]' },
    });

    await userEvent.click(screen.getByText('Apply Redlines'));

    await waitFor(() => {
      expect(screen.getByText('Redlines Applied')).toBeInTheDocument();
    });
  });

  it('shows an error when the backend returns a 400', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => 'invalid edits format',
    });

    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));

    const file = makeDocxFile();
    await userEvent.upload(getFileInput(), file);
    fireEvent.change(getEditsInput(), {
      target: { value: '[{"find":"x","replace":"y"}]' },
    });

    await userEvent.click(screen.getByText('Apply Redlines'));

    await waitFor(() => {
      expect(screen.getByTestId('redline-error')).toBeInTheDocument();
    });
  });

  it('closes the overlay when Cancel is clicked from the upload panel', async () => {
    render(<Documents />);

    await userEvent.click(getRedlineBtn(2));
    expect(getOverlay()).toBeInTheDocument();

    await userEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByTestId('redline-overlay')).not.toBeInTheDocument();
    });
  });
});
