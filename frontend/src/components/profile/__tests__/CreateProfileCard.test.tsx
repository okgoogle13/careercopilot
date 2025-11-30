import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import { CreateProfileCard } from '../CreateProfileCard';

describe('CreateProfileCard', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    it('displays heading', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    it('displays description text', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(
        screen.getByText(/Build a tailored profile to optimize your resume/i)
      ).toBeInTheDocument();
    });

    it('displays create button', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByText('Create Profile')).toBeInTheDocument();
    });

    it('displays plus icon in button', () => {
      const { container } = render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(container.querySelector('[data-testid="AddIcon"]')).toBeInTheDocument();
    });

    it('displays centered plus icon in circle', () => {
      const { container } = render(<CreateProfileCard onCreate={mockOnCreate} />);
      const icons = container.querySelectorAll('[data-testid="AddIcon"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('User Interactions', () => {
    it('calls onCreate when create button clicked', async () => {
      const user = userEvent.setup();
      render(<CreateProfileCard onCreate={mockOnCreate} />);

      const button = screen.getByText('Create Profile');
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    it('calls onCreate only once per click', async () => {
      const user = userEvent.setup();
      render(<CreateProfileCard onCreate={mockOnCreate} />);

      const button = screen.getByText('Create Profile');
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', async () => {
      const user = userEvent.setup();
      render(<CreateProfileCard onCreate={mockOnCreate} />);

      const button = screen.getByText('Create Profile');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledTimes(3);
    });

    it('button is enabled by default', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      const button = screen.getByRole('button', { name: /Create Profile/i });
      expect(button).toBeEnabled();
    });
  });

  describe('Layout and Styling', () => {
    it('renders as a card component', () => {
      const { container } = render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(container.querySelector('[class*="MuiCard"]')).toBeInTheDocument();
    });

    it('has centered content', () => {
      const { container } = render(<CreateProfileCard onCreate={mockOnCreate} />);
      const card = container.querySelector('[class*="MuiCard"]');
      expect(card).toHaveStyle({ textAlign: 'center' });
    });
  });

  describe('Accessibility', () => {
    it('has accessible button', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('button has descriptive text', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByRole('button', { name: /Create Profile/i })).toBeInTheDocument();
    });

    it('heading is properly structured', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      const heading = screen.getByText('Create New Profile');
      expect(heading.tagName).toBe('H3');
    });
  });

  describe('Component Props', () => {
    it('accepts onCreate function prop', () => {
      const customCreate = jest.fn();
      render(<CreateProfileCard onCreate={customCreate} />);

      const button = screen.getByText('Create Profile');
      expect(button).toBeInTheDocument();
    });

    it('works with different onCreate implementations', async () => {
      const user = userEvent.setup();
      const asyncCreate = jest.fn(async () => {
        return Promise.resolve();
      });

      render(<CreateProfileCard onCreate={asyncCreate} />);

      const button = screen.getByText('Create Profile');
      await user.click(button);

      expect(asyncCreate).toHaveBeenCalled();
    });
  });

  describe('Visual Elements', () => {
    it('contains description about profile purpose', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(
        screen.getByText(/optimize your resume for specific job applications/i)
      ).toBeInTheDocument();
    });

    it('mentions tracking progress in description', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByText(/track your progress/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicks without errors', async () => {
      const user = userEvent.setup();
      render(<CreateProfileCard onCreate={mockOnCreate} />);

      const button = screen.getByText('Create Profile');

      // Simulate rapid clicking
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledTimes(3);
    });

    it('renders correctly with console errors suppressed', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByText('Create New Profile')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
