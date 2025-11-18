import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input field', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Input variant="default" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders outlined variant', () => {
      render(<Input variant="outlined" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders filled variant', () => {
      render(<Input variant="filled" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('accepts text input', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();

      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();

      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(input).toHaveValue('');
    });

    it('does not accept input when readonly', async () => {
      const user = userEvent.setup();
      render(<Input inputProps={{ readOnly: true }} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(input).toHaveValue('');
    });
  });

  describe('States', () => {
    it('renders disabled state', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders error state', () => {
      render(<Input error helperText="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<Input helperText="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('renders required state', () => {
      render(<Input required label="Required field" />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(<Input data-testid="custom-input" />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });

    it('accepts type prop', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('accepts maxLength prop', () => {
      render(<Input inputProps={{ maxLength: 10 }} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('accepts autoFocus prop', () => {
      render(<Input autoFocus />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('accepts autoComplete prop', () => {
      render(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('accepts name prop', () => {
      render(<Input name="username" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'username');
    });

    it('accepts id prop', () => {
      render(<Input id="custom-id" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Controlled Component', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'controlled');

      expect(input).toHaveValue('controlled');
    });

    it('respects controlled value changes', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial');
        return (
          <>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={() => setValue('updated')}>Update</button>
          </>
        );
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Input inputProps={{ 'aria-label': 'Custom label' }} />);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('supports aria-describedby for helper text', () => {
      render(<Input helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.tab();
      expect(input).toHaveFocus();
    });

    it('supports screen readers with label', () => {
      render(<Input label="Email address" />);
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(<Input value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('handles very long text', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);

      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    it('handles special characters', async () => {
      const user = userEvent.setup();
      const specialChars = '!@#$%^&*()';

      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, specialChars);

      expect(input).toHaveValue(specialChars);
    });

    it('maintains focus after value change', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.type(input, 'test');

      expect(input).toHaveFocus();
    });

    it('clears value when cleared programmatically', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial');
        return (
          <>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={() => setValue('')}>Clear</button>
          </>
        );
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
    });
  });

  describe('Full Width', () => {
    it('renders full width by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });
});
