import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Autocomplete } from './M3Autocomplete';

describe('M3Autocomplete Component', () => {
  const mockOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders autocomplete input', () => {
      render(<M3Autocomplete options={mockOptions} />);
      const input = screen.getByLabelText('Autocomplete');
      expect(input).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Autocomplete options={mockOptions} />);
      const element = container.querySelector('.m3-autocomplete');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Autocomplete options={mockOptions} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // Filtering Tests
  describe('Filtering', () => {
    test('filters options based on input', async () => {
      render(<M3Autocomplete options={mockOptions} />);
      const input = screen.getByLabelText('Autocomplete');
      await userEvent.type(input, 'app');
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    });

    test('shows all options when input is empty', async () => {
      render(<M3Autocomplete options={mockOptions} />);
      const input = screen.getByLabelText('Autocomplete');
      fireEvent.focus(input);
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });
  });

  // Selection Tests
  describe('Selection', () => {
    test('calls onChange when option is selected', async () => {
      const handleChange = jest.fn();
      render(<M3Autocomplete options={mockOptions} onChange={handleChange} />);
      const input = screen.getByLabelText('Autocomplete');
      fireEvent.focus(input);
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
      const appleOption = screen.getByText('Apple');
      fireEvent.click(appleOption);
      expect(handleChange).toHaveBeenCalledWith('apple');
    });

    test('updates input value when option is selected', async () => {
      render(<M3Autocomplete options={mockOptions} />);
      const input = screen.getByLabelText('Autocomplete') as HTMLInputElement;
      fireEvent.focus(input);
      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Banana'));
      expect(input.value).toBe('Banana');
    });
  });

  // Custom Filter Tests
  describe('Custom Filter', () => {
    test('uses custom filter function when provided', async () => {
      const customFilter = jest.fn((opts, val) =>
        opts.filter((opt) => opt.label.startsWith(val))
      );
      render(
        <M3Autocomplete options={mockOptions} filterOptions={customFilter} />
      );
      const input = screen.getByLabelText('Autocomplete');
      await userEvent.type(input, 'B');
      expect(customFilter).toHaveBeenCalled();
    });
  });
});
