import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Stepper } from './M3Stepper';

describe('M3Stepper Component', () => {
  const mockSteps = [
    { label: 'Step 1', description: 'First step' },
    { label: 'Step 2', description: 'Second step' },
    { label: 'Step 3', description: 'Final step' },
  ];

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders steps', () => {
      render(<M3Stepper steps={mockSteps} />);
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Stepper steps={mockSteps} />);
      const element = container.querySelector('.m3-stepper');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Stepper steps={mockSteps} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders step descriptions', () => {
      render(<M3Stepper steps={mockSteps} />);
      expect(screen.getByText('First step')).toBeInTheDocument();
      expect(screen.getByText('Second step')).toBeInTheDocument();
    });

    test('renders optional steps', () => {
      const stepsWithOptional = [
        { label: 'Step 1' },
        { label: 'Step 2', optional: true },
      ];
      render(<M3Stepper steps={stepsWithOptional} />);
      expect(screen.getByText('(Optional)')).toBeInTheDocument();
    });
  });

  // Step State Tests
  describe('Step States', () => {
    test('marks first step as active by default', () => {
      const { container } = render(<M3Stepper steps={mockSteps} />);
      const firstStep = container.querySelector('.m3-stepper__step--active');
      expect(firstStep).toBeInTheDocument();
    });

    test('marks step at activeStep index as active', () => {
      const { container } = render(
        <M3Stepper steps={mockSteps} activeStep={1} />
      );
      const steps = container.querySelectorAll('.m3-stepper__step');
      expect(steps[1]).toHaveClass('m3-stepper__step--active');
    });

    test('marks previous steps as completed', () => {
      const { container } = render(
        <M3Stepper steps={mockSteps} activeStep={2} />
      );
      const steps = container.querySelectorAll('.m3-stepper__step');
      expect(steps[0]).toHaveClass('m3-stepper__step--completed');
      expect(steps[1]).toHaveClass('m3-stepper__step--completed');
    });

    test('marks future steps as pending', () => {
      const { container } = render(
        <M3Stepper steps={mockSteps} activeStep={0} />
      );
      const steps = container.querySelectorAll('.m3-stepper__step');
      expect(steps[1]).toHaveClass('m3-stepper__step--pending');
      expect(steps[2]).toHaveClass('m3-stepper__step--pending');
    });
  });

  // Orientation Tests
  describe('Orientation', () => {
    test('applies horizontal orientation by default', () => {
      const { container } = render(<M3Stepper steps={mockSteps} />);
      const stepper = container.querySelector('.m3-stepper--horizontal');
      expect(stepper).toBeInTheDocument();
    });

    test('applies vertical orientation when specified', () => {
      const { container } = render(
        <M3Stepper steps={mockSteps} orientation="vertical" />
      );
      const stepper = container.querySelector('.m3-stepper--vertical');
      expect(stepper).toBeInTheDocument();
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Stepper steps={mockSteps} color={color} />
        );
        const stepper = container.querySelector(`.m3-stepper--${color}`);
        expect(stepper).toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="group" with aria-label', () => {
      const { container } = render(<M3Stepper steps={mockSteps} />);
      const group = container.querySelector('[role="group"][aria-label="Stepper"]');
      expect(group).toBeInTheDocument();
    });
  });
});
