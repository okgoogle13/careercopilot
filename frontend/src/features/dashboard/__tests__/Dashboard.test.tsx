import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from '../Dashboard';

// Mock the modules that might cause issues in a test environment
jest.mock('@/components/ui', () => ({
  Pebble: ({ children }: any) => <button>{children}</button>,
  StatusBadge: ({ label }: any) => <div>{label}</div>,
  Stone: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('@/components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));

jest.mock('@/design/hero/heroRegistry', () => ({
  loadHeroRegistry: jest.fn().mockResolvedValue({}),
}));

jest.mock('@/lib/composeHero', () => ({
  composeHero: jest.fn().mockReturnValue({
    valid: true,
    resolvedLayers: [],
    typography: {},
    animation: {},
    zIndexMap: {},
  }),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Dashboard Component', () => {
  it('renders the solidarity hub title', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /SOLIDARITY HUB/i })).toBeInTheDocument();
  });

  it('displays the mock profiles', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/UX Designer/i)).toBeInTheDocument();
  });

  it('renders the action buttons', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Deposit KrMotif/i)).toBeInTheDocument();
    expect(screen.getByText(/View Archive/i)).toBeInTheDocument();
  });
});
