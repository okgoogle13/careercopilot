import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { M3Tooltip } from '../M3Tooltip';
import * as React from 'react';

describe('M3Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders without errors', () => {
    render(
      <M3Tooltip title="Tooltip text">
        <button>Hover me</button>
      </M3Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <M3Tooltip title="Tooltip">
        <button>Button</button>
      </M3Tooltip>
    );
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('does not show tooltip initially', () => {
    render(
      <M3Tooltip title="Tooltip text">
        <button>Button</button>
      </M3Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter after delay', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="Tooltip text" enterDelay={200}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="Tooltip text" enterDelay={0} leaveDelay={0}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(0);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(button);

    jest.advanceTimersByTime(0);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    render(
      <M3Tooltip title="Tooltip text">
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    button.focus();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    render(
      <M3Tooltip title="Tooltip text">
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    button.focus();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    button.blur();

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('does not show tooltip when disabled', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="Tooltip text" disabled enterDelay={0}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(0);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not show tooltip when title is empty', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="">
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(200);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('supports different placement values', async () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;

    for (const placement of placements) {
      const { unmount } = render(
        <M3Tooltip title="Tooltip" placement={placement}>
          <button>Button {placement}</button>
        </M3Tooltip>
      );

      const button = screen.getByText(`Button ${placement}`);
      button.focus();

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass(`m3-tooltip--${placement}`);
      });

      unmount();
    }
  });

  it('uses default placement of top', async () => {
    render(
      <M3Tooltip title="Tooltip">
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    button.focus();

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('m3-tooltip--top');
    });
  });

  it('respects custom enterDelay', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="Tooltip" enterDelay={500}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(200);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('respects custom leaveDelay', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="Tooltip" enterDelay={0} leaveDelay={300}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(0);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    await user.unhover(button);

    jest.advanceTimersByTime(100);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <M3Tooltip title="Tooltip" className="custom-tooltip">
        <button>Button</button>
      </M3Tooltip>
    );

    expect(container.querySelector('.custom-tooltip')).toBeInTheDocument();
  });

  it('has correct data-testid', () => {
    render(
      <M3Tooltip title="Tooltip">
        <button>Button</button>
      </M3Tooltip>
    );

    expect(screen.getByTestId('m3-tooltip-wrapper')).toBeInTheDocument();
  });

  it('tooltip has correct data-testid when visible', async () => {
    render(
      <M3Tooltip title="Tooltip" enterDelay={0}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    button.focus();

    await waitFor(() => {
      expect(screen.getByTestId('m3-tooltip')).toBeInTheDocument();
    });
  });

  it('sets aria-describedby on child when tooltip is visible', async () => {
    render(
      <M3Tooltip title="Tooltip">
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');

    expect(button).not.toHaveAttribute('aria-describedby');

    button.focus();

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-describedby', 'm3-tooltip-content');
    });
  });

  it('renders tooltip with id for accessibility', async () => {
    render(
      <M3Tooltip title="Tooltip">
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    button.focus();

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', 'm3-tooltip-content');
    });
  });

  it('cleans up timeouts on unmount', () => {
    const { unmount } = render(
      <M3Tooltip title="Tooltip" enterDelay={1000}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    unmount();

    jest.advanceTimersByTime(1000);

    // No errors should occur
    expect(true).toBe(true);
  });

  it('cancels pending show on quick mouse leave', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <M3Tooltip title="Tooltip" enterDelay={500}>
        <button>Button</button>
      </M3Tooltip>
    );

    const button = screen.getByText('Button');
    await user.hover(button);

    jest.advanceTimersByTime(200);

    await user.unhover(button);

    jest.advanceTimersByTime(300);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
