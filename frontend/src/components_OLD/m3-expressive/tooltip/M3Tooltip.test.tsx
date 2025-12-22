import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { M3Tooltip } from './M3Tooltip';

describe('M3Tooltip Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders trigger element', () => {
      render(
        <M3Tooltip title="Tooltip text">
          <button>Hover me</button>
        </M3Tooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    test('shows tooltip on hover', async () => {
      render(
        <M3Tooltip title="Tooltip text">
          <button>Hover me</button>
        </M3Tooltip>
      );
      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });

    test('hides tooltip on mouse leave', async () => {
      render(
        <M3Tooltip title="Tooltip text">
          <button>Hover me</button>
        </M3Tooltip>
      );
      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
      fireEvent.mouseLeave(button);
      await waitFor(() => {
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      });
    });
  });

  // Placement Tests
  describe('Placement', () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;

    placements.forEach((placement) => {
      test(`applies ${placement} placement class`, async () => {
        const { container } = render(
          <M3Tooltip title="Tooltip" placement={placement}>
            <button>Hover</button>
          </M3Tooltip>
        );
        const button = screen.getByText('Hover');
        fireEvent.mouseEnter(button);
        await waitFor(() => {
          const tooltip = container.querySelector(`.m3-tooltip--${placement}`);
          expect(tooltip).toBeInTheDocument();
        });
      });
    });
  });

  // Delay Tests
  describe('Delay', () => {
    test('shows tooltip after delay', async () => {
      jest.useFakeTimers();
      render(
        <M3Tooltip title="Tooltip" delay={1000}>
          <button>Hover</button>
        </M3Tooltip>
      );
      const button = screen.getByText('Hover');
      fireEvent.mouseEnter(button);
      expect(screen.queryByText('Tooltip')).not.toBeInTheDocument();
      jest.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('Tooltip')).toBeInTheDocument();
      });
      jest.useRealTimers();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('does not show tooltip when disabled', async () => {
      render(
        <M3Tooltip title="Tooltip" disabled>
          <button>Hover</button>
        </M3Tooltip>
      );
      const button = screen.getByText('Hover');
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.queryByText('Tooltip')).not.toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="tooltip"', async () => {
      const { container } = render(
        <M3Tooltip title="Tooltip">
          <button>Hover</button>
        </M3Tooltip>
      );
      const button = screen.getByText('Hover');
      fireEvent.mouseEnter(button);
      await waitFor(() => {
        const tooltip = container.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
      });
    });
  });
});
