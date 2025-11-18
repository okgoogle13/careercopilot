import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
} from '../alert-dialog';

describe('AlertDialog', () => {
  describe('Rendering', () => {
    it('renders when open', () => {
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>Dialog Content</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <AlertDialog open={false}>
          <AlertDialogContent>Dialog Content</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <AlertDialog ref={ref} open={true}>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>
      );
      expect(ref.current).toBeDefined();
    });
  });

  describe('Interactions', () => {
    it('calls onOpenChange when closing', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      render(
        <AlertDialog open={true} onOpenChange={handleOpenChange}>
          <AlertDialogContent>
            Content
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('calls onClose when provided', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <AlertDialog open={true} onClose={handleClose}>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>
      );

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(
        <AlertDialog open={true} data-testid="custom-dialog">
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId('custom-dialog')).toBeInTheDocument();
    });

    it('accepts maxWidth prop', () => {
      render(
        <AlertDialog open={true} maxWidth="sm">
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts fullWidth prop', () => {
      render(
        <AlertDialog open={true} fullWidth>
          <AlertDialogContent>Full Width Content</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByText('Full Width Content')).toBeInTheDocument();
    });
  });
});

describe('AlertDialogTrigger', () => {
  describe('Rendering', () => {
    it('renders as button by default', () => {
      render(<AlertDialogTrigger>Open Dialog</AlertDialogTrigger>);
      expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument();
    });

    it('renders with asChild prop', () => {
      render(
        <AlertDialogTrigger asChild>
          <button>Custom Button</button>
        </AlertDialogTrigger>
      );
      expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<AlertDialogTrigger ref={ref}>Trigger</AlertDialogTrigger>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<AlertDialogTrigger onClick={handleClick}>Open</AlertDialogTrigger>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('AlertDialogContent', () => {
  it('renders content', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogContent>Dialog Body Content</AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Dialog Body Content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogContent ref={ref}>Content</AlertDialogContent>
      </AlertDialog>
    );
    expect(ref.current).toBeDefined();
  });
});

describe('AlertDialogHeader', () => {
  it('renders header content', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogHeader>Header Content</AlertDialogHeader>
      </AlertDialog>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogHeader ref={ref}>Header</AlertDialogHeader>
      </AlertDialog>
    );
    expect(ref.current).toBeDefined();
  });
});

describe('AlertDialogTitle', () => {
  it('renders title', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogTitle>Dialog Title</AlertDialogTitle>
      </AlertDialog>
    );
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogTitle ref={ref}>Title</AlertDialogTitle>
      </AlertDialog>
    );
    expect(ref.current).toBeDefined();
  });
});

describe('AlertDialogDescription', () => {
  it('renders description', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogDescription>Dialog description text</AlertDialogDescription>
      </AlertDialog>
    );
    expect(screen.getByText('Dialog description text')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogDescription ref={ref}>Description</AlertDialogDescription>
      </AlertDialog>
    );
    expect(ref.current).toBeDefined();
  });
});

describe('AlertDialogFooter', () => {
  it('renders footer content', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter>
          <button>Action</button>
        </AlertDialogFooter>
      </AlertDialog>
    );
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogFooter ref={ref}>Footer</AlertDialogFooter>
      </AlertDialog>
    );
    expect(ref.current).toBeDefined();
  });
});

describe('AlertDialogAction', () => {
  it('renders action button', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogAction>Confirm</AlertDialogAction>
      </AlertDialog>
    );
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <AlertDialog open={true}>
        <AlertDialogAction onClick={handleClick}>Confirm</AlertDialogAction>
      </AlertDialog>
    );

    await user.click(screen.getByRole('button', { name: /confirm/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogAction ref={ref}>Action</AlertDialogAction>
      </AlertDialog>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('AlertDialogCancel', () => {
  it('renders cancel button with outlined variant', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialog>
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <AlertDialog open={true}>
        <AlertDialogCancel onClick={handleClick}>Cancel</AlertDialogCancel>
      </AlertDialog>
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <AlertDialog open={true}>
        <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
      </AlertDialog>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('AlertDialog Integration', () => {
  it('renders complete alert dialog', () => {
    render(
      <AlertDialog open={true}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogContent>Additional content</AlertDialogContent>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    );

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Additional content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('handles controlled open state', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [open, setOpen] = React.useState(false);

      return (
        <>
          <AlertDialogTrigger onClick={() => setOpen(true)}>
            Open Dialog
          </AlertDialogTrigger>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogTitle>Test Dialog</AlertDialogTitle>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Close
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    };

    render(<TestComponent />);

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open dialog/i }));
    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });
  });
});
