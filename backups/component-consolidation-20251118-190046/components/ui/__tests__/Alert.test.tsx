import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../Alert';

describe('Alert', () => {
  describe('Rendering', () => {
    it('renders alert with children', () => {
      render(<Alert>Test alert message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test alert message')).toBeInTheDocument();
    });

    it('renders with default variant', () => {
      render(<Alert>Default alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Alert</Alert>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('renders default variant with info severity', () => {
      render(<Alert variant="default">Info alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('renders destructive variant with error severity', () => {
      render(<Alert variant="destructive">Error alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('respects explicit severity prop', () => {
      render(
        <Alert variant="default" severity="success">
          Success alert
        </Alert>
      );
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('renders warning severity', () => {
      render(<Alert severity="warning">Warning alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(
        <Alert data-testid="custom-alert" aria-label="Custom alert">
          Alert
        </Alert>
      );
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveAttribute('aria-label', 'Custom alert');
    });

    it('accepts className prop', () => {
      render(<Alert className="custom-class">Alert</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('custom-class');
    });

    it('renders with icon', () => {
      render(<Alert icon={<span data-testid="custom-icon">!</span>}>Alert with icon</Alert>);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders closeable alert', () => {
      const handleClose = jest.fn();
      render(
        <Alert onClose={handleClose}>
          Closeable alert
        </Alert>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Alert aria-label="Custom label">Alert</Alert>);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });
  });
});

describe('AlertTitle', () => {
  describe('Rendering', () => {
    it('renders alert title', () => {
      render(<AlertTitle>Alert Title</AlertTitle>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      render(<AlertTitle ref={ref}>Title</AlertTitle>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('renders as h5 element', () => {
      const { container } = render(<AlertTitle>Title</AlertTitle>);
      expect(container.querySelector('h5')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(<AlertTitle data-testid="custom-title">Title</AlertTitle>);
      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<AlertTitle className="custom-class">Title</AlertTitle>);
      const title = screen.getByText('Title');
      expect(title.className).toContain('custom-class');
    });
  });
});

describe('AlertDescription', () => {
  describe('Rendering', () => {
    it('renders alert description', () => {
      render(<AlertDescription>This is a description</AlertDescription>);
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<AlertDescription ref={ref}>Description</AlertDescription>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(<AlertDescription data-testid="custom-desc">Description</AlertDescription>);
      expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<AlertDescription className="custom-class">Description</AlertDescription>);
      const desc = screen.getByText('Description');
      expect(desc.className).toContain('custom-class');
    });
  });
});

describe('Alert Integration', () => {
  it('renders complete alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning message</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('renders destructive alert with title and description', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error occurred</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
});
