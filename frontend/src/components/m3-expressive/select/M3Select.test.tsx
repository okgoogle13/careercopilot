import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Select, type M3SelectOption } from './M3Select';

const mockOptions: M3SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', disabled: true },
  { label: 'Option 4', value: '4' },
];

describe('M3Select Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders select element', () => {
      render(<M3Select options={mockOptions} />);
      const select = screen.getByTestId('m3-select');
      expect(select).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Select options={mockOptions} />);
      const select = container.querySelector('.m3-select');
      expect(select).toBeInTheDocument();
    });

    test('applies default variant class (filled)', () => {
      const { container } = render(<M3Select options={mockOptions} />);
      const select = container.querySelector('.m3-select--filled');
      expect(select).toBeInTheDocument();
    });

    test('applies default color class (primary)', () => {
      const { container } = render(<M3Select options={mockOptions} />);
      const select = container.querySelector('.m3-select--primary');
      expect(select).toBeInTheDocument();
    });

    test('applies default size class (medium)', () => {
      const { container } = render(<M3Select options={mockOptions} />);
      const select = container.querySelector('.m3-select--medium');
      expect(select).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Select options={mockOptions} className="custom-class" />
      );
      const select = container.querySelector('.custom-class');
      expect(select).toBeInTheDocument();
    });

    test('renders placeholder when no value selected', () => {
      render(<M3Select options={mockOptions} placeholder="Choose..." />);
      expect(screen.getByText('Choose...')).toBeInTheDocument();
    });

    test('renders selected value', () => {
      render(<M3Select options={mockOptions} value="1" />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variant Prop', () => {
    test('renders with filled variant', () => {
      const { container } = render(
        <M3Select options={mockOptions} variant="filled" />
      );
      const select = container.querySelector('.m3-select--filled');
      expect(select).toBeInTheDocument();
    });

    test('renders with outlined variant', () => {
      const { container } = render(
        <M3Select options={mockOptions} variant="outlined" />
      );
      const select = container.querySelector('.m3-select--outlined');
      expect(select).toBeInTheDocument();
    });
  });

  // Color Tests
  describe('Color Prop', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`renders with ${color} color`, () => {
        const { container } = render(
          <M3Select options={mockOptions} color={color} />
        );
        const select = container.querySelector(`.m3-select--${color}`);
        expect(select).toBeInTheDocument();
      });
    });
  });

  // Size Tests
  describe('Size Prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`renders with ${size} size`, () => {
        const { container } = render(
          <M3Select options={mockOptions} size={size} />
        );
        const select = container.querySelector(`.m3-select--${size}`);
        expect(select).toBeInTheDocument();
      });
    });
  });

  // Dropdown Tests
  describe('Dropdown Opening/Closing', () => {
    test('opens dropdown when control is clicked', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      expect(screen.getByTestId('m3-select-dropdown')).toBeInTheDocument();
    });

    test('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <M3Select options={mockOptions} />
          <div data-testid="outside">Outside</div>
        </div>
      );
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      expect(screen.getByTestId('m3-select-dropdown')).toBeInTheDocument();

      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      await waitFor(() => {
        expect(screen.queryByTestId('m3-select-dropdown')).not.toBeInTheDocument();
      });
    });

    test('toggles dropdown on multiple clicks', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');

      // Open
      fireEvent.click(control);
      expect(screen.getByTestId('m3-select-dropdown')).toBeInTheDocument();

      // Close
      fireEvent.click(control);
      expect(screen.queryByTestId('m3-select-dropdown')).not.toBeInTheDocument();
    });

    test('applies open class when dropdown is open', () => {
      const { container } = render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      const select = container.querySelector('.m3-select--open');
      expect(select).toBeInTheDocument();
    });
  });

  // Selection Tests
  describe('Option Selection', () => {
    test('calls onChange when option is selected', () => {
      const handleChange = jest.fn();
      render(<M3Select options={mockOptions} onChange={handleChange} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith('1');
    });

    test('closes dropdown after selecting option', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(screen.queryByTestId('m3-select-dropdown')).not.toBeInTheDocument();
    });

    test('displays selected option value', () => {
      render(<M3Select options={mockOptions} value="2" />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('highlights selected option in dropdown', () => {
      render(<M3Select options={mockOptions} value="2" />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);

      const selectedOption = screen.getByTestId('m3-select-option-2');
      expect(selectedOption).toHaveClass('m3-select__option--selected');
    });

    test('does not select disabled option', () => {
      const handleChange = jest.fn();
      render(<M3Select options={mockOptions} onChange={handleChange} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);

      const disabledOption = screen.getByText('Option 3');
      fireEvent.click(disabledOption);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled prop is true', () => {
      const { container } = render(
        <M3Select options={mockOptions} disabled />
      );
      const select = container.querySelector('.m3-select--disabled');
      expect(select).toBeInTheDocument();
    });

    test('does not open dropdown when disabled', () => {
      render(<M3Select options={mockOptions} disabled />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      expect(screen.queryByTestId('m3-select-dropdown')).not.toBeInTheDocument();
    });

    test('sets aria-disabled when disabled', () => {
      render(<M3Select options={mockOptions} disabled />);
      const control = screen.getByRole('combobox');
      expect(control).toHaveAttribute('aria-disabled', 'true');
    });

    test('renders disabled options with disabled class', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);

      const disabledOption = screen.getByTestId('m3-select-option-3');
      expect(disabledOption).toHaveClass('m3-select__option--disabled');
    });
  });

  // Error State Tests
  describe('Error State', () => {
    test('applies error class when error prop is true', () => {
      const { container } = render(
        <M3Select options={mockOptions} error />
      );
      const select = container.querySelector('.m3-select--error');
      expect(select).toBeInTheDocument();
    });

    test('displays error message when provided', () => {
      render(
        <M3Select
          options={mockOptions}
          error
          errorMessage="This field is required"
        />
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    test('sets aria-invalid when error is true', () => {
      render(<M3Select options={mockOptions} error />);
      const control = screen.getByRole('combobox');
      expect(control).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // Label and Helper Text Tests
  describe('Label and Helper Text', () => {
    test('renders label when provided', () => {
      render(<M3Select options={mockOptions} label="Select Option" />);
      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    test('associates label with control via htmlFor', () => {
      render(<M3Select options={mockOptions} id="test-select" label="Label" />);
      const label = screen.getByText('Label');
      const control = screen.getByRole('combobox');
      expect(label).toHaveAttribute('for', control.id);
    });

    test('renders helper text when provided', () => {
      render(
        <M3Select options={mockOptions} helperText="Choose an option" />
      );
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    test('associates helper text with control via aria-describedby', () => {
      render(
        <M3Select
          options={mockOptions}
          id="test-select"
          helperText="Helper text"
        />
      );
      const control = screen.getByRole('combobox');
      const helperId = control.getAttribute('aria-describedby');
      expect(helperId).toBeTruthy();
      const helper = document.getElementById(helperId!);
      expect(helper).toHaveTextContent('Helper text');
    });

    test('applies error class to helper text when error is true', () => {
      const { container } = render(
        <M3Select
          options={mockOptions}
          error
          errorMessage="Error message"
        />
      );
      const helper = container.querySelector('.m3-select__helper--error');
      expect(helper).toBeInTheDocument();
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    test('opens dropdown on Enter key', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.keyDown(control, { key: 'Enter' });
      expect(screen.getByTestId('m3-select-dropdown')).toBeInTheDocument();
    });

    test('opens dropdown on Space key', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.keyDown(control, { key: ' ' });
      expect(screen.getByTestId('m3-select-dropdown')).toBeInTheDocument();
    });

    test('closes dropdown on Escape key', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      expect(screen.getByTestId('m3-select-dropdown')).toBeInTheDocument();

      fireEvent.keyDown(control, { key: 'Escape' });
      expect(screen.queryByTestId('m3-select-dropdown')).not.toBeInTheDocument();
    });

    test('navigates down with ArrowDown key', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.keyDown(control, { key: 'ArrowDown' });
      fireEvent.keyDown(control, { key: 'ArrowDown' });

      const option = screen.getByTestId('m3-select-option-2');
      expect(option).toHaveClass('m3-select__option--focused');
    });

    test('navigates up with ArrowUp key', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      fireEvent.keyDown(control, { key: 'ArrowDown' });
      fireEvent.keyDown(control, { key: 'ArrowDown' });
      fireEvent.keyDown(control, { key: 'ArrowUp' });

      // After ArrowDown twice (to index 2, which is disabled), ArrowUp goes to index 1 (Option 2)
      const option = screen.getByTestId('m3-select-option-2');
      expect(option).toHaveClass('m3-select__option--focused');
    });

    test('selects focused option on Enter key', () => {
      const handleChange = jest.fn();
      render(<M3Select options={mockOptions} onChange={handleChange} />);
      const control = screen.getByRole('combobox');
      fireEvent.keyDown(control, { key: 'Enter' });
      // Opens at index 0, ArrowDown goes to index 1 (Option 2)
      fireEvent.keyDown(control, { key: 'ArrowDown' });
      fireEvent.keyDown(control, { key: 'Enter' });

      // Option at index 1 is 'Option 2' with value '2'
      expect(handleChange).toHaveBeenCalledWith('2');
    });

    test('skips disabled options during keyboard navigation', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.keyDown(control, { key: 'Enter' });
      fireEvent.keyDown(control, { key: 'ArrowDown' });
      fireEvent.keyDown(control, { key: 'ArrowDown' });
      // Should skip option 3 (disabled) and focus on option 4
      const option = screen.getByTestId('m3-select-option-4');
      expect(option).toHaveClass('m3-select__option--focused');
    });

    test('does not respond to keyboard when disabled', () => {
      render(<M3Select options={mockOptions} disabled />);
      const control = screen.getByRole('combobox');
      fireEvent.keyDown(control, { key: 'Enter' });
      expect(screen.queryByTestId('m3-select-dropdown')).not.toBeInTheDocument();
    });
  });

  // Controlled vs Uncontrolled Tests
  describe('Controlled vs Uncontrolled', () => {
    test('works as controlled component', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <M3Select options={mockOptions} value="1" onChange={handleChange} />
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      rerender(
        <M3Select options={mockOptions} value="2" onChange={handleChange} />
      );
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('works as uncontrolled component with defaultValue', () => {
      render(<M3Select options={mockOptions} defaultValue="2" />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('updates internal value when uncontrolled', () => {
      const handleChange = jest.fn();
      render(
        <M3Select options={mockOptions} onChange={handleChange} />
      );
      const control = screen.getByRole('combobox');
      fireEvent.click(control);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(handleChange).toHaveBeenCalledWith('1');
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  // Empty Options Tests
  describe('Empty Options', () => {
    test('displays no options message when options array is empty', () => {
      render(<M3Select options={[]} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<M3Select options={mockOptions} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('m3-select');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('control has combobox role', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      expect(control).toBeInTheDocument();
    });

    test('sets aria-expanded when dropdown is open', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      expect(control).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(control);
      expect(control).toHaveAttribute('aria-expanded', 'true');
    });

    test('sets aria-haspopup="listbox"', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      expect(control).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('dropdown has listbox role', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      const dropdown = screen.getByRole('listbox');
      expect(dropdown).toBeInTheDocument();
    });

    test('options have option role', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    test('selected option has aria-selected="true"', () => {
      render(<M3Select options={mockOptions} value="2" />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      const selectedOption = screen.getByTestId('m3-select-option-2');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    test('disabled option has aria-disabled="true"', () => {
      render(<M3Select options={mockOptions} />);
      const control = screen.getByRole('combobox');
      fireEvent.click(control);
      const disabledOption = screen.getByTestId('m3-select-option-3');
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
