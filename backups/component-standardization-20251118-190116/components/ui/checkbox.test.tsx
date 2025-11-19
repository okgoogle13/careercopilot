import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders without errors', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText(/Accept terms/i)).toBeInTheDocument();
  });

  it('renders without a label when label prop is not provided', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Toggle" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange handler when toggled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Checkbox label="Change" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          checked: true,
        }),
      }),
      true
    );
  });

  it('is disabled when disabled prop is true', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Checkbox label="Disabled" disabled onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('is checked when checked prop is true', () => {
    render(<Checkbox label="Checked" checked={true} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('is not checked when checked prop is false', () => {
    render(<Checkbox label="Unchecked" checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('supports defaultChecked prop', () => {
    render(<Checkbox label="Default Checked" defaultChecked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('supports indeterminate state', () => {
    const { container } = render(
      <Checkbox label="Indeterminate" indeterminate={true} onChange={() => {}} />
    );
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('passes labelProps to FormControlLabel', () => {
    const { container } = render(
      <Checkbox
        label="Test"
        labelProps={{
          placement: 'start',
          className: 'custom-label',
        }}
      />
    );
    const formControlLabel = container.querySelector('.custom-label');
    expect(formControlLabel).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(<Checkbox label="Small" size="small" />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();

    rerender(<Checkbox label="Medium" size="medium" />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('supports color prop', () => {
    const { container } = render(<Checkbox label="Primary" color="primary" />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('is accessible with keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Keyboard" />);

    const checkbox = screen.getByRole('checkbox');
    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('has correct ARIA attributes', () => {
    render(<Checkbox label="ARIA Test" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('supports required prop', () => {
    const { container } = render(<Checkbox label="Required" required />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveAttribute('required');
  });

  it('can be controlled component', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Checkbox label="Controlled" checked={false} onChange={() => {}} />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<Checkbox label="Controlled" checked={true} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
