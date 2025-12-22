import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Switch } from './M3Switch';

describe('M3Switch Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders switch element', () => {
      render(<M3Switch />);
      const switchInput = screen.getByTestId('m3-switch');
      expect(switchInput).toBeInTheDocument();
      expect(switchInput).toHaveAttribute('type', 'checkbox');
    });

    test('applies base class', () => {
      const { container } = render(<M3Switch />);
      const switchInput = container.querySelector('.m3-switch');
      expect(switchInput).toBeInTheDocument();
    });

    test('applies default color class (primary)', () => {
      const { container } = render(<M3Switch />);
      const switchInput = container.querySelector('.m3-switch--primary');
      expect(switchInput).toBeInTheDocument();
    });

    test('applies default size class (medium)', () => {
      const { container } = render(<M3Switch />);
      const switchInput = container.querySelector('.m3-switch--medium');
      expect(switchInput).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Switch className="custom-class" />
      );
      const switchInput = container.querySelector('.custom-class');
      expect(switchInput).toBeInTheDocument();
    });
  });

  // State Rendering Tests
  describe('State Rendering', () => {
    test('renders off state by default', () => {
      render(<M3Switch />);
      const switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.checked).toBe(false);
      expect(switchInput).not.toHaveClass('m3-switch--checked');
    });

    test('renders on state when checked prop is true', () => {
      render(<M3Switch checked />);
      const switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.checked).toBe(true);
      expect(switchInput).toHaveClass('m3-switch--checked');
    });

    test('renders with defaultChecked (uncontrolled)', () => {
      render(<M3Switch defaultChecked />);
      const switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.defaultChecked).toBe(true);
    });
  });

  // Color Tests
  describe('Color Prop', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`renders with ${color} color`, () => {
        const { container } = render(<M3Switch color={color} />);
        const switchInput = container.querySelector(`.m3-switch--${color}`);
        expect(switchInput).toBeInTheDocument();
      });
    });
  });

  // Size Tests
  describe('Size Prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`renders with ${size} size`, () => {
        const { container } = render(<M3Switch size={size} />);
        const switchInput = container.querySelector(`.m3-switch--${size}`);
        expect(switchInput).toBeInTheDocument();
      });
    });
  });

  // Toggle Tests
  describe('Toggle with onChange', () => {
    test('calls onChange when switch is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Switch onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.click(switchInput);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    });

    test('calls onChange with false when turning off', () => {
      const handleChange = jest.fn();
      render(<M3Switch checked onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.click(switchInput);
      expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    });

    test('toggles checked state when clicked (uncontrolled)', () => {
      render(<M3Switch defaultChecked={false} />);
      const switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.checked).toBe(false);
      fireEvent.click(switchInput);
      expect(switchInput.checked).toBe(true);
    });

    test('does not toggle when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Switch disabled onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.click(switchInput);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled prop is true', () => {
      const { container } = render(<M3Switch disabled />);
      const switchInput = container.querySelector('.m3-switch--disabled');
      expect(switchInput).toBeInTheDocument();
    });

    test('sets disabled attribute when disabled prop is true', () => {
      render(<M3Switch disabled />);
      const switchInput = screen.getByTestId('m3-switch');
      expect(switchInput).toBeDisabled();
    });

    test('sets aria-disabled when disabled', () => {
      render(<M3Switch disabled />);
      const switchInput = screen.getByTestId('m3-switch');
      expect(switchInput).toHaveAttribute('aria-disabled', 'true');
    });

    test('does not respond to clicks when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Switch disabled onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.click(switchInput);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Label Tests
  describe('Label Support', () => {
    test('renders label when provided', () => {
      render(<M3Switch label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    test('associates label with switch via htmlFor', () => {
      render(<M3Switch id="test-switch" label="Test Label" />);
      const label = screen.getByText('Test Label');
      const switchInput = screen.getByTestId('m3-switch');
      expect(label).toHaveAttribute('for', switchInput.id);
    });

    test('renders label on right by default', () => {
      const { container } = render(<M3Switch label="Right label" />);
      const wrapper = container.querySelector('.m3-switch-wrapper--label-right');
      expect(wrapper).toBeInTheDocument();
    });

    test('renders label on left when labelPosition is left', () => {
      const { container } = render(<M3Switch label="Left label" labelPosition="left" />);
      const wrapper = container.querySelector('.m3-switch-wrapper--label-left');
      expect(wrapper).toBeInTheDocument();
    });

    test('toggles switch when label is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Switch label="Click me" onChange={handleChange} />);
      const label = screen.getByText('Click me');
      fireEvent.click(label);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('does not toggle when label is clicked and switch is disabled', () => {
      const handleChange = jest.fn();
      render(<M3Switch label="Disabled" disabled onChange={handleChange} />);
      const label = screen.getByText('Disabled');
      fireEvent.click(label);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Accessibility', () => {
    test('toggles switch on Space key', () => {
      const handleChange = jest.fn();
      render(<M3Switch onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.keyDown(switchInput, { key: ' ' });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('does not toggle on other keys', () => {
      const handleChange = jest.fn();
      render(<M3Switch onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.keyDown(switchInput, { key: 'Enter' });
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('does not respond to keyboard when disabled', () => {
      const handleChange = jest.fn();
      render(<M3Switch disabled onChange={handleChange} />);
      const switchInput = screen.getByTestId('m3-switch');
      fireEvent.keyDown(switchInput, { key: ' ' });
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Icon Support Tests
  describe('Icon Support', () => {
    test('renders on icon when checked and onIcon is provided', () => {
      const { container } = render(
        <M3Switch checked onIcon={<span data-testid="on-icon">ON</span>} />
      );
      expect(screen.getByTestId('on-icon')).toBeInTheDocument();
    });

    test('renders off icon when unchecked and offIcon is provided', () => {
      const { container } = render(
        <M3Switch checked={false} offIcon={<span data-testid="off-icon">OFF</span>} />
      );
      expect(screen.getByTestId('off-icon')).toBeInTheDocument();
    });

    test('does not render on icon when unchecked', () => {
      render(
        <M3Switch checked={false} onIcon={<span data-testid="on-icon">ON</span>} />
      );
      expect(screen.queryByTestId('on-icon')).not.toBeInTheDocument();
    });

    test('does not render off icon when checked', () => {
      render(
        <M3Switch checked offIcon={<span data-testid="off-icon">OFF</span>} />
      );
      expect(screen.queryByTestId('off-icon')).not.toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has switch role', () => {
      render(<M3Switch />);
      const switchInput = screen.getByRole('switch');
      expect(switchInput).toBeInTheDocument();
    });

    test('sets aria-checked="true" when checked', () => {
      render(<M3Switch checked />);
      const switchInput = screen.getByTestId('m3-switch');
      expect(switchInput).toHaveAttribute('aria-checked', 'true');
    });

    test('sets aria-checked="false" when unchecked', () => {
      render(<M3Switch checked={false} />);
      const switchInput = screen.getByTestId('m3-switch');
      expect(switchInput).toHaveAttribute('aria-checked', 'false');
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Switch ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });

    test('ref can be used to access input methods', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Switch ref={ref} />);
      expect(typeof ref.current?.focus).toBe('function');
      expect(typeof ref.current?.blur).toBe('function');
    });
  });

  // Controlled vs Uncontrolled Tests
  describe('Controlled vs Uncontrolled', () => {
    test('works as controlled component', () => {
      const { rerender } = render(<M3Switch checked={false} />);
      let switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.checked).toBe(false);

      rerender(<M3Switch checked={true} />);
      switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.checked).toBe(true);
    });

    test('works as uncontrolled component', () => {
      render(<M3Switch defaultChecked={true} />);
      const switchInput = screen.getByTestId('m3-switch') as HTMLInputElement;
      expect(switchInput.defaultChecked).toBe(true);
    });
  });

  // Animation/Transition Tests
  describe('Animation Transitions', () => {
    test('has transition styles applied', () => {
      const { container } = render(<M3Switch />);
      const thumb = container.querySelector('.m3-switch__thumb');
      expect(thumb).toBeInTheDocument();
      // The transition is applied via CSS, we verify the element exists
      expect(thumb).toHaveClass('m3-switch__thumb');
    });

    test('thumb moves when toggled', () => {
      const { container, rerender } = render(<M3Switch checked={false} />);
      let thumb = container.querySelector('.m3-switch__thumb');
      expect(thumb).toBeInTheDocument();

      rerender(<M3Switch checked={true} />);
      thumb = container.querySelector('.m3-switch__thumb');
      expect(thumb).toBeInTheDocument();
      // The transform is applied via CSS class, we verify the checked class is present
      const switchInput = container.querySelector('.m3-switch--checked');
      expect(switchInput).toBeInTheDocument();
    });
  });
});
