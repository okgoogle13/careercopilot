import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '../slider';

describe('Slider', () => {
  describe('Basic Rendering', () => {
    it('renders slider component', () => {
      render(<Slider value={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Slider defaultValue={30} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '30');
    });

    it('renders with controlled value', () => {
      render(<Slider value={75} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '75');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Slider ref={ref} value={50} />);
      expect(ref.current).toBeDefined();
    });
  });

  describe('Range', () => {
    it('accepts min and max props', () => {
      render(<Slider value={50} min={0} max={100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('works with custom range', () => {
      render(<Slider value={500} min={0} max={1000} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '500');
    });
  });

  describe('Step', () => {
    it('accepts step prop', () => {
      render(<Slider value={50} step={10} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('works with decimal step', () => {
      render(<Slider value={0.5} min={0} max={1} step={0.1} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onChange when value changes', async () => {
      const handleChange = jest.fn();
      render(<Slider value={50} onChange={handleChange} />);

      const slider = screen.getByRole('slider');

      // Simulate keyboard interaction
      slider.focus();
      const user = userEvent.setup();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Slider value={50} disabled />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = jest.fn();
      render(<Slider value={50} onChange={handleChange} disabled />);

      const slider = screen.getByRole('slider');
      slider.focus();
      const user = userEvent.setup();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Marks', () => {
    it('renders with marks', () => {
      const marks = [
        { value: 0, label: '0' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
      ];

      render(<Slider value={50} marks={marks} />);
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('renders with boolean marks', () => {
      render(<Slider value={50} marks />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('accepts aria-label', () => {
      render(<Slider value={50} aria-label="Volume control" />);
      expect(screen.getByLabelText('Volume control')).toBeInTheDocument();
    });

    it('accepts aria-labelledby', () => {
      render(
        <div>
          <label id="slider-label">Volume</label>
          <Slider value={50} aria-labelledby="slider-label" />
        </div>
      );
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('renders horizontal slider by default', () => {
      render(<Slider value={50} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('renders vertical slider', () => {
      render(<Slider value={50} orientation="vertical" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Value Display', () => {
    it('shows value label when valueLabelDisplay is on', () => {
      render(<Slider value={75} valueLabelDisplay="on" />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    it('shows value label on hover when valueLabelDisplay is auto', () => {
      render(<Slider value={75} valueLabelDisplay="auto" />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Slider
          value={50}
          min={0}
          max={100}
          aria-label="Test slider"
        />
      );

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('is keyboard accessible', async () => {
      render(<Slider value={50} />);
      const slider = screen.getByRole('slider');

      slider.focus();
      expect(slider).toHaveFocus();
    });
  });
});
