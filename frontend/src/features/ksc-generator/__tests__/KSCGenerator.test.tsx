import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// All unstable_mockModule calls must precede dynamic imports

const mockApi = {
  getKSCDraft: jest.fn() as jest.MockedFunction<(...args: any[]) => any>,
  saveKSCDraft: jest.fn() as jest.MockedFunction<(...args: any[]) => any>,
  generateKSC: jest.fn() as jest.MockedFunction<(...args: any[]) => any>,
  clearKSCDraft: jest.fn() as jest.MockedFunction<(...args: any[]) => any>,
  getUserProfile: jest.fn() as jest.MockedFunction<(...args: any[]) => any>,
};

(jest as any).unstable_mockModule('@/services/api', () => ({
  api: mockApi,
}));

(jest as any).unstable_mockModule('@/services/genkit', () => ({
  genkitApi: {
    generateKSCAll: jest.fn(),
    analyzeJobFromUrl: jest.fn(),
    generateKSCResponse: jest.fn(),
  },
}));

(jest as any).unstable_mockModule('@/utils/exportEngine', () => ({
  exportToPdf: jest.fn(),
}));

(jest as any).unstable_mockModule('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn(),
    track: jest.fn(),
  }),
}));

(jest as any).unstable_mockModule('sonner', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    promise: jest.fn(),
  },
}));

(jest as any).unstable_mockModule('@/features/documents/hooks/useDocumentExport', () => ({
  useDocumentExport: () => ({ exportDocx: jest.fn() }),
}));

(jest as any).unstable_mockModule('file-saver', () => ({
  saveAs: jest.fn(),
  default: { saveAs: jest.fn() },
}));

(jest as any).unstable_mockModule('@/features/documents/services/docxExport', () => ({
  exportDocumentAsDocx: jest.fn(),
}));

(jest as any).unstable_mockModule('@/design/tokens/motion-presets', () => ({
  KrDarkSpring: {},
  staggerContainer: {},
}));

(jest as any).unstable_mockModule('@/screens/08_workbench/DocumentWorkbench', () => ({
  DocumentWorkbench: ({ children, title, subtitle }: any) => (
    <div data-testid="documentworkbench">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
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

const { KSCGenerator } = (await import('../KSCGenerator')) as any;

describe('KSCGenerator', () => {
  const mockData = {
    criteria: 'Experience in React',
    star: { situation: 'Initial React response', task: '', action: '', result: '' },
    step: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.getKSCDraft.mockResolvedValue(mockData);
    mockApi.saveKSCDraft.mockResolvedValue(undefined);
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <KSCGenerator />
      </MemoryRouter>
    );

  it('renders correctly and loads data from api', async () => {
    renderPage();

    await waitFor(() => {
      expect(mockApi.getKSCDraft).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Key Selection Criteria')).toBeInTheDocument();
      expect(screen.getByText('Target Selection Criteria')).toBeInTheDocument();
    });
  });

  it('updates criterion response correctly', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Target Selection Criteria')).toBeInTheDocument();
    });

    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value: 'Successfully led React projects.' } });

    expect(textarea).toHaveValue('Successfully led React projects.');
  });
});
