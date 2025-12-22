import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Checkbox } from './M3Checkbox';

describe('M3Checkbox Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders checkbox element', () => {
      render(<M3Checkbox />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    test('applies base class', () => {
      const { container } = render(<M3Checkbox />);
      const checkbox = container.querySelector('.m3-checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    test('applies default color class (primary)', () => {
      const { container } = render(<M3Checkbox />);
      const checkbox = container.querySelector('.m3-checkbox--primary');
      expect(checkbox).toBeInTheDocument();
    });

    test('applies default size class (medium)', () => {
      const { container } = render(<M3Checkbox />);
      const checkbox = container.querySelector('.m3-checkbox--medium');
      expect(checkbox).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Checkbox className="custom-class" />
      );
      const checkbox = container.querySelector('.custom-class');
      expect(checkbox).toBeInTheDocument();
    });
  });

  // State Rendering Tests
  describe('State Rendering', () => {
    test('renders unchecked state by default', () => {
      render(<M3Checkbox />);
      const checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
      expect(checkbox).not.toHaveClass('m3-checkbox--checked');
    });

    test('renders checked state when checked prop is true', () => {
      render(<M3Checkbox checked />);
      const checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      expect(checkbox).toHaveClass('m3-checkbox--checked');
    });

    test('renders indeterminate state when indeterminate prop is true', () => {
      const { container } = render(<M3Checkbox indeterminate />);
      const checkbox = container.querySelector('.m3-checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
      expect(checkbox).toHaveClass('m3-checkbox--indeterminate');
    });

    test('renders with defaultChecked (uncontrolled)', () => {
      render(<M3Checkbox defaultChecked />);
      const checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.defaultChecked).toBe(true);
    });
  });

  // Color Tests
  describe('Color Prop', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`renders with ${color} color`, () => {
        const { container } = render(<M3Checkbox color={color} />);
        const checkbox = container.querySelector(`.m3-checkbox--${color}`);
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  // Size Tests
  describe('Size Prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`renders with ${size} size`, () => {
        const { container } = render(<M3Checkbox size={size} />);
        const checkbox = container.querySelector(`.m3-checkbox--${size}`);
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  // State Toggling Tests
  describe('State Toggling', () => {
    test('calls onChange when checkbox is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    test('calls onChange with false when unchecking', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox checked onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    });

    test('toggles checked state when clicked (uncontrolled)', () => {
      render(<M3Checkbox defaultChecked={false} />);
      const checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    test('does not toggle when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox disabled onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled prop is true', () => {
      const { container } = render(<M3Checkbox disabled />);
      const checkbox = container.querySelector('.m3-checkbox--disabled');
      expect(checkbox).toBeInTheDocument();
    });

    test('sets disabled attribute when disabled prop is true', () => {
      render(<M3Checkbox disabled />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toBeDisabled();
    });

    test('sets aria-disabled when disabled', () => {
      render(<M3Checkbox disabled />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    });

    test('does not respond to clicks when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox disabled onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Label Tests
  describe('Label Support', () => {
    test('renders label when provided', () => {
      render(<M3Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    test('associates label with checkbox via htmlFor', () => {
      render(<M3Checkbox id="test-checkbox" label="Test Label" />);
      const label = screen.getByText('Test Label');
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(label).toHaveAttribute('for', checkbox.id);
    });

    test('toggles checkbox when label is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox label="Click me" onChange={handleChange} />);
      const label = screen.getByText('Click me');
      fireEvent.click(label);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('does not toggle when label is clicked and checkbox is disabled', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox label="Disabled" disabled onChange={handleChange} />);
      const label = screen.getByText('Disabled');
      fireEvent.click(label);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Accessibility', () => {
    test('toggles checkbox on Space key', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.keyDown(checkbox, { key: ' ' });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('does not toggle on other keys', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.keyDown(checkbox, { key: 'Enter' });
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('does not respond to keyboard when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox disabled onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.keyDown(checkbox, { key: ' ' });
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Indeterminate State Tests
  describe('Indeterminate State', () => {
    test('sets indeterminate attribute when indeterminate prop is true', () => {
      const { container } = render(<M3Checkbox indeterminate />);
      const checkbox = container.querySelector('.m3-checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    test('sets aria-checked="mixed" when indeterminate', () => {
      render(<M3Checkbox indeterminate />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    test('updates indeterminate state when prop changes', () => {
      const { rerender, container } = render(<M3Checkbox indeterminate />);
      let checkbox = container.querySelector('.m3-checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);

      rerender(<M3Checkbox indeterminate={false} />);
      checkbox = container.querySelector('.m3-checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);
    });

    test('can be checked from indeterminate state', () => {
      const handleChange = jest.fn();
      render(<M3Checkbox indeterminate onChange={handleChange} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has checkbox role', () => {
      render(<M3Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    test('sets aria-checked="true" when checked', () => {
      render(<M3Checkbox checked />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    test('sets aria-checked="false" when unchecked', () => {
      render(<M3Checkbox checked={false} />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    test('sets aria-checked="mixed" when indeterminate', () => {
      render(<M3Checkbox indeterminate />);
      const checkbox = screen.getByTestId('m3-checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });

    test('ref can be used to access input methods', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Checkbox ref={ref} />);
      expect(typeof ref.current?.focus).toBe('function');
      expect(typeof ref.current?.blur).toBe('function');
    });
  });

  // Controlled vs Uncontrolled Tests
  describe('Controlled vs Uncontrolled', () => {
    test('works as controlled component', () => {
      const { rerender } = render(<M3Checkbox checked={false} />);
      let checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      rerender(<M3Checkbox checked={true} />);
      checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    test('works as uncontrolled component', () => {
      render(<M3Checkbox defaultChecked={true} />);
      const checkbox = screen.getByTestId('m3-checkbox') as HTMLInputElement;
      expect(checkbox.defaultChecked).toBe(true);
    });
  });
});
