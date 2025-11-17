import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ErrorCard, ErrorProfileCard } from '../ErrorCard';

describe('ErrorCard', () => {
  const defaultProps = {
    title: 'Test Error',
    message: 'This is a test error message',
  };

  it('renders without errors with default props', () => {
    render(<ErrorCard />);
    expect(screen.getByText('Failed to Load')).toBeInTheDocument();
    expect(screen.getByText(/Unable to load profile data/)).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<ErrorCard {...defaultProps} />);
    expect(screen.getByText('Test Error')).toBeInTheDocument();
    expect(screen.getByText('This is a test error message')).toBeInTheDocument();
  });

  it('displays retry button by default', () => {
    render(<ErrorCard {...defaultProps} />);
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('hides retry button when showRetryButton is false', () => {
    render(<ErrorCard {...defaultProps} showRetryButton={false} />);
    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnRetry = jest.fn();
    render(<ErrorCard {...defaultProps} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders warning icon', () => {
    const { container } = render(<ErrorCard {...defaultProps} />);
    const warningIcon = container.querySelector('[data-testid="WarningIcon"]');
    expect(warningIcon).toBeInTheDocument();
  });

  it('applies error styling to title', () => {
    render(<ErrorCard {...defaultProps} />);
    const title = screen.getByText('Test Error');
    expect(title).toHaveClass('MuiTypography-root');
  });
});

describe('ErrorProfileCard', () => {
  it('renders with profile-specific message', () => {
    render(<ErrorProfileCard />);
    expect(screen.getByText('Profile Load Error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to load this profile/)).toBeInTheDocument();
  });

  it('allows custom props to override defaults', () => {
    const customMessage = 'Custom profile error message';
    render(<ErrorProfileCard message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('supports onRetry callback', async () => {
    const user = userEvent.setup();
    const mockOnRetry = jest.fn();
    render(<ErrorProfileCard onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});
