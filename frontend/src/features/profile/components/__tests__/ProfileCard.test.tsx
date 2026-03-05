import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from '../ProfileCard';

// Mock UI components
jest.mock('@careercopilot/ui', () => ({
  Avatar: ({ children, className }: any) => (
    <div
      className={className}
      data-testid="avatar"
    >
      {children}
    </div>
  ),
  AvatarFallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>,
  Badge: ({ children, style, className }: any) => (
    <div
      style={style}
      className={className}
    >
      {children}
    </div>
  ),
  Button: ({ children, onClick, style, className }: any) => (
    <button
      onClick={onClick}
      style={style}
      className={className}
    >
      {children}
    </button>
  ),
  Card: ({ children, style, className }: any) => (
    <div
      style={style}
      className={className}
    >
      {children}
    </div>
  ),
  Progress: ({ value }: any) => (
    <div
      data-testid="progress"
      aria-valuenow={value}
    />
  ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Edit: () => <div data-testid="edit-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
}));

describe('ProfileCard', () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const defaultProps = {
    id: 'p1',
    name: 'John Doe',
    role: 'Software Engineer',
    activeApplications: 5,
    atsScore: 88,
    lastUpdated: '2 hours ago',
    onEdit,
    onDelete,
  };

  it('renders profile information correctly', () => {
    render(<ProfileCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getAllByText('88%')).toHaveLength(2); // One in Badge, one in Text
    expect(screen.getByText('JD')).toBeInTheDocument(); // Initials
    expect(screen.getByText('Updated 2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Applications count
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ProfileCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ProfileCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });

  it('applies selection styling when isSelected is true', () => {
    const { container } = render(
      <ProfileCard
        {...defaultProps}
        isSelected={true}
      />
    );
    // The outermost card is the first child of the rendered output normally
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('ring-2');
    expect(card).toHaveClass('ring-primary');
    // Check background color from style
    expect(card.style.backgroundColor).toBe('var(--sys-color-primary-container)');
  });

  it('applies correct score colors', () => {
    const { rerender } = render(
      <ProfileCard
        {...defaultProps}
        atsScore={90}
      />
    );
    // There are two 90% texts, check the first one (usually the badge)
    expect(screen.getAllByText('90%')[0]).toHaveStyle({ color: 'var(--sys-color-primary)' });

    rerender(
      <ProfileCard
        {...defaultProps}
        atsScore={75}
      />
    );
    expect(screen.getAllByText('75%')[0]).toHaveStyle({ color: 'var(--sys-color-tertiary)' });

    rerender(
      <ProfileCard
        {...defaultProps}
        atsScore={50}
      />
    );
    expect(screen.getAllByText('50%')[0]).toHaveStyle({ color: 'var(--sys-color-error)' });
  });

  it('renders initials from multi-word names', () => {
    render(
      <ProfileCard
        {...defaultProps}
        name="Jane Alice Smith"
      />
    );
    expect(screen.getByText('JA')).toBeInTheDocument(); // sliced to 2 chars in implementation
  });
});
