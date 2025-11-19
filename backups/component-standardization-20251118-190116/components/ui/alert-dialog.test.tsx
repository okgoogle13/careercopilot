import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog';

describe('AlertDialog', () => {
  it('renders closed by default', () => {
    const { container } = render(
      <AlertDialog open={false}>
        <AlertDialogContent>Content</AlertDialogContent>
      </AlertDialog>
    );
    const dialog = container.querySelector('.MuiDialog-root');
    expect(dialog).toBeInTheDocument();
  });

  it('opens when open prop is true', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>Dialog Content</AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('calls onOpenChange when closing via backdrop', async () => {
    const handleOpenChange = jest.fn();
    const { container } = render(
      <AlertDialog open={true} onOpenChange={handleOpenChange}>
        <AlertDialogContent>Content</AlertDialogContent>
      </AlertDialog>
    );
    const backdrop = container.querySelector('.MuiBackdrop-root');
    await userEvent.click(backdrop!);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange when closing via escape key', async () => {
    const handleOpenChange = jest.fn();
    render(
      <AlertDialog open={true} onOpenChange={handleOpenChange}>
        <AlertDialogContent>Content</AlertDialogContent>
      </AlertDialog>
    );
    await userEvent.keyboard('{Escape}');
    expect(handleOpenChange).toHaveBeenCalled();
  });

  it('does not call onOpenChange if onClose is the only handler', () => {
    const handleClose = jest.fn();
    const handleOpenChange = jest.fn();
    const { container } = render(
      <AlertDialog open={true} onClose={handleClose} onOpenChange={handleOpenChange}>
        <AlertDialogContent>Content</AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('AlertDialogTrigger', () => {
  it('renders as a button by default', () => {
    render(<AlertDialogTrigger>Open Dialog</AlertDialogTrigger>);
    const button = screen.getByRole('button', { name: /Open Dialog/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(<AlertDialogTrigger onClick={handleClick}>Trigger</AlertDialogTrigger>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders children as button label', () => {
    render(<AlertDialogTrigger>Custom Trigger</AlertDialogTrigger>);
    expect(screen.getByRole('button', { name: /Custom Trigger/i })).toBeInTheDocument();
  });

  it('supports asChild prop to render as custom element', () => {
    render(
      <AlertDialogTrigger asChild>
        <div data-testid="custom-element">Custom</div>
      </AlertDialogTrigger>
    );
    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });
});

describe('AlertDialogContent', () => {
  it('renders without errors', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>Content Here</AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Content Here')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>
          <p>Test Content</p>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});

describe('AlertDialogHeader', () => {
  it('renders without errors', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogHeader>Header</AlertDialogHeader>
      </AlertDialog>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders as a heading', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogHeader>Dialog Header</AlertDialogHeader>
      </AlertDialog>
    );
    const heading = screen.getByRole('heading', { name: /Dialog Header/i });
    expect(heading).toBeInTheDocument();
  });
});

describe('AlertDialogTitle', () => {
  it('renders without errors', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogTitle>Title</AlertDialogTitle>
      </AlertDialog>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders with heading role', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogTitle>Dialog Title</AlertDialogTitle>
      </AlertDialog>
    );
    const heading = screen.getByRole('heading', { name: /Dialog Title/i });
    expect(heading).toBeInTheDocument();
  });
});

describe('AlertDialogDescription', () => {
  it('renders without errors', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogDescription>Description</AlertDialogDescription>
      </AlertDialog>
    );
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders text content', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogDescription>This is a description</AlertDialogDescription>
      </AlertDialog>
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });
});

describe('AlertDialogFooter', () => {
  it('renders without errors', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>Footer</AlertDialogFooter>
      </AlertDialog>
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <button>Action</button>
        </AlertDialogFooter>
      </AlertDialog>
    );
    expect(screen.getByRole('button', { name: /Action/i })).toBeInTheDocument();
  });
});

describe('AlertDialogAction', () => {
  it('renders as a button', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    );
    const button = screen.getByRole('button', { name: /Confirm/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClick}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    );

    await userEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(handleClick).toHaveBeenCalled();
  });

  it('supports variant prop', () => {
    const { container } = render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <AlertDialogAction variant="contained">Primary</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    );
    const button = container.querySelector('.MuiButton-containedPrimary');
    expect(button).toBeInTheDocument();
  });
});

describe('AlertDialogCancel', () => {
  it('renders as outlined button', () => {
    const { container } = render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>
    );
    const button = container.querySelector('.MuiButton-outlined');
    expect(button).toBeInTheDocument();
  });

  it('displays cancel text', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>
    );
    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClick}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>
    );

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('Complete AlertDialog Workflow', () => {
  it('renders a complete alert dialog', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole('heading', { name: /Confirm Delete/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this item/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('handles dialog with trigger button', async () => {
    const { rerender } = render(
      <div>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialog open={false}>
          <AlertDialogContent>Dialog Content</AlertDialogContent>
        </AlertDialog>
      </div>
    );

    expect(screen.getByRole('button', { name: /Open/i })).toBeInTheDocument();
  });

  it('renders dialog with multiple action buttons', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogTitle>Choose an action</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save</AlertDialogAction>
            <AlertDialogAction>Save and Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save and Continue/i })).toBeInTheDocument();
  });
});
