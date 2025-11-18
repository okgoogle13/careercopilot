import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from '@jest/globals';

import { Switch } from '../switch';

describe('Switch', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Switch />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Switch label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('renders without label', () => {
      render(<Switch />);
      expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('toggles when clicked', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchElement = screen.getByRole('checkbox');

      expect(switchElement).not.toBeChecked();
      await user.click(switchElement);
      expect(switchElement).toBeChecked();
    });

    it('calls onCheckedChange with correct value', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange prop', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('can be checked by default', () => {
      render(<Switch checked={true} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('can be unchecked by default', () => {
      render(<Switch checked={false} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('can be disabled', () => {
      render(<Switch disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('cannot be toggled when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has checkbox role', () => {
      render(<Switch />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('associates label with switch', () => {
      render(<Switch label="Test label" />);
      const switchElement = screen.getByRole('checkbox');
      expect(switchElement).toHaveAccessibleName('Test label');
    });
  });

  describe('Props', () => {
    it('accepts labelProps', () => {
      render(<Switch label="Test" labelProps={{ className: 'custom-class' }} />);
      expect(screen.getByText('Test').parentElement).toHaveClass('custom-class');
    });

    it('calls both onCheckedChange and onChange', async () => {
      const user = userEvent.setup();
      const handleCheckedChange = vi.fn();
      const handleChange = vi.fn();

      render(<Switch onCheckedChange={handleCheckedChange} onChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));

      expect(handleCheckedChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
