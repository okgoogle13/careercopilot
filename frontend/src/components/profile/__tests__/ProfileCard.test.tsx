import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { ProfileCard } from '../ProfileCard';

describe('ProfileCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    name: 'John Doe',
    role: 'Software Engineer',
    activeApplications: 5,
    atsScore: 85,
    lastUpdated: '2024-01-15',
    avatarColor: '#3B82F6',
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays profile name', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays role/title', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('displays active applications count', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('Active Applications:')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('displays ATS score', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('ATS Score Average:')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('displays last updated date', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('Last Updated:')).toBeInTheDocument();
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });
  });

  describe('Avatar', () => {
    it('displays avatar with initials', () => {
      render(<ProfileCard {...defaultProps} />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('generates correct initials for full name', () => {
      render(<ProfileCard {...defaultProps} name="Sarah Jane Smith" />);
      expect(screen.getByText('SJS')).toBeInTheDocument();
    });

    it('generates initials for single name', () => {
      render(<ProfileCard {...defaultProps} name="Madonna" />);
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('applies custom avatar color', () => {
      const { container } = render(<ProfileCard {...defaultProps} avatarColor="#FF0000" />);
      const avatarFallback = container.querySelector('[style*="background-color"]');
      expect(avatarFallback).toHaveStyle({ backgroundColor: '#FF0000' });
    });
  });

  describe('User Interactions', () => {
    it('calls onEdit when edit button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileCard {...defaultProps} />);

      const editButton = screen.getAllByRole('button')[0];
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete when delete button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileCard {...defaultProps} />);

      const deleteButton = screen.getAllByRole('button')[1];
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('renders edit button with icon', () => {
      const { container } = render(<ProfileCard {...defaultProps} />);
      const editButton = screen.getAllByRole('button')[0];
      expect(editButton).toBeInTheDocument();
      expect(container.querySelector('[data-testid="EditIcon"]')).toBeInTheDocument();
    });

    it('renders delete button with icon', () => {
      const { container } = render(<ProfileCard {...defaultProps} />);
      const deleteButton = screen.getAllByRole('button')[1];
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Selected State', () => {
    it('applies selected variant when isSelected is true', () => {
      const { container } = render(<ProfileCard {...defaultProps} isSelected={true} />);
      const card = container.firstChild;
      expect(card).toHaveAttribute('variant', 'selected');
    });

    it('applies interactive variant when isSelected is false', () => {
      const { container } = render(<ProfileCard {...defaultProps} isSelected={false} />);
      const card = container.firstChild;
      expect(card).toHaveAttribute('variant', 'interactive');
    });

    it('defaults to interactive variant when isSelected not provided', () => {
      const { container } = render(<ProfileCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveAttribute('variant', 'interactive');
    });
  });

  describe('Data Display Edge Cases', () => {
    it('handles zero active applications', () => {
      render(<ProfileCard {...defaultProps} activeApplications={0} />);
      expect(screen.getByText('Active Applications:')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles 100% ATS score', () => {
      render(<ProfileCard {...defaultProps} atsScore={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('handles low ATS score', () => {
      render(<ProfileCard {...defaultProps} atsScore={30} />);
      expect(screen.getByText('30%')).toBeInTheDocument();
    });

    it('handles long names without breaking layout', () => {
      render(
        <ProfileCard
          {...defaultProps}
          name="Dr. Alexander Christopher Wellington-Smythe III"
        />
      );
      expect(
        screen.getByText('Dr. Alexander Christopher Wellington-Smythe III')
      ).toBeInTheDocument();
    });

    it('handles long role titles', () => {
      render(
        <ProfileCard
          {...defaultProps}
          role="Senior Principal Staff Software Engineering Architect"
        />
      );
      expect(
        screen.getByText('Senior Principal Staff Software Engineering Architect')
      ).toBeInTheDocument();
    });

    it('handles recent dates', () => {
      render(<ProfileCard {...defaultProps} lastUpdated="2024-12-31" />);
      expect(screen.getByText('2024-12-31')).toBeInTheDocument();
    });

    it('handles many active applications', () => {
      render(<ProfileCard {...defaultProps} activeApplications={999} />);
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible buttons', () => {
      render(<ProfileCard {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('renders all interactive elements', () => {
      render(<ProfileCard {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });
  });

  describe('Component Props', () => {
    it('renders with all required props', () => {
      const requiredProps = {
        name: 'Test User',
        role: 'Test Role',
        activeApplications: 1,
        atsScore: 50,
        lastUpdated: '2024-01-01',
        avatarColor: '#000000',
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };

      render(<ProfileCard {...requiredProps} />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('handles empty strings gracefully', () => {
      render(
        <ProfileCard
          {...defaultProps}
          name=""
          role=""
          lastUpdated=""
        />
      );
      // Component should still render without crashing
      expect(screen.getByText('Active Applications:')).toBeInTheDocument();
    });
  });
});
