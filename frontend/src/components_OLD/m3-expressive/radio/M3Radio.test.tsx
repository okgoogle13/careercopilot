import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Radio } from './M3Radio';

describe('M3Radio Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders radio element', () => {
      render(<M3Radio value="test" />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveAttribute('type', 'radio');
    });

    test('applies base class', () => {
      const { container } = render(<M3Radio value="test" />);
      const radio = container.querySelector('.m3-radio');
      expect(radio).toBeInTheDocument();
    });

    test('applies default color class (primary)', () => {
      const { container } = render(<M3Radio value="test" />);
      const radio = container.querySelector('.m3-radio--primary');
      expect(radio).toBeInTheDocument();
    });

    test('applies default size class (medium)', () => {
      const { container } = render(<M3Radio value="test" />);
      const radio = container.querySelector('.m3-radio--medium');
      expect(radio).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Radio value="test" className="custom-class" />
      );
      const radio = container.querySelector('.custom-class');
      expect(radio).toBeInTheDocument();
    });
  });

  // State Rendering Tests
  describe('State Rendering', () => {
    test('renders unselected state by default', () => {
      render(<M3Radio value="test" />);
      const radio = screen.getByTestId('m3-radio') as HTMLInputElement;
      expect(radio.checked).toBe(false);
      expect(radio).not.toHaveClass('m3-radio--checked');
    });

    test('renders selected state when checked prop is true', () => {
      render(<M3Radio value="test" checked />);
      const radio = screen.getByTestId('m3-radio') as HTMLInputElement;
      expect(radio.checked).toBe(true);
      expect(radio).toHaveClass('m3-radio--checked');
    });

    test('renders with defaultChecked (uncontrolled)', () => {
      render(<M3Radio value="test" defaultChecked />);
      const radio = screen.getByTestId('m3-radio') as HTMLInputElement;
      expect(radio.defaultChecked).toBe(true);
    });
  });

  // Color Tests
  describe('Color Prop', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`renders with ${color} color`, () => {
        const { container } = render(<M3Radio value="test" color={color} />);
        const radio = container.querySelector(`.m3-radio--${color}`);
        expect(radio).toBeInTheDocument();
      });
    });
  });

  // Size Tests
  describe('Size Prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`renders with ${size} size`, () => {
        const { container } = render(<M3Radio value="test" size={size} />);
        const radio = container.querySelector(`.m3-radio--${size}`);
        expect(radio).toBeInTheDocument();
      });
    });
  });

  // Value Prop Tests
  describe('Value Prop', () => {
    test('sets value attribute', () => {
      render(<M3Radio value="option1" />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toHaveAttribute('value', 'option1');
    });

    test('calls onChange with correct value when clicked', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="option1" onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.click(radio);
      expect(handleChange).toHaveBeenCalledWith('option1', expect.any(Object));
    });

    test('handles numeric value', () => {
      const handleChange = jest.fn();
      render(<M3Radio value={123} onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.click(radio);
      expect(handleChange).toHaveBeenCalledWith(123, expect.any(Object));
    });
  });

  // Selection State Change Tests
  describe('Selection State Change', () => {
    test('calls onChange when radio is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.click(radio);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('test', expect.any(Object));
    });

    test('does not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" disabled onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.click(radio);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled prop is true', () => {
      const { container } = render(<M3Radio value="test" disabled />);
      const radio = container.querySelector('.m3-radio--disabled');
      expect(radio).toBeInTheDocument();
    });

    test('sets disabled attribute when disabled prop is true', () => {
      render(<M3Radio value="test" disabled />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toBeDisabled();
    });

    test('sets aria-disabled when disabled', () => {
      render(<M3Radio value="test" disabled />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toHaveAttribute('aria-disabled', 'true');
    });

    test('does not respond to clicks when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" disabled onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.click(radio);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Label Tests
  describe('Label Support', () => {
    test('renders label when provided', () => {
      render(<M3Radio value="test" label="Option 1" />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    test('associates label with radio via htmlFor', () => {
      render(<M3Radio value="test" id="test-radio" label="Test Label" />);
      const label = screen.getByText('Test Label');
      const radio = screen.getByTestId('m3-radio');
      expect(label).toHaveAttribute('for', radio.id);
    });

    test('selects radio when label is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" label="Click me" onChange={handleChange} />);
      const label = screen.getByText('Click me');
      fireEvent.click(label);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('does not select when label is clicked and radio is disabled', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" label="Disabled" disabled onChange={handleChange} />);
      const label = screen.getByText('Disabled');
      fireEvent.click(label);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Accessibility', () => {
    test('selects radio on Space key', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.keyDown(radio, { key: ' ' });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('selects radio on Enter key', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.keyDown(radio, { key: 'Enter' });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('does not select on other keys', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.keyDown(radio, { key: 'ArrowDown' });
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('does not respond to keyboard when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Radio value="test" disabled onChange={handleChange} />);
      const radio = screen.getByTestId('m3-radio');
      fireEvent.keyDown(radio, { key: ' ' });
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Group Management Tests
  describe('Group Management', () => {
    test('sets name attribute for grouping', () => {
      render(<M3Radio value="test" name="group1" />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toHaveAttribute('name', 'group1');
    });

    test('multiple radios with same name form a group', () => {
      render(
        <div>
          <M3Radio value="option1" name="group1" />
          <M3Radio value="option2" name="group1" />
          <M3Radio value="option3" name="group1" />
        </div>
      );
      const radios = screen.getAllByTestId('m3-radio');
      expect(radios).toHaveLength(3);
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'group1');
      });
    });

    test('only one radio in group can be selected', () => {
      const handleChange1 = jest.fn();
      const handleChange2 = jest.fn();
      render(
        <div>
          <M3Radio value="option1" name="group1" checked={false} onChange={handleChange1} />
          <M3Radio value="option2" name="group1" checked={true} onChange={handleChange2} />
        </div>
      );
      const radios = screen.getAllByTestId('m3-radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has radio role', () => {
      render(<M3Radio value="test" />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
    });

    test('sets aria-checked="true" when checked', () => {
      render(<M3Radio value="test" checked />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toHaveAttribute('aria-checked', 'true');
    });

    test('sets aria-checked="false" when unchecked', () => {
      render(<M3Radio value="test" checked={false} />);
      const radio = screen.getByTestId('m3-radio');
      expect(radio).toHaveAttribute('aria-checked', 'false');
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Radio value="test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('radio');
    });

    test('ref can be used to access input methods', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Radio value="test" ref={ref} />);
      expect(typeof ref.current?.focus).toBe('function');
      expect(typeof ref.current?.blur).toBe('function');
    });
  });

  // Controlled vs Uncontrolled Tests
  describe('Controlled vs Uncontrolled', () => {
    test('works as controlled component', () => {
      const { rerender } = render(<M3Radio value="test" checked={false} />);
      let radio = screen.getByTestId('m3-radio') as HTMLInputElement;
      expect(radio.checked).toBe(false);

      rerender(<M3Radio value="test" checked={true} />);
      radio = screen.getByTestId('m3-radio') as HTMLInputElement;
      expect(radio.checked).toBe(true);
    });

    test('works as uncontrolled component', () => {
      render(<M3Radio value="test" defaultChecked={true} />);
      const radio = screen.getByTestId('m3-radio') as HTMLInputElement;
      expect(radio.defaultChecked).toBe(true);
    });
  });
});
