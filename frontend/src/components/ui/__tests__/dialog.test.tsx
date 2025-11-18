import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '../dialog';

describe('Dialog', () => {
  describe('Dialog Component', () => {
    it('renders when open', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogContent>Dialog content</DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <Dialog open={false} onClose={jest.fn()}>
          <DialogContent>Dialog content</DialogContent>
        </Dialog>
      );

      expect(screen.queryByText('Dialog content')).not.toBeInTheDocument();
    });

    it('calls onClose when close action is triggered', async () => {
      const handleClose = jest.fn();

      render(
        <Dialog open onClose={handleClose}>
          <DialogContent>
            Content
            <DialogClose />
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByRole('button');
      await userEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalled();
    });

    it('calls onOpenChange when close action is triggered', async () => {
      const handleOpenChange = jest.fn();

      render(
        <Dialog open onOpenChange={handleOpenChange} onClose={jest.fn()}>
          <DialogContent>
            Content
            <DialogClose />
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByRole('button');
      await userEvent.click(closeButton);

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Dialog ref={ref} open onClose={jest.fn()}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('DialogTitle Component', () => {
    it('renders title text', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogTitle>Dialog Title</DialogTitle>
        </Dialog>
      );

      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    it('renders as h2 element', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogTitle>Title</DialogTitle>
        </Dialog>
      );

      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H2');
    });
  });

  describe('DialogContent Component', () => {
    it('renders content', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogContent>Content text</DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogContent ref={ref}>Content</DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('DialogHeader Component', () => {
    it('renders header content', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogHeader>
            <DialogTitle>Header Title</DialogTitle>
          </DialogHeader>
        </Dialog>
      );

      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogHeader ref={ref}>Header</DialogHeader>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('DialogFooter Component', () => {
    it('renders footer content', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogFooter>
            <button>Cancel</button>
            <button>OK</button>
          </DialogFooter>
        </Dialog>
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogFooter ref={ref}>Footer</DialogFooter>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('DialogDescription Component', () => {
    it('renders description text', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogDescription>This is a description</DialogDescription>
        </Dialog>
      );

      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogDescription ref={ref}>Description</DialogDescription>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('DialogClose Component', () => {
    it('renders close button', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogClose />
        </Dialog>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();

      render(
        <Dialog open onClose={jest.fn()}>
          <DialogClose onClick={handleClick} />
        </Dialog>
      );

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogClose ref={ref} />
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('DialogTrigger Component', () => {
    it('renders trigger button', () => {
      render(<DialogTrigger>Open Dialog</DialogTrigger>);
      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<DialogTrigger onClick={handleClick}>Open</DialogTrigger>);

      await userEvent.click(screen.getByText('Open'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<DialogTrigger ref={ref}>Trigger</DialogTrigger>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Complete Dialog Example', () => {
    it('renders complete dialog with all components', () => {
      render(
        <Dialog open onClose={jest.fn()}>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogContent>Main content</DialogContent>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
          <DialogClose />
        </Dialog>
      );

      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog Description')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });
});
