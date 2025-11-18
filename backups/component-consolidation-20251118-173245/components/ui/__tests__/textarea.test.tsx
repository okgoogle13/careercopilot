import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from '@jest/globals';

import { Textarea } from '../textarea';

describe('Textarea', () => {
  it('renders without crashing', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts placeholder', () => {
    render(<Textarea placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('accepts value prop', () => {
    render(<Textarea value="Test content" />);
    expect(screen.getByRole('textbox')).toHaveValue('Test content');
  });

  it('accepts onChange handler', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);

    await user.type(screen.getByRole('textbox'), 'Hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with default 4 rows', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('accepts custom rows prop', () => {
    render(<Textarea rows={10} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('can be disabled', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('displays error state', () => {
    render(<Textarea error helperText="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('is full width by default', () => {
    const { container } = render(<Textarea />);
    expect(container.querySelector('.MuiFormControl-root')).toHaveClass('MuiFormControl-fullWidth');
  });

  it('has textbox role', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
