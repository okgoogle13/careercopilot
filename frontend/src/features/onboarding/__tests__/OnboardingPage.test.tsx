import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock path selection card
(jest as any).unstable_mockModule('@/components/PathSelectionCard', () => ({
  PathSelectionCard: ({ title, onSelect, isSelected }: any) => (
    <div
      data-testid="path-card"
      onClick={onSelect}
      style={{ border: isSelected ? '2px solid gold' : 'none' }}
    >
      {title}
    </div>
  ),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
(jest as any).unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const { OnboardingPage } = await import('../OnboardingPage');

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all domain options', () => {
    render(<OnboardingPage />);

    expect(screen.getByText('Social Work')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Government')).toBeInTheDocument();
    expect(screen.getByText('Community Services')).toBeInTheDocument();
    expect(screen.getByText('Non-Profit')).toBeInTheDocument();
    expect(screen.getByText('Mental Health')).toBeInTheDocument();
    expect(screen.getByText('Disability Services')).toBeInTheDocument();
    expect(screen.getByText('Youth Support')).toBeInTheDocument();
  });

  it('disables proceed button when no domain is selected', () => {
    render(<OnboardingPage />);
    const proceedButton = screen.getByText('Fertilize Selection');
    expect(proceedButton).toBeDisabled();
  });

  it('enables proceed button and navigates when a domain is selected', () => {
    render(<OnboardingPage />);

    const socialWorkCard = screen.getByText('Social Work');
    fireEvent.click(socialWorkCard);

    const proceedButton = screen.getByText('Fertilize Selection');
    expect(proceedButton).not.toBeDisabled();

    fireEvent.click(proceedButton);
    expect(mockNavigate).toHaveBeenCalledWith('/career/ingest');
  });

  it('shows visual feedback for selected card', () => {
    render(<OnboardingPage />);

    const cards = screen.getAllByTestId('path-card');
    fireEvent.click(cards[0]);

    expect(cards[0]).toHaveStyle('border: 2px solid gold');
    expect(cards[1]).toHaveStyle('border: none');
  });
});
