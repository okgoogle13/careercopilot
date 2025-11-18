import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from '@jest/globals';

import { Select, SelectOption } from '../select';

describe('Select', () => {
  const options: SelectOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Select options={options} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Select options={options} label="Select option" />);
      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Select options={options} placeholder="Choose an option" />);
      expect(screen.getByPlaceholderText('Choose an option')).toBeInTheDocument();
    });

    it('renders in disabled state', () => {
      render(<Select options={options} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Single Selection', () => {
    it('displays selected value', () => {
      render(<Select options={options} value={options[0]} />);
      expect(screen.getByRole('combobox')).toHaveValue('Option 1');
    });

    it('calls onChange when option selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Select options={options} onChange={handleChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const option = screen.getByText('Option 2');
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith(options[1]);
    });
  });

  describe('Multiple Selection', () => {
    it('allows multiple selections', () => {
      render(<Select options={options} multiple value={[options[0], options[1]]} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('displays chips for selected options', () => {
      render(<Select options={options} multiple value={[options[0]]} />);
      const chips = screen.getAllByRole('button');
      expect(chips.length).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    it('displays error state', () => {
      render(<Select options={options} error helperText="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('shows required indicator', () => {
      render(<Select options={options} label="Required field" required />);
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has combobox role', () => {
      render(<Select options={options} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('associates label with input', () => {
      render(<Select options={options} label="Test label" />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAccessibleName(/Test label/);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<Select options={[]} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles null value', () => {
      render(<Select options={options} value={null} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});
