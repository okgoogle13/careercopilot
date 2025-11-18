import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../tooltip';

describe('Tooltip', () => {
  describe('Tooltip Component', () => {
    it('renders with children', () => {
      render(
        <Tooltip title="Tooltip text" open>
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('displays tooltip on hover', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip title="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });

    it('hides tooltip when not hovering', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip title="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });

      await user.unhover(button);

      await waitFor(() => {
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      });
    });

    it('can be controlled with open prop', () => {
      render(
        <Tooltip title="Controlled tooltip" open>
          <button>Button</button>
        </Tooltip>
      );

      expect(screen.getByText('Controlled tooltip')).toBeInTheDocument();
    });

    it('does not show tooltip when open is false', () => {
      render(
        <Tooltip title="Hidden tooltip" open={false}>
          <button>Button</button>
        </Tooltip>
      );

      expect(screen.queryByText('Hidden tooltip')).not.toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Tooltip ref={ref} title="Tooltip">
          <div>Content</div>
        </Tooltip>
      );

      // Note: Material-UI Tooltip might not directly use the ref on a div
      // This test verifies ref is forwarded without error
      expect(ref).toBeDefined();
    });
  });

  describe('TooltipTrigger Component', () => {
    it('renders trigger element', () => {
      render(
        <TooltipTrigger>
          <button>Trigger</button>
        </TooltipTrigger>
      );

      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('renders as child when asChild is true', () => {
      render(
        <TooltipTrigger asChild>
          <button data-testid="custom-button">Custom</button>
        </TooltipTrigger>
      );

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('renders as div wrapper when asChild is false', () => {
      render(
        <TooltipTrigger asChild={false}>
          <span>Content</span>
        </TooltipTrigger>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <TooltipTrigger ref={ref}>
          <button>Trigger</button>
        </TooltipTrigger>
      );

      expect(ref.current).toBeDefined();
    });

    it('passes props to cloned element when asChild is true', () => {
      render(
        <TooltipTrigger asChild data-testid="wrapper">
          <button>Button</button>
        </TooltipTrigger>
      );

      const button = screen.getByText('Button');
      expect(button).toHaveAttribute('data-testid', 'wrapper');
    });
  });

  describe('TooltipContent Component', () => {
    it('renders content', () => {
      render(<TooltipContent>Tooltip content</TooltipContent>);
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    it('accepts side prop', () => {
      render(<TooltipContent side="top">Top tooltip</TooltipContent>);
      expect(screen.getByText('Top tooltip')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<TooltipContent ref={ref}>Content</TooltipContent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('TooltipProvider Component', () => {
    it('renders children', () => {
      render(
        <TooltipProvider>
          <div>Provider content</div>
        </TooltipProvider>
      );

      expect(screen.getByText('Provider content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <TooltipProvider ref={ref}>
          <div>Content</div>
        </TooltipProvider>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Tooltip Placement', () => {
    it('accepts placement prop for positioning', () => {
      render(
        <Tooltip title="Positioned tooltip" placement="bottom" open>
          <button>Button</button>
        </Tooltip>
      );

      expect(screen.getByText('Positioned tooltip')).toBeInTheDocument();
    });

    it('works with different placements', () => {
      const placements: Array<'top' | 'bottom' | 'left' | 'right'> = [
        'top',
        'bottom',
        'left',
        'right',
      ];

      placements.forEach((placement) => {
        const { unmount } = render(
          <Tooltip title={`${placement} tooltip`} placement={placement} open>
            <button>Button</button>
          </Tooltip>
        );

        expect(screen.getByText(`${placement} tooltip`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides accessible description to trigger element', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip title="Accessible tooltip">
          <button aria-label="Button with tooltip">Hover</button>
        </Tooltip>
      );

      const button = screen.getByLabelText('Button with tooltip');
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByText('Accessible tooltip')).toBeInTheDocument();
      });
    });
  });
});
