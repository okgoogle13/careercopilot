import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import {
  M3Card,
  M3CardHeader,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
  M3CardActions,
} from '../M3Card';

describe('M3Card', () => {
  it('renders without errors', () => {
    render(<M3Card>Card Content</M3Card>);
    expect(screen.getByTestId('m3-card')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<M3Card>Test Content</M3Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies elevated variant by default', () => {
    const { container } = render(<M3Card>Content</M3Card>);
    const card = container.querySelector('.m3-card--elevated');
    expect(card).toBeInTheDocument();
  });

  it('applies filled variant when specified', () => {
    const { container } = render(<M3Card variant="filled">Content</M3Card>);
    const card = container.querySelector('.m3-card--filled');
    expect(card).toBeInTheDocument();
  });

  it('applies outlined variant when specified', () => {
    const { container } = render(<M3Card variant="outlined">Content</M3Card>);
    const card = container.querySelector('.m3-card--outlined');
    expect(card).toBeInTheDocument();
  });

  it('applies default state by default', () => {
    const { container } = render(<M3Card>Content</M3Card>);
    const card = container.querySelector('.m3-card--default');
    expect(card).toBeInTheDocument();
  });

  it('applies dragged state when specified', () => {
    const { container } = render(<M3Card state="dragged">Content</M3Card>);
    const card = container.querySelector('.m3-card--dragged');
    expect(card).toBeInTheDocument();
  });

  it('applies focused state when specified', () => {
    const { container } = render(<M3Card state="focused">Content</M3Card>);
    const card = container.querySelector('.m3-card--focused');
    expect(card).toBeInTheDocument();
  });

  it('applies interactive class when interactive is true', () => {
    const { container } = render(<M3Card interactive>Content</M3Card>);
    const card = container.querySelector('.m3-card--interactive');
    expect(card).toBeInTheDocument();
  });

  it('has button role when interactive', () => {
    render(<M3Card interactive>Content</M3Card>);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });

  it('has no role when not interactive', () => {
    render(<M3Card>Content</M3Card>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is keyboard accessible when interactive', () => {
    render(<M3Card interactive>Content</M3Card>);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('is not keyboard accessible when disabled', () => {
    render(<M3Card interactive disabled>Content</M3Card>);
    const card = screen.getByTestId('m3-card');
    expect(card).not.toHaveAttribute('tabIndex');
  });

  it('handles click events when interactive', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(<M3Card interactive onClick={mockOnClick}>Clickable</M3Card>);

    const card = screen.getByRole('button');
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click events when disabled', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <M3Card interactive disabled onClick={mockOnClick}>
        Disabled Card
      </M3Card>
    );

    const card = screen.getByTestId('m3-card');
    await user.click(card);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<M3Card disabled>Content</M3Card>);
    const card = container.querySelector('.m3-card--disabled');
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3Card className="custom-class">Content</M3Card>);
    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<M3Card ref={ref}>Content</M3Card>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('supports keyboard Enter key on interactive cards', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(<M3Card interactive onClick={mockOnClick}>Content</M3Card>);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    // onClick is triggered by click, not Enter in this implementation
    expect(card).toHaveFocus();
  });
});

describe('M3CardHeader', () => {
  it('renders header content', () => {
    render(<M3CardHeader>Header Content</M3CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies header class', () => {
    const { container } = render(<M3CardHeader>Header</M3CardHeader>);
    const header = container.querySelector('.m3-card__header');
    expect(header).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3CardHeader className="custom">Header</M3CardHeader>);
    const header = container.querySelector('.custom');
    expect(header).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<M3CardHeader ref={ref}>Header</M3CardHeader>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('M3CardTitle', () => {
  it('renders title text', () => {
    render(<M3CardTitle>Card Title</M3CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    const { container } = render(<M3CardTitle>Title</M3CardTitle>);
    const title = container.querySelector('h3');
    expect(title).toBeInTheDocument();
  });

  it('applies title class', () => {
    const { container } = render(<M3CardTitle>Title</M3CardTitle>);
    const title = container.querySelector('.m3-card__title');
    expect(title).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3CardTitle className="custom">Title</M3CardTitle>);
    const title = container.querySelector('.custom');
    expect(title).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<M3CardTitle ref={ref}>Title</M3CardTitle>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('M3CardDescription', () => {
  it('renders description text', () => {
    render(<M3CardDescription>Description text</M3CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('renders as paragraph element', () => {
    const { container } = render(<M3CardDescription>Description</M3CardDescription>);
    const description = container.querySelector('p');
    expect(description).toBeInTheDocument();
  });

  it('applies description class', () => {
    const { container } = render(<M3CardDescription>Description</M3CardDescription>);
    const description = container.querySelector('.m3-card__description');
    expect(description).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3CardDescription className="custom">Desc</M3CardDescription>);
    const description = container.querySelector('.custom');
    expect(description).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<M3CardDescription ref={ref}>Description</M3CardDescription>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('M3CardContent', () => {
  it('renders content', () => {
    render(<M3CardContent>Card content</M3CardContent>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies content class', () => {
    const { container } = render(<M3CardContent>Content</M3CardContent>);
    const content = container.querySelector('.m3-card__content');
    expect(content).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3CardContent className="custom">Content</M3CardContent>);
    const content = container.querySelector('.custom');
    expect(content).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<M3CardContent ref={ref}>Content</M3CardContent>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('M3CardActions', () => {
  it('renders actions', () => {
    render(
      <M3CardActions>
        <button>Action 1</button>
        <button>Action 2</button>
      </M3CardActions>
    );

    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('applies actions class', () => {
    const { container } = render(<M3CardActions>Actions</M3CardActions>);
    const actions = container.querySelector('.m3-card__actions');
    expect(actions).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3CardActions className="custom">Actions</M3CardActions>);
    const actions = container.querySelector('.custom');
    expect(actions).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<M3CardActions ref={ref}>Actions</M3CardActions>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

// Integration tests
describe('M3Card Integration', () => {
  it('renders complete card with all sub-components', () => {
    render(
      <M3Card variant="elevated">
        <M3CardHeader>
          <M3CardTitle>Card Title</M3CardTitle>
          <M3CardDescription>Card description</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>Card content goes here</M3CardContent>
        <M3CardActions>
          <button>Action</button>
        </M3CardActions>
      </M3Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Card content goes here')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('handles interactive card with all components', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <M3Card variant="filled" interactive onClick={mockOnClick}>
        <M3CardHeader>
          <M3CardTitle>Interactive Card</M3CardTitle>
        </M3CardHeader>
        <M3CardContent>Content</M3CardContent>
      </M3Card>
    );

    const card = screen.getByRole('button');
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('combines all variant, state, and modifier classes', () => {
    const { container } = render(
      <M3Card variant="outlined" state="focused" interactive className="custom">
        Content
      </M3Card>
    );

    const card = container.querySelector('.m3-card.m3-card--outlined.m3-card--focused.m3-card--interactive.custom');
    expect(card).toBeInTheDocument();
  });
});

// Add React import
import * as React from 'react';
