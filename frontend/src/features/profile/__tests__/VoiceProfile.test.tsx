/**
 * Voice Profile Components Test Suite
 *
 * VoiceSampleSubmissionForm uses react-hook-form + zod which can hang in Jest ESM mode.
 * Tests use unstable_mockModule to intercept these ESM-problematic deps before loading.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';

// Must precede dynamic imports
(jest as any).unstable_mockModule('zod', async () => {
  const actual = await jest.requireActual('zod');
  return actual;
});

(jest as any).unstable_mockModule('lucide-react', () => {
  const cache = new Map<string, any>();
  return new Proxy(
    {},
    {
      get: (_t, prop) => {
        if (typeof prop !== 'string') return undefined;
        if (!cache.has(prop)) {
          const Icon = () =>
            React.createElement('span', { 'data-testid': `icon-${prop.toLowerCase()}` });
          Icon.displayName = prop;
          cache.set(prop, Icon);
        }
        return cache.get(prop);
      },
    }
  );
});

(jest as any).unstable_mockModule('@/api/voiceProfileService', () => ({
  createVoiceProfile: jest.fn().mockResolvedValue({ id: '1' }),
  getVoiceProfile: jest.fn().mockResolvedValue(null),
}));

(jest as any).unstable_mockModule('@tanstack/react-query', async () => {
  const actual = await jest.requireActual('@tanstack/react-query');
  return actual;
});

const { VoiceSampleSubmissionForm } =
  (await import('../components/VoiceSampleSubmissionForm')) as any;

describe('VoiceProfile Components', () => {
  describe('VoiceSampleSubmissionForm', () => {
    it('should render the form with textarea and submit button', () => {
      const mockOnSubmit = jest.fn();
      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      expect(screen.getByPlaceholderText(/Your words go here/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Record My Voice/i })).toBeInTheDocument();
    });

    it('should display validation error when sample is too short', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();

      render(<VoiceSampleSubmissionForm onSubmit={mockOnSubmit} />);

      const textarea = screen.getByPlaceholderText(/Your words go here/i);
      const button = screen.getByRole('button', { name: /Record My Voice/i });

      await user.type(textarea, 'Short');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText(/at least 50 characters/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should display error message when submission fails', () => {
      const mockOnSubmit = jest.fn();

      render(
        <VoiceSampleSubmissionForm
          onSubmit={mockOnSubmit}
          error="Network error"
        />
      );

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
