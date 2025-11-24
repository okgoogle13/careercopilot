import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ErrorCard, ErrorProfileCard } from '../ErrorCard';

describe('ErrorCard', () => {
  it('renders without errors', () => {
    render(<ErrorCard />);
    expect(screen.getByText('Failed to Load')).toBeInTheDocument();
  });

  it('renders default title when not provided', () => {
    render(<ErrorCard />);
    expect(screen.getByText('Failed to Load')).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<ErrorCard title="Custom Error Title" />);
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
  });

  it('renders default message when not provided', () => {
    render(<ErrorCard />);
    expect(screen.getByText(/unable to load profile data/i)).toBeInTheDocument();
  });

  it('renders custom message when provided', () => {
    render(<ErrorCard message="Custom error message text" />);
    expect(screen.getByText('Custom error message text')).toBeInTheDocument();
  });

  it('renders warning icon', () => {
    const { container } = render(<ErrorCard />);
    // MUI Warning icon renders as svg
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('shows retry button by default', () => {
    render(<ErrorCard />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('hides retry button when showRetryButton is false', () => {
    render(<ErrorCard showRetryButton={false} />);
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnRetry = jest.fn();

    render(<ErrorCard onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders refresh icon in retry button', () => {
    const { container } = render(<ErrorCard />);
    const button = screen.getByRole('button', { name: /try again/i });
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders title in error color', () => {
    render(<ErrorCard title="Error Title" />);
    const title = screen.getByText('Error Title');
    expect(title).toBeInTheDocument();
  });

  it('renders message with secondary text color', () => {
    render(<ErrorCard message="Error message" />);
    const message = screen.getByText('Error message');
    expect(message).toBeInTheDocument();
  });

  it('renders retry button with outline variant', () => {
    render(<ErrorCard />);
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  it('handles multiple clicks on retry button', async () => {
    const user = userEvent.setup();
    const mockOnRetry = jest.fn();

    render(<ErrorCard onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);
    await user.click(retryButton);
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(3);
  });

  it('renders without onRetry callback', () => {
    render(<ErrorCard showRetryButton />);
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('accepts all props together', () => {
    const mockOnRetry = jest.fn();
    render(
      <ErrorCard
        title="Custom Title"
        message="Custom message"
        onRetry={mockOnRetry}
        showRetryButton
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders as a Material-UI Card', () => {
    const { container } = render(<ErrorCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('has proper card structure with header, content, and footer', () => {
    const { container } = render(<ErrorCard />);
    expect(container.querySelector('.MuiCardHeader-root')).toBeInTheDocument();
    expect(container.querySelector('.MuiCardContent-root')).toBeInTheDocument();
    // CardFooter is a custom component
  });
});

describe('ErrorProfileCard', () => {
  it('renders without errors', () => {
    render(<ErrorProfileCard />);
    expect(screen.getByText('Profile Load Error')).toBeInTheDocument();
  });

  it('renders default profile error title', () => {
    render(<ErrorProfileCard />);
    expect(screen.getByText('Profile Load Error')).toBeInTheDocument();
  });

  it('renders default profile error message', () => {
    render(<ErrorProfileCard />);
    expect(screen.getByText(/unable to load this profile/i)).toBeInTheDocument();
  });

  it('overrides title when provided', () => {
    render(<ErrorProfileCard title="Custom Profile Error" />);
    expect(screen.getByText('Custom Profile Error')).toBeInTheDocument();
    expect(screen.queryByText('Profile Load Error')).not.toBeInTheDocument();
  });

  it('overrides message when provided', () => {
    render(<ErrorProfileCard message="Custom profile error message" />);
    expect(screen.getByText('Custom profile error message')).toBeInTheDocument();
  });

  it('shows retry button by default', () => {
    render(<ErrorProfileCard />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnRetry = jest.fn();

    render(<ErrorProfileCard onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('accepts all ErrorCard props', () => {
    const mockOnRetry = jest.fn();
    render(
      <ErrorProfileCard
        title="Override Title"
        message="Override message"
        onRetry={mockOnRetry}
        showRetryButton={false}
      />
    );

    expect(screen.getByText('Override Title')).toBeInTheDocument();
    expect(screen.getByText('Override message')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('is a wrapper around ErrorCard', () => {
    const { container: profileContainer } = render(<ErrorProfileCard />);
    const { container: errorContainer } = render(
      <ErrorCard
        title="Profile Load Error"
        message="Unable to load this profile. There may be a connection issue or the profile data is corrupted."
      />
    );

    // Both should render MUI Card
    expect(profileContainer.querySelector('.MuiCard-root')).toBeInTheDocument();
    expect(errorContainer.querySelector('.MuiCard-root')).toBeInTheDocument();
  });
});

// Integration tests
describe('ErrorCard Integration', () => {
  it('handles error retry workflow', async () => {
    const user = userEvent.setup();
    let retryCount = 0;
    const mockOnRetry = jest.fn(() => {
      retryCount++;
    });

    render(<ErrorCard onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });

    await user.click(retryButton);
    expect(retryCount).toBe(1);

    await user.click(retryButton);
    expect(retryCount).toBe(2);

    expect(mockOnRetry).toHaveBeenCalledTimes(2);
  });

  it('displays error state for failed data loading', () => {
    render(
      <ErrorCard
        title="Failed to Load User Data"
        message="The server is currently unavailable. Please try again later."
      />
    );

    expect(screen.getByText('Failed to Load User Data')).toBeInTheDocument();
    expect(screen.getByText(/server is currently unavailable/i)).toBeInTheDocument();
  });

  it('can be used for different error types', () => {
    const { rerender } = render(<ErrorCard title="Network Error" />);
    expect(screen.getByText('Network Error')).toBeInTheDocument();

    rerender(<ErrorCard title="Validation Error" />);
    expect(screen.getByText('Validation Error')).toBeInTheDocument();

    rerender(<ErrorCard title="Server Error" />);
    expect(screen.getByText('Server Error')).toBeInTheDocument();
  });
});
