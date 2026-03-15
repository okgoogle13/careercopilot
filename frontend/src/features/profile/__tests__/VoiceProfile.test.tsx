/**
 * Voice Profile Components Test Suite
 *
 * Tests for voice profile creation, submission, and status display.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoiceSampleSubmissionForm } from '../components/VoiceSampleSubmissionForm';
import { VoiceProfileStatusCard } from '../components/VoiceProfileStatusCard';
import { VoiceProfileManagementSection } from '../components/VoiceProfileManagementSection';

describe('VoiceProfile Components', () => {
  describe('VoiceSampleSubmissionForm', () => {
    it('should render the form with textarea and submit button', () => {
      const mockOnSubmit = jest.fn();
      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      expect(screen.getByPlaceholderText(/paste your writing sample/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create voice profile/i })).toBeInTheDocument();
    });

    it('should display validation error when sample is too short', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();

      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(/paste your writing sample/i);
      const button = screen.getByRole('button', { name: /create voice profile/i });

      // Type short text
      await user.type(textarea, 'Short');

      // Try to submit
      await user.click(button);

      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText(/must be at least 50 characters/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with valid sample text', async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(/paste your writing sample/i);
      const button = screen.getByRole('button', { name: /create voice profile/i });

      // Type valid text
      const validText =
        'This is a valid writing sample that meets the minimum character requirement for voice profile extraction.';
      await user.type(textarea, validText);

      // Submit form
      await user.click(button);

      // Wait for submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(validText);
      });
    });

    it('should display error message when submission fails', () => {
      const mockOnSubmit = jest.fn();

      render(
        <VoiceSampleSubmissionForm
          onSubmit={mockOnSubmit}
          error="Network error"
        />
      );

      // Error should display
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  describe('VoiceProfileStatusCard', () => {
    it('should render empty state when no profile exists', () => {
      render(<VoiceProfileStatusCard />);

      expect(screen.getByText(/no voice profile yet/i)).toBeInTheDocument();
      expect(screen.getByText(/submit a writing sample/i)).toBeInTheDocument();
    });

    it('should render loading state when loading', () => {
      render(<VoiceProfileStatusCard loading={true} />);

      expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
    });

    it('should render profile characteristics when available', () => {
      render(
        <VoiceProfileStatusCard
          tone="Professional and Persuasive"
          vocabularyLevel="Advanced"
          createdAt="2026-03-10"
        />
      );

      expect(screen.getByText('Professional and Persuasive')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should display section headers', () => {
      render(
        <VoiceProfileStatusCard
          tone="Professional"
          vocabularyLevel="Advanced"
        />
      );

      expect(screen.getByText(/writing tone/i)).toBeInTheDocument();
      expect(screen.getByText(/vocabulary level/i)).toBeInTheDocument();
    });
  });

  describe('VoiceProfileManagementSection', () => {
    it('should render section heading and description', () => {
      render(<VoiceProfileManagementSection />);

      expect(screen.getByText('VOICE PROFILE')).toBeInTheDocument();
      expect(screen.getByText(/captures your writing style/i)).toBeInTheDocument();
    });

    it('should render creation panel', () => {
      render(<VoiceProfileManagementSection />);

      expect(screen.getByPlaceholderText(/paste your writing sample/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create voice profile/i })).toBeInTheDocument();
    });

    it('should render status card and form components', () => {
      render(<VoiceProfileManagementSection />);

      // Check for status card elements
      expect(screen.getByText(/no voice profile yet/i)).toBeInTheDocument();

      // Check for form elements
      expect(screen.getByPlaceholderText(/paste your writing sample/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create voice profile/i })).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render complete voice profile section', () => {
      render(<VoiceProfileManagementSection />);

      // Section header
      expect(screen.getByText('VOICE PROFILE')).toBeInTheDocument();

      // Description
      expect(screen.getByText(/captures your writing style/i)).toBeInTheDocument();

      // Status card (empty state)
      expect(screen.getByText(/no voice profile yet/i)).toBeInTheDocument();

      // Form
      expect(screen.getByPlaceholderText(/paste your writing sample/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create voice profile/i })).toBeInTheDocument();
    });

    it('should handle form submission flow', async () => {
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(/paste your writing sample/i);
      const button = screen.getByRole('button', { name: /create voice profile/i });

      const validText =
        'This is a professional writing sample demonstrating career achievements and technical expertise over multiple years of experience.';
      await user.type(textarea, validText);
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(validText);
      });
    });

    it('should validate text length constraints', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();

      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(/paste your writing sample/i);
      const button = screen.getByRole('button', { name: /create voice profile/i });

      // Test minimum length
      await user.type(textarea, 'a'.repeat(40));
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText(/must be at least 50 characters/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
