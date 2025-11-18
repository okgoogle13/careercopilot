import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup', () => {
  describe('Rendering', () => {
    it('renders radio group', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders multiple radio items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
          <RadioGroupItem value="option3" label="Option 3" />
        </RadioGroup>
      );
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <RadioGroup ref={ref}>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('RadioGroupItem', () => {
    it('renders radio item with label', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    });

    it('renders radio item without label', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <RadioGroup>
          <RadioGroupItem ref={ref} value="option1" />
        </RadioGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('has correct value attribute', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="test-value" label="Test" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('value', 'test-value');
    });
  });

  describe('Selection', () => {
    it('renders with default value selected', () => {
      render(
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
          <RadioGroupItem value="option3" label="Option 3" />
        </RadioGroup>
      );

      const option2 = screen.getByRole('radio', { name: /Option 2/i });
      expect(option2).toBeChecked();
    });

    it('renders with controlled value selected', () => {
      render(
        <RadioGroup value="option1">
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
        </RadioGroup>
      );

      const option1 = screen.getByRole('radio', { name: /Option 1/i });
      expect(option1).toBeChecked();
    });

    it('only one option can be selected at a time', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
        </RadioGroup>
      );

      const option1 = screen.getByRole('radio', { name: /Option 1/i });
      const option2 = screen.getByRole('radio', { name: /Option 2/i });

      expect(option1).toBeChecked();
      expect(option2).not.toBeChecked();

      await user.click(option2);

      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
    });
  });

  describe('Interactions', () => {
    it('calls onChange when option is selected', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <RadioGroup onChange={handleChange}>
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
        </RadioGroup>
      );

      await user.click(screen.getByRole('radio', { name: /Option 2/i }));
      expect(handleChange).toHaveBeenCalled();
    });

    it('passes correct value to onChange', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <RadioGroup onChange={handleChange}>
          <RadioGroupItem value="test-value" label="Test" />
        </RadioGroup>
      );

      await user.click(screen.getByRole('radio', { name: /Test/i }));
      expect(handleChange).toHaveBeenCalledWith(
        expect.anything(),
        'test-value'
      );
    });

    it('does not call onChange when disabled radio is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <RadioGroup onChange={handleChange}>
          <RadioGroupItem value="option1" label="Option 1" disabled />
        </RadioGroup>
      );

      await user.click(screen.getByRole('radio', { name: /Option 1/i }));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when disabled group is used', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <RadioGroup onChange={handleChange}>
          <RadioGroupItem value="option1" label="Option 1" disabled />
        </RadioGroup>
      );

      await user.click(screen.getByRole('radio', { name: /Option 1/i }));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('renders disabled radio item', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Disabled" disabled />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeDisabled();
    });

    it('renders multiple disabled items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" disabled />
          <RadioGroupItem value="option2" label="Option 2" disabled />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });

    it('renders with mixed enabled/disabled items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Enabled" />
          <RadioGroupItem value="option2" label="Disabled" disabled />
        </RadioGroup>
      );

      expect(screen.getByRole('radio', { name: /Enabled/i })).not.toBeDisabled();
      expect(screen.getByRole('radio', { name: /Disabled/i })).toBeDisabled();
    });
  });

  describe('Layout', () => {
    it('renders with row direction by default', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders with column direction', () => {
      render(
        <RadioGroup row={false}>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders with row direction', () => {
      render(
        <RadioGroup row>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes through additional props to RadioGroup', () => {
      render(
        <RadioGroup data-testid="custom-group" aria-label="Custom group">
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );

      const group = screen.getByTestId('custom-group');
      expect(group).toHaveAttribute('aria-label', 'Custom group');
    });

    it('passes through additional props to RadioGroupItem', () => {
      render(
        <RadioGroup>
          <RadioGroupItem
            value="option1"
            label="Option 1"
            data-testid="custom-radio"
          />
        </RadioGroup>
      );

      expect(screen.getByTestId('custom-radio')).toBeInTheDocument();
    });

    it('accepts labelProps on RadioGroupItem', () => {
      render(
        <RadioGroup>
          <RadioGroupItem
            value="option1"
            label="Test"
            labelProps={{ 'data-testid': 'label-wrapper' } as any}
          />
        </RadioGroup>
      );
      expect(screen.getByTestId('label-wrapper')).toBeInTheDocument();
    });

    it('accepts color prop on RadioGroupItem', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Primary" color="primary" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('accepts size prop on RadioGroupItem', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Small" size="small" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct role for radio group', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('has correct role for radio items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <RadioGroup onChange={handleChange}>
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
        </RadioGroup>
      );

      const option2 = screen.getByRole('radio', { name: /Option 2/i });
      option2.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalled();
    });

    it('supports aria-label on group', () => {
      render(
        <RadioGroup aria-label="Select an option">
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Select an option')).toBeInTheDocument();
    });

    it('associates label with radio button', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" label="Accessible Option" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Accessible Option')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles controlled component pattern', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('option1');
        return (
          <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
            <RadioGroupItem value="option1" label="Option 1" />
            <RadioGroupItem value="option2" label="Option 2" />
          </RadioGroup>
        );
      };

      render(<TestComponent />);

      const option1 = screen.getByRole('radio', { name: /Option 1/i });
      const option2 = screen.getByRole('radio', { name: /Option 2/i });

      expect(option1).toBeChecked();
      expect(option2).not.toBeChecked();

      await user.click(option2);

      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
    });

    it('handles empty value', () => {
      render(
        <RadioGroup value="">
          <RadioGroupItem value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).not.toBeChecked();
    });

    it('handles large number of options', () => {
      const options = Array.from({ length: 50 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      render(
        <RadioGroup>
          {options.map(opt => (
            <RadioGroupItem key={opt.value} value={opt.value} label={opt.label} />
          ))}
        </RadioGroup>
      );

      expect(screen.getAllByRole('radio')).toHaveLength(50);
    });
  });
});
