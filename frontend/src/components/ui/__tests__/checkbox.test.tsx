import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders checkbox', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders checkbox with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders checkbox without label', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.queryByText(/label/i)).not.toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Interactions', () => {
    it('can be checked', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('can be unchecked', async () => {
      const user = userEvent.setup();
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onChange when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} disabled />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('can be clicked via label', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox label="Click me" onChange={handleChange} />);

      await user.click(screen.getByText('Click me'));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('renders checked state', () => {
      render(<Checkbox checked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('renders unchecked state', () => {
      render(<Checkbox checked={false} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders disabled state', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('renders indeterminate state', () => {
      render(<Checkbox indeterminate />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders disabled and checked', () => {
      render(<Checkbox checked disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(<Checkbox data-testid="custom-checkbox" />);
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<Checkbox className="custom-class" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toContain('custom-class');
    });

    it('accepts labelProps', () => {
      render(<Checkbox label="Label" labelProps={{ className: 'custom-label' }} />);
      const label = screen.getByText('Label');
      expect(label.className).toContain('custom-label');
    });

    it('accepts value prop', () => {
      render(<Checkbox value="checkbox-value" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'checkbox-value');
    });

    it('accepts name prop', () => {
      render(<Checkbox name="checkbox-name" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'checkbox-name');
    });

    it('accepts id prop', () => {
      render(<Checkbox id="custom-id" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Controlled Component', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            label="Controlled"
          />
        );
      };

      render(<TestComponent />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Checkbox aria-label="Custom label" />);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <span id="checkbox-label">Checkbox Label</span>
          <Checkbox aria-labelledby="checkbox-label" />
        </>
      );
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <span id="checkbox-desc">Checkbox Description</span>
          <Checkbox aria-describedby="checkbox-desc" />
        </>
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'checkbox-desc');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('renders with React node as label', () => {
      render(<Checkbox label={<span>Complex <strong>Label</strong></span>} />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('handles rapid clicking', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('maintains state across re-renders', () => {
      const { rerender } = render(<Checkbox defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();

      rerender(<Checkbox defaultChecked />);
      expect(checkbox).toBeChecked();
    });
  });
});
