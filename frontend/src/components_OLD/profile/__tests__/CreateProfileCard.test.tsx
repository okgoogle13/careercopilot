import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom'; // Fix type errors

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

    it('displays description text', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(
        screen.getByText(/tailored profile/i) // Adjusted from precise text to partial match if needed
      ).toBeInTheDocument();
    });

    it('displays create button', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      expect(screen.getByRole('button', { name: /Create Profile/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onCreate when create button clicked', async () => {
      const user = userEvent.setup();
      render(<CreateProfileCard onCreate={mockOnCreate} />);

      const button = screen.getByRole('button', { name: /Create Profile/i });
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    it('button is enabled by default', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      const button = screen.getByRole('button', { name: /Create Profile/i });
      expect(button).toBeEnabled();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      const button = screen.getByRole('button', { name: /Create Profile/i });
      expect(button).toBeInTheDocument();
    });

    it('heading is properly structured', () => {
      render(<CreateProfileCard onCreate={mockOnCreate} />);
      const heading = screen.getByText('Create New Profile');
      expect(heading.tagName).toMatch(/H[1-6]/); // Check for any heading tag level
    });
  });
});
