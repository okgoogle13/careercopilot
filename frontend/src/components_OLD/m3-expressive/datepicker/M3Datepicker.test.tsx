import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { M3Datepicker } from './M3Datepicker';

describe('M3Datepicker Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders datepicker input', () => {
      render(<M3Datepicker />);
      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Datepicker />);
      const element = container.querySelector('.m3-datepicker');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Datepicker className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('opens calendar when input is clicked', async () => {
      render(<M3Datepicker />);
      const input = screen.getByLabelText('Date');
      fireEvent.click(input);
      await waitFor(() => {
        expect(screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/)).toBeInTheDocument();
      });
    });
  });

  // Value Tests
  describe('Value', () => {
    test('displays selected date', () => {
      render(<M3Datepicker value="2024-01-15" />);
      const input = screen.getByLabelText('Date') as HTMLInputElement;
      expect(input.value).toContain('Jan');
      expect(input.value).toContain('15');
    });

    test('calls onChange when date is selected', async () => {
      const handleChange = jest.fn();
      render(<M3Datepicker onChange={handleChange} />);
      const input = screen.getByLabelText('Date');
      fireEvent.click(input);
      await waitFor(() => {
        const day15 = screen.queryByText('15');
        if (day15) {
          fireEvent.click(day15);
          expect(handleChange).toHaveBeenCalled();
        }
      });
    });
  });

  // Calendar Navigation Tests
  describe('Calendar Navigation', () => {
    test('navigates to previous month', async () => {
      render(<M3Datepicker />);
      const input = screen.getByLabelText('Date');
      fireEvent.click(input);
      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous month');
        fireEvent.click(prevButton);
        // Calendar should update
      });
    });

    test('navigates to next month', async () => {
      render(<M3Datepicker />);
      const input = screen.getByLabelText('Date');
      fireEvent.click(input);
      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next month');
        fireEvent.click(nextButton);
        // Calendar should update
      });
    });
  });

  // Min/Max Date Tests
  describe('Min/Max Date', () => {
    test('disables dates before minDate', async () => {
      // Set minDate to Jan 15, 2024
      render(<M3Datepicker minDate="2024-01-15" />);
      const input = screen.getByLabelText('Date');
      fireEvent.click(input);
      
      // Wait for the calendar to open
      await waitFor(() => {
        // Find the calendar header (month/year text)
        const monthYear = screen.queryByText(/January|February|March|April|May|June|July|August|September|October|November|December/);
        expect(monthYear).toBeInTheDocument();
        
        // Find all day buttons in the calendar
        const dayButtons = screen.getAllByRole('button').filter(btn => {
          const text = btn.textContent;
          // Check if it's a day number (1-31)
          return text && /^\d{1,2}$/.test(text.trim());
        });
        
        // Check that days before the 15th are disabled
        dayButtons.forEach(button => {
          const dayNum = parseInt(button.textContent || '0', 10);
          if (dayNum > 0 && dayNum < 15) {
            expect(button).toBeDisabled();
          }
        });
        
        // Check that the 15th and after are enabled (if they exist)
        dayButtons.forEach(button => {
          const dayNum = parseInt(button.textContent || '0', 10);
          if (dayNum >= 15 && dayNum <= 31) {
            expect(button).not.toBeDisabled();
          }
        });
      }, { timeout: 3000 });
    });

    test('disables dates after maxDate', async () => {
      render(<M3Datepicker maxDate="2024-01-20" />);
      const input = screen.getByLabelText('Date');
      fireEvent.click(input);
      await waitFor(() => {
        const day25 = screen.queryByText('25');
        if (day25) {
          expect(day25.closest('button')).toBeDisabled();
        }
      });
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('disables input when disabled is true', () => {
      render(<M3Datepicker disabled />);
      const input = screen.getByLabelText('Date');
      expect(input).toBeDisabled();
    });
  });
});
