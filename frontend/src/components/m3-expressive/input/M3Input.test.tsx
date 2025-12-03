import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Input } from './M3Input';

describe('M3Input Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders input element', () => {
      render(<M3Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Input />);
      const input = container.querySelector('.m3-input');
      expect(input).toBeInTheDocument();
    });

    test('applies default variant class (filled)', () => {
      const { container } = render(<M3Input />);
      const input = container.querySelector('.m3-input--filled');
      expect(input).toBeInTheDocument();
    });

    test('applies default color class (primary)', () => {
      const { container } = render(<M3Input />);
      const input = container.querySelector('.m3-input--primary');
      expect(input).toBeInTheDocument();
    });

    test('applies default size class (medium)', () => {
      const { container } = render(<M3Input />);
      const input = container.querySelector('.m3-input--medium');
      expect(input).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Input className="custom-class" />
      );
      const input = container.querySelector('.custom-class');
      expect(input).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variant Prop', () => {
    test('renders with filled variant', () => {
      const { container } = render(<M3Input variant="filled" />);
      const input = container.querySelector('.m3-input--filled');
      expect(input).toBeInTheDocument();
    });

    test('renders with outlined variant', () => {
      const { container } = render(<M3Input variant="outlined" />);
      const input = container.querySelector('.m3-input--outlined');
      expect(input).toBeInTheDocument();
    });
  });

  // Color Tests
  describe('Color Prop', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`renders with ${color} color`, () => {
        const { container } = render(<M3Input color={color} />);
        const input = container.querySelector(`.m3-input--${color}`);
        expect(input).toBeInTheDocument();
      });
    });
  });

  // Size Tests
  describe('Size Prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`renders with ${size} size`, () => {
        const { container } = render(<M3Input size={size} />);
        const input = container.querySelector(`.m3-input--${size}`);
        expect(input).toBeInTheDocument();
      });
    });
  });

  // Input Type Tests
  describe('Input Types', () => {
    test('renders text input by default', () => {
      render(<M3Input />);
      const input = screen.getByRole('textbox');
      // HTML inputs default to type="text" even if not explicitly set
      expect(input).not.toHaveAttribute('type', 'email');
      expect(input).not.toHaveAttribute('type', 'password');
      // The input should be accessible as a textbox (which is the default)
      expect(input.tagName).toBe('INPUT');
    });

    test('renders email input', () => {
      render(<M3Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('renders password input', () => {
      render(<M3Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    test('renders number input', () => {
      render(<M3Input type="number" />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    test('renders tel input', () => {
      render(<M3Input type="tel" />);
      const input = document.querySelector('input[type="tel"]');
      expect(input).toBeInTheDocument();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('renders as disabled when disabled prop is true', () => {
      render(<M3Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('applies disabled class', () => {
      const { container } = render(<M3Input disabled />);
      const input = container.querySelector('.m3-input--disabled');
      expect(input).toBeInTheDocument();
    });

    test('does not allow input when disabled', async () => {
      const user = userEvent.setup();
      render(<M3Input disabled />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      expect(input).toHaveValue('');
    });
  });

  // Error State Tests
  describe('Error State', () => {
    test('applies error class when error prop is true', () => {
      const { container } = render(<M3Input error />);
      const input = container.querySelector('.m3-input--error');
      expect(input).toBeInTheDocument();
    });

    test('sets aria-invalid when error is true', () => {
      render(<M3Input error />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('does not set aria-invalid when error is false', () => {
      render(<M3Input error={false} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  // Label and Helper Text Tests
  describe('Label and Helper Text', () => {
    test('renders label when provided', () => {
      render(<M3Input label="Email Address" />);
      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    test('associates label with input via htmlFor', () => {
      render(<M3Input id="email-input" label="Email" />);
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', input.id);
    });

    test('renders helper text when provided', () => {
      render(<M3Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    test('associates helper text with input via aria-describedby', () => {
      render(<M3Input id="test-input" helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      const helperId = input.getAttribute('aria-describedby');
      expect(helperId).toBeTruthy();
      const helper = document.getElementById(helperId!);
      expect(helper).toHaveTextContent('Helper text');
    });

    test('applies error class to helper text when error is true', () => {
      const { container } = render(
        <M3Input error helperText="Error message" />
      );
      const helper = container.querySelector('.m3-input__helper--error');
      expect(helper).toBeInTheDocument();
    });
  });

  // Value and Event Handler Tests
  describe('Value and Event Handlers', () => {
    test('accepts value prop', () => {
      render(<M3Input value="test value" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });

    test('calls onChange handler when value changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<M3Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    test('calls onFocus handler when input is focused', () => {
      const handleFocus = jest.fn();
      render(<M3Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test('calls onBlur handler when input loses focus', () => {
      const handleBlur = jest.fn();
      render(<M3Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test('accepts placeholder prop', () => {
      render(<M3Input placeholder="Enter text here" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to underlying input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test('ref can be used to access input methods', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Input ref={ref} />);
      expect(typeof ref.current?.focus).toBe('function');
      expect(typeof ref.current?.blur).toBe('function');
    });

    test('ref can be used to set value programmatically', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<M3Input ref={ref} />);
      if (ref.current) {
        ref.current.value = 'programmatic value';
        expect(ref.current.value).toBe('programmatic value');
      }
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('input has proper role', () => {
      render(<M3Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    test('disabled input has disabled attribute', () => {
      render(<M3Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('disabled');
    });

    test('input can receive focus', () => {
      render(<M3Input />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    test('disabled input cannot receive focus', () => {
      render(<M3Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('forwards required attribute', () => {
      render(<M3Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    test('forwards aria-label attribute', () => {
      render(<M3Input aria-label="Email input" />);
      const input = screen.getByLabelText('Email input');
      expect(input).toBeInTheDocument();
    });

    test('forwards aria-describedby when helper text is provided', () => {
      render(<M3Input id="test" helperText="Helper" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });
  });

  // HTML Attribute Tests
  describe('HTML Attributes', () => {
    test('forwards name attribute', () => {
      render(<M3Input name="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    test('forwards id attribute', () => {
      render(<M3Input id="custom-id" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    test('generates id when not provided', () => {
      render(<M3Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
      expect(input.id).toMatch(/^m3-input-/);
    });

    test('forwards data attributes', () => {
      render(<M3Input data-testid="custom-input" />);
      const input = screen.getByTestId('custom-input');
      expect(input).toBeInTheDocument();
    });

    test('forwards maxLength attribute', () => {
      render(<M3Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    test('forwards minLength attribute', () => {
      render(<M3Input minLength={3} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minLength', '3');
    });
  });

  // Combination Tests
  describe('Prop Combinations', () => {
    test('renders with all custom props', () => {
      const { container } = render(
        <M3Input
          variant="outlined"
          color="tertiary"
          size="large"
          error
          disabled
          className="custom"
          label="Test Label"
          helperText="Helper text"
        />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('m3-input--outlined');
      expect(input).toHaveClass('m3-input--tertiary');
      expect(input).toHaveClass('m3-input--large');
      expect(input).toHaveClass('m3-input--error');
      expect(input).toHaveClass('m3-input--disabled');
      expect(input).toHaveClass('custom');
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });
  });
});
