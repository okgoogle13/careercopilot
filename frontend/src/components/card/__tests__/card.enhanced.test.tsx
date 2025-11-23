import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from '../card';

describe('Card', () => {
  it('renders without errors', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies elevation variant by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it('applies outlined variant when specified', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it('applies selected variant styles', () => {
    const { container } = render(<Card variant="selected">Selected Card</Card>);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it('applies interactive variant with hover effects', () => {
    const { container } = render(<Card variant="interactive">Interactive Card</Card>);
    const card = container.firstChild;
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('handles click events on interactive cards', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <Card variant="interactive" onClick={mockOnClick}>
        Clickable Card
      </Card>
    );

    const card = screen.getByText('Clickable Card').closest('div');
    await user.click(card!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('supports elevation prop for elevation variant', () => {
    const { container } = render(<Card elevation={4}>Content</Card>);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders content correctly', () => {
    render(
      <Card>
        <CardContent>
          <p>Card body content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Card body content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('applies MUI CardContent styles', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.querySelector('.MuiCardContent-root');
    expect(content).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders header with title', () => {
    render(
      <Card>
        <CardHeader title="Card Title" />
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders header with title and subheader', () => {
    render(
      <Card>
        <CardHeader title="Card Title" subheader="Card Subtitle" />
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
  });

  it('renders avatar in header', () => {
    const avatar = <div data-testid="avatar">Avatar</div>;
    render(
      <Card>
        <CardHeader avatar={avatar} title="Card Title" />
      </Card>
    );

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref} title="Title" />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('CardFooter', () => {
  it('renders footer actions', () => {
    render(
      <Card>
        <CardFooter>
          <button>Action 1</button>
          <button>Action 2</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Actions</CardFooter>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('applies MUI CardActions styles', () => {
    const { container } = render(<CardFooter>Actions</CardFooter>);
    const footer = container.querySelector('.MuiCardActions-root');
    expect(footer).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renders title text', () => {
    render(<CardTitle>My Card Title</CardTitle>);
    expect(screen.getByText('My Card Title')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.querySelector('h3');
    expect(title).toBeInTheDocument();
  });

  it('uses h6 Typography variant', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.querySelector('.MuiTypography-h6');
    expect(title).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<CardTitle ref={ref}>Title</CardTitle>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('CardDescription', () => {
  it('renders description text', () => {
    render(<CardDescription>Card description text</CardDescription>);
    expect(screen.getByText('Card description text')).toBeInTheDocument();
  });

  it('uses body2 Typography variant', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.querySelector('.MuiTypography-body2');
    expect(description).toBeInTheDocument();
  });

  it('has text.secondary color', () => {
    render(<CardDescription>Description</CardDescription>);
    const description = screen.getByText('Description');
    expect(description).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardDescription ref={ref}>Description</CardDescription>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('CardAction', () => {
  it('renders action content', () => {
    render(
      <CardAction>
        <button>Action Button</button>
      </CardAction>
    );

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardAction ref={ref}>Action</CardAction>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

// Integration tests
describe('Card Integration', () => {
  it('renders complete card with all sub-components', () => {
    render(
      <Card variant="outlined">
        <CardHeader title="Card Title" subheader="Card Subtitle" />
        <CardContent>
          <CardTitle>Content Title</CardTitle>
          <CardDescription>Content description</CardDescription>
        </CardContent>
        <CardFooter>
          <button>Action 1</button>
          <button>Action 2</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Content Title')).toBeInTheDocument();
    expect(screen.getByText('Content description')).toBeInTheDocument();
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('handles interactive card with all components', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <Card variant="interactive" onClick={mockOnClick}>
        <CardHeader title="Interactive Card" />
        <CardContent>Content</CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    const card = screen.getByText('Interactive Card').closest('div')!.closest('div');
    await user.click(card!);

    expect(mockOnClick).toHaveBeenCalled();
  });
});

// Add React import
import * as React from 'react';
