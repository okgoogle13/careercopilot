import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mocks MUST come before IngestionPage import
jest.mock('@/hooks/useCareerIngestion', () => ({
  useCareerIngestion: jest.fn(),
}));

jest.mock('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

import { IngestionPage } from '../IngestionPage';
import { useCareerIngestion } from '@/hooks/useCareerIngestion';

const mockSubmitDocuments = jest.fn();
const mockUpdateCareerDatabase = jest.fn();

// Mock child components
jest.mock('../../components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));
jest.mock('@/components/ApplicationForm', () => ({
  ApplicationForm: ({ onUpload }: any) => (
    <div data-testid="application-form">
      <button onClick={() => onUpload(new File([''], 'resume.pdf'))}>Simulate File Select</button>
    </div>
  ),
}));
jest.mock('@/features/onboarding/components/ValidationDashboard', () => ({
  ValidationDashboard: ({ data }: any) => (
    <div data-testid="validation-dashboard">Dashboard loaded for {data?.personal_info?.name}</div>
  ),
}));

// Mock all of lucide-react
jest.mock('lucide-react', () => {
  const original = jest.requireActual('lucide-react');
  return {
    ...original,
    Microscope: () => <div data-testid="icon-microscope" />,
    CheckCircle: () => <div data-testid="icon-check" />,
    Fingerprint: () => <div data-testid="icon-fingerprint" />,
    FileText: () => <div data-testid="icon-file-text" />,
    Loader2: () => <div data-testid="icon-loader" />,
    UploadCloud: () => <div data-testid="icon-upload" />,
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

describe('IngestionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCareerIngestion as jest.Mock).mockReturnValue({
      submitDocuments: mockSubmitDocuments,
      updateCareerDatabase: mockUpdateCareerDatabase,
      isLoading: false,
      error: null,
    });
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

  it('renders the ingestion header and form', () => {
    renderWithRouter(<IngestionPage />);
    expect(screen.getByText(/Deposit Identity/i)).toBeInTheDocument();
    expect(screen.getByTestId('application-form')).toBeInTheDocument();
  });

  it('enables the archival button after file selection', () => {
    renderWithRouter(<IngestionPage />);
    const archivalBtn = screen.getByRole('button', { name: /Initialize Archival/i });
    expect(archivalBtn).toBeDisabled();

    const selectBtn = screen.getByText(/Simulate File Select/i);
    fireEvent.click(selectBtn);

    expect(archivalBtn).toBeEnabled();
  });

  it('handles successful upload and navigates to dashboard', async () => {
    const mockResult = { personal_info: { name: 'John Doe' } };
    mockSubmitDocuments.mockResolvedValue(mockResult);

    renderWithRouter(<IngestionPage />);

    // Select file
    fireEvent.click(screen.getByText(/Simulate File Select/i));

    // Click upload
    const archivalBtn = screen.getByRole('button', { name: /Initialize Archival/i });
    fireEvent.click(archivalBtn);

    await waitFor(
      () => {
        expect(screen.getByTestId('validation-dashboard')).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('handles upload failure gracefully', async () => {
    mockSubmitDocuments.mockRejectedValue(new Error('Upload failed'));

    renderWithRouter(<IngestionPage />);

    // Select file
    fireEvent.click(screen.getByText(/Simulate File Select/i));

    // Click upload
    fireEvent.click(screen.getByRole('button', { name: /Initialize Archival/i }));

    await waitFor(
      () => {
        expect(screen.queryByTestId('validation-dashboard')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Initialize Archival/i })).toBeEnabled();
      },
      { timeout: 3000 }
    );
  });
});
