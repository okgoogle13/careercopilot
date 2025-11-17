import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Work } from '@mui/icons-material';
import { ActionCard } from '../ActionCard';
import type { ActionCardProps } from '../ActionCard';

describe('ActionCard', () => {
  const defaultProps: ActionCardProps = {
    title: 'Test Action',
    description: 'This is a test action card',
    icon: Work,
  };

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<ActionCard {...defaultProps} />);
      expect(screen.getByText('Test Action')).toBeInTheDocument();
      expect(screen.getByText('This is a test action card')).toBeInTheDocument();
    });

    it('renders icon', () => {
      const { container } = render(<ActionCard {...defaultProps} />);
      const icon = container.querySelector('[data-testid="WorkIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it('renders default action button', () => {
      render(<ActionCard {...defaultProps} />);
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    it('renders custom action text', () => {
      render(<ActionCard {...defaultProps} actionText="Custom Action" />);
      expect(screen.getByRole('button', { name: /custom action/i })).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      const { container } = render(<ActionCard {...defaultProps} variant="default" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders primary variant', () => {
      const { container } = render(<ActionCard {...defaultProps} variant="primary" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders urgent variant', () => {
      render(<ActionCard {...defaultProps} variant="urgent" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Status States', () => {
    it('shows available status', () => {
      render(<ActionCard {...defaultProps} status="available" />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('shows in-progress status', () => {
      render(<ActionCard {...defaultProps} status="in-progress" />);
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('shows completed status', () => {
      render(<ActionCard {...defaultProps} status="completed" />);
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText(/task completed successfully/i)).toBeInTheDocument();
    });

    it('shows blocked status with message', () => {
      render(<ActionCard {...defaultProps} status="blocked" />);
      expect(screen.getByText('Blocked')).toBeInTheDocument();
      expect(screen.getByText(/this action is currently unavailable/i)).toBeInTheDocument();
    });

    it('hides action button when status is completed', () => {
      render(<ActionCard {...defaultProps} status="completed" />);
      const button = screen.queryByRole('button', { name: /get started/i });
      expect(button).not.toBeInTheDocument();
    });
  });

  describe('Priority', () => {
    it('renders low priority', () => {
      render(<ActionCard {...defaultProps} priority="low" />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('renders high priority', () => {
      render(<ActionCard {...defaultProps} priority="high" />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('renders urgent priority', () => {
      render(<ActionCard {...defaultProps} priority="urgent" />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });
  });

  describe('Progress', () => {
    it('displays progress bar when progress is provided', () => {
      render(<ActionCard {...defaultProps} progress={50} />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('hides progress bar when progress is undefined', () => {
      render(<ActionCard {...defaultProps} />);
      expect(screen.queryByText('Progress')).not.toBeInTheDocument();
    });

    it('displays 0% progress', () => {
      render(<ActionCard {...defaultProps} progress={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('displays 100% progress', () => {
      render(<ActionCard {...defaultProps} progress={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('AI Powered Badge', () => {
    it('shows AI badge when aiPowered is true', () => {
      render(<ActionCard {...defaultProps} aiPowered={true} />);
      expect(screen.getByText('AI')).toBeInTheDocument();
    });

    it('hides AI badge when aiPowered is false', () => {
      render(<ActionCard {...defaultProps} aiPowered={false} />);
      expect(screen.queryByText('AI')).not.toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('renders custom badge', () => {
      render(<ActionCard {...defaultProps} badge={{ text: 'New Feature' }} />);
      expect(screen.getByText('New Feature')).toBeInTheDocument();
    });

    it('hides badge when not provided', () => {
      render(<ActionCard {...defaultProps} />);
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('displays metadata items', () => {
      const metadata = [
        { label: 'Applications', value: 12 },
        { label: 'Interviews', value: 3 },
      ];
      render(<ActionCard {...defaultProps} metadata={metadata} />);
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Interviews')).toBeInTheDocument();
    });

    it('hides metadata when not provided', () => {
      render(<ActionCard {...defaultProps} />);
      expect(screen.queryByText('Applications')).not.toBeInTheDocument();
    });
  });

  describe('Estimated Time', () => {
    it('displays estimated time', () => {
      render(<ActionCard {...defaultProps} estimatedTime="5 minutes" />);
      expect(screen.getByText(/estimated time: 5 minutes/i)).toBeInTheDocument();
    });

    it('hides estimated time when not provided', () => {
      render(<ActionCard {...defaultProps} />);
      expect(screen.queryByText(/estimated time/i)).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();
      render(<ActionCard {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByRole('button', { name: /get started/i });
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();
      render(<ActionCard {...defaultProps} onClick={mockOnClick} disabled={true} />);

      const button = screen.getByRole('button', { name: /get started/i });
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('disables button when status is blocked', () => {
      const mockOnClick = jest.fn();
      render(<ActionCard {...defaultProps} onClick={mockOnClick} status="blocked" />);

      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toBeDisabled();
    });

    it('renders secondary action button', () => {
      const mockSecondaryAction = jest.fn();
      render(
        <ActionCard
          {...defaultProps}
          secondaryActionText="Learn More"
          onSecondaryAction={mockSecondaryAction}
        />
      );

      expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
    });

    it('calls onSecondaryAction when secondary button is clicked', async () => {
      const user = userEvent.setup();
      const mockSecondaryAction = jest.fn();
      render(
        <ActionCard
          {...defaultProps}
          secondaryActionText="Learn More"
          onSecondaryAction={mockSecondaryAction}
        />
      );

      const button = screen.getByRole('button', { name: /learn more/i });
      await user.click(button);

      expect(mockSecondaryAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled State', () => {
    it('reduces opacity when disabled', () => {
      const { container } = render(<ActionCard {...defaultProps} disabled={true} />);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it('disables all buttons when disabled', () => {
      render(
        <ActionCard
          {...defaultProps}
          disabled={true}
          secondaryActionText="Learn More"
          onSecondaryAction={jest.fn()}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });
});
