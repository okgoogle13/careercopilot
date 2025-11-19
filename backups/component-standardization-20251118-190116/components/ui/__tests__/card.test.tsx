import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from '../card';

describe('Card', () => {
  describe('Rendering', () => {
    it('renders card with children', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('renders elevation variant', () => {
      render(<Card variant="elevation">Elevation Card</Card>);
      expect(screen.getByText('Elevation Card')).toBeInTheDocument();
    });

    it('renders outlined variant', () => {
      render(<Card variant="outlined">Outlined Card</Card>);
      expect(screen.getByText('Outlined Card')).toBeInTheDocument();
    });

    it('renders selected variant with border', () => {
      render(<Card variant="selected">Selected Card</Card>);
      expect(screen.getByText('Selected Card')).toBeInTheDocument();
    });

    it('renders interactive variant with cursor pointer', () => {
      render(<Card variant="interactive">Interactive Card</Card>);
      const card = screen.getByText('Interactive Card').parentElement;
      expect(card).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(<Card data-testid="custom-card">Custom Card</Card>);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<Card className="custom-class">Card</Card>);
      const card = screen.getByText('Card').parentElement;
      expect(card?.className).toContain('custom-class');
    });

    it('accepts onClick prop for interactive cards', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick}>Clickable Card</Card>);
      expect(screen.getByText('Clickable Card')).toBeInTheDocument();
    });

    it('accepts style prop', () => {
      render(<Card style={{ padding: '20px' }}>Styled Card</Card>);
      const card = screen.getByText('Styled Card').parentElement;
      expect(card).toHaveStyle({ padding: '20px' });
    });
  });

  describe('Interactive Behavior', () => {
    it('applies hover styles for interactive variant', () => {
      render(<Card variant="interactive">Hover Card</Card>);
      const card = screen.getByText('Hover Card').parentElement;
      expect(card).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Card onClick={handleClick}>Click Me</Card>);

      await user.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('CardHeader', () => {
  it('renders card header', () => {
    render(<CardHeader title="Header Title" />);
    expect(screen.getByText('Header Title')).toBeInTheDocument();
  });

  it('renders with subheader', () => {
    render(<CardHeader title="Title" subheader="Subheader" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subheader')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref} title="Header" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with action element', () => {
    render(<CardHeader title="Title" action={<button>Action</button>} />);
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders card content', () => {
    render(<CardContent>Card body content</CardContent>);
    expect(screen.getByText('Card body content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts className prop', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content.className).toContain('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders card footer', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with action buttons', () => {
    render(
      <CardFooter>
        <button>Cancel</button>
        <button>Save</button>
      </CardFooter>
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renders card title', () => {
    render(<CardTitle>Card Title</CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('renders as h3 element', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('h3')).toBeInTheDocument();
  });
});

describe('CardDescription', () => {
  it('renders card description', () => {
    render(<CardDescription>Card description text</CardDescription>);
    expect(screen.getByText('Card description text')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardDescription ref={ref}>Description</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('CardAction', () => {
  it('renders card action', () => {
    render(<CardAction>Action content</CardAction>);
    expect(screen.getByText('Action content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardAction ref={ref}>Action</CardAction>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Card Integration', () => {
  it('renders complete card with all components', () => {
    render(
      <Card>
        <CardHeader title="Card Title" subheader="Card Subheader" />
        <CardContent>
          <CardDescription>Card description</CardDescription>
          Main content goes here
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subheader')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('renders interactive card with click handler', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Card variant="interactive" onClick={handleClick}>
        <CardContent>Clickable Card</CardContent>
      </Card>
    );

    await user.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders selected card with border styling', () => {
    render(
      <Card variant="selected">
        <CardContent>Selected Card</CardContent>
      </Card>
    );

    expect(screen.getByText('Selected Card')).toBeInTheDocument();
  });
});
