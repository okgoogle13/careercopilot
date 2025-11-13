import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('renders without errors', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);

    const input = screen.getByLabelText(/Email/i);
    await user.type(input, 'test@example.com');

    expect(input).toHaveValue('test@example.com');
  });

  it('calls onChange handler when input changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input label="Test" onChange={handleChange} />);

    const input = screen.getByLabelText(/Test/i);
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(5); // Once for each character
  });

  it('is disabled when disabled prop is true', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input label="Disabled" disabled onChange={handleChange} />);

    const input = screen.getByLabelText(/Disabled/i);
    expect(input).toBeDisabled();

    await user.type(input, 'test');
    expect(input).toHaveValue('');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('displays error state when error prop is true', () => {
    render(<Input label="Error Input" error helperText="This field is required" />);
    expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(<Input label="Password" helperText="At least 8 characters" />);
    expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument();
  });

  it('renders with placeholder text', () => {
    render(<Input placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText(/Enter your name/i);
    expect(input).toBeInTheDocument();
  });

  it('supports different types', () => {
    const { rerender } = render(<Input type="password" label="Password" />);
    let input = screen.getByLabelText(/Password/i);
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="email" label="Email" />);
    input = screen.getByLabelText(/Email/i);
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with variant prop', () => {
    const { rerender } = render(<Input variant="outlined" label="Outlined" />);
    expect(screen.getByLabelText(/Outlined/i)).toBeInTheDocument();

    rerender(<Input variant="filled" label="Filled" />);
    expect(screen.getByLabelText(/Filled/i)).toBeInTheDocument();
  });

  it('supports multiline input', async () => {
    const user = userEvent.setup();
    render(<Input label="Description" multiline rows={4} />);

    const textarea = screen.getByLabelText(/Description/i);
    await user.type(textarea, 'Line 1\nLine 2');

    expect(textarea).toHaveValue('Line 1\nLine 2');
  });

  it('has correct focus state', async () => {
    const user = userEvent.setup();
    render(<Input label="Focus Test" />);

    const input = screen.getByLabelText(/Focus Test/i);
    await user.click(input);

    expect(input).toHaveFocus();
  });

  it('clears input when value is set to empty string', async () => {
    const { rerender } = render(<Input label="Clear" value="hello" onChange={() => {}} />);
    expect(screen.getByLabelText(/Clear/i)).toHaveValue('hello');

    rerender(<Input label="Clear" value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/Clear/i)).toHaveValue('');
  });

  it('is required when required prop is true', () => {
    const { container } = render(<Input label="Required Field" required />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('required');
  });
});
