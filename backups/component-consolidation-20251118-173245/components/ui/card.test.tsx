import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './card';

describe('Card', () => {
  it('renders without errors', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with elevation variant', () => {
    const { container } = render(<Card variant="elevation">Elevated Card</Card>);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders with outlined variant', () => {
    const { container } = render(<Card variant="outlined">Outlined Card</Card>);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders with selected variant', () => {
    const { container } = render(<Card variant="selected">Selected Card</Card>);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders with interactive variant', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    const { container } = render(
      <Card variant="interactive" onClick={handleClick}>
        Interactive Card
      </Card>
    );

    const card = container.querySelector('.MuiCard-root');
    await user.click(card!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('CardContent', () => {
  it('renders without errors', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.querySelector('.MuiCardContent-root');
    expect(content).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<CardContent>Test Content</CardContent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('works within a Card', () => {
    render(
      <Card>
        <CardContent>Nested Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders without errors', () => {
    const { container } = render(<CardHeader title="Header" />);
    const header = container.querySelector('.MuiCardHeader-root');
    expect(header).toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(<CardHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with subheader', () => {
    render(<CardHeader title="Title" subheader="Subtitle" />);
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders with avatar', () => {
    const { container } = render(
      <CardHeader title="Title" avatar={<div>Avatar</div>} />
    );
    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renders without errors', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
  });

  it('renders text correctly', () => {
    render(<CardTitle>Test Title</CardTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('has correct heading level', () => {
    render(<CardTitle>Heading</CardTitle>);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });
});

describe('CardDescription', () => {
  it('renders without errors', () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders text correctly', () => {
    render(<CardDescription>Test Description</CardDescription>);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('has secondary text color', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.querySelector('.MuiTypography-root');
    expect(description).toHaveClass('MuiTypography-colorTextSecondary');
  });
});

describe('CardFooter', () => {
  it('renders without errors', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.querySelector('.MuiCardActions-root');
    expect(footer).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('works as part of complete card', () => {
    render(
      <Card>
        <CardHeader title="Title" />
        <CardContent>Content</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});

describe('Complete Card Structure', () => {
  it('renders complete card with all parts', () => {
    render(
      <Card>
        <CardHeader title="Card Title" />
        <CardContent>
          <CardTitle>Subtitle</CardTitle>
          <CardDescription>Description text</CardDescription>
          <p>Main content</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Action Button/i })).toBeInTheDocument();
  });

  it('handles interactive card with content', async () => {
    const user = userEvent.setup();
    const handleCardClick = jest.fn();
    const handleButtonClick = jest.fn();

    render(
      <Card variant="interactive" onClick={handleCardClick}>
        <CardContent>
          <p>Clickable content</p>
          <button onClick={handleButtonClick}>Inner Button</button>
        </CardContent>
      </Card>
    );

    const button = screen.getByRole('button', { name: /Inner Button/i });
    await user.click(button);

    expect(handleButtonClick).toHaveBeenCalled();
  });
});
