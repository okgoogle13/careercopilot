import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';

describe('Popover', () => {
  const anchorEl = document.createElement('div');

  beforeEach(() => {
    document.body.appendChild(anchorEl);
  });

  afterEach(() => {
    document.body.removeChild(anchorEl);
  });

  describe('Popover Component', () => {
    it('renders when open', () => {
      render(
        <Popover open anchorEl={anchorEl}>
          <div>Popover content</div>
        </Popover>
      );

      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <Popover open={false} anchorEl={anchorEl}>
          <div>Popover content</div>
        </Popover>
      );

      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when closed', async () => {
      const handleOpenChange = jest.fn();

      render(
        <Popover
          open
          anchorEl={anchorEl}
          onOpenChange={handleOpenChange}
        >
          <div>Content</div>
        </Popover>
      );

      // Simulate escape key to close
      const user = userEvent.setup();
      await user.keyboard('{Escape}');

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onClose when closed', async () => {
      const handleClose = jest.fn();

      render(
        <Popover open anchorEl={anchorEl} onClose={handleClose}>
          <div>Content</div>
        </Popover>
      );

      const user = userEvent.setup();
      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalled();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Popover ref={ref} open anchorEl={anchorEl}>
          <div>Content</div>
        </Popover>
      );

      expect(ref.current).toBeDefined();
    });
  });

  describe('PopoverTrigger Component', () => {
    it('renders trigger element', () => {
      render(
        <PopoverTrigger>
          <button>Trigger</button>
        </PopoverTrigger>
      );

      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('renders as child when asChild is true', () => {
      render(
        <PopoverTrigger asChild>
          <button data-testid="custom-button">Custom</button>
        </PopoverTrigger>
      );

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <PopoverTrigger ref={ref}>
          <button>Trigger</button>
        </PopoverTrigger>
      );

      expect(ref.current).toBeDefined();
    });
  });

  describe('PopoverContent Component', () => {
    it('renders content', () => {
      render(<PopoverContent>Popover content</PopoverContent>);
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<PopoverContent ref={ref}>Content</PopoverContent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
