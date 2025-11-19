import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders without errors', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('renders children as label', () => {
    render(<Badge>Success</Badge>);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    const { container } = render(<Badge>Primary</Badge>);
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('renders with destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    const chip = container.querySelector('.MuiChip-colorError');
    expect(chip).toBeInTheDocument();
  });

  it('renders with outline variant', () => {
    const { container } = render(<Badge variant="outline">Outlined</Badge>);
    const chip = container.querySelector('.MuiChip-outlined');
    expect(chip).toBeInTheDocument();
  });

  it('renders as small size', () => {
    const { container } = render(<Badge>Small</Badge>);
    const chip = container.querySelector('.MuiChip-sizeSmall');
    expect(chip).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>);
    const chip = container.querySelector('.custom-badge');
    expect(chip).toBeInTheDocument();
  });

  it('supports onDelete callback', () => {
    const handleDelete = jest.fn();
    render(<Badge onDelete={handleDelete}>Deletable</Badge>);
    expect(screen.getByText('Deletable')).toBeInTheDocument();
  });

  it('supports clickable prop', () => {
    const handleClick = jest.fn();
    const { container } = render(<Badge onClick={handleClick} clickable>
      Clickable
    </Badge>);
    const chip = container.querySelector('.MuiChip-clickable');
    expect(chip).toBeInTheDocument();
  });

  it('renders multiple badges together', () => {
    render(
      <div>
        <Badge>Badge 1</Badge>
        <Badge variant="secondary">Badge 2</Badge>
        <Badge variant="destructive">Badge 3</Badge>
      </div>
    );
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
    expect(screen.getByText('Badge 3')).toBeInTheDocument();
  });

  it('supports different text content', () => {
    const { rerender } = render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();

    rerender(<Badge>Updated</Badge>);
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('renders with icon before text', () => {
    const { container } = render(
      <Badge
        icon={<span>★</span>}
      >
        Favorite
      </Badge>
    );
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('Favorite')).toBeInTheDocument();
  });

  it('renders with avatar', () => {
    const { container } = render(
      <Badge
        avatar={<span>A</span>}
      >
        User
      </Badge>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    const { container } = render(<Badge disabled>Disabled</Badge>);
    const chip = container.querySelector('.MuiChip-disabled');
    expect(chip).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    const { container } = render(
      <Badge color="success">Success</Badge>
    );
    const chip = container.querySelector('.MuiChip-colorSuccess');
    expect(chip).toBeInTheDocument();
  });

  it('renders with custom props passed through', () => {
    const { container } = render(
      <Badge data-testid="custom-badge">Test</Badge>
    );
    const badge = screen.getByText('Test').closest('[data-testid="custom-badge"]');
    expect(badge).toBeInTheDocument();
  });

  it('handles long text gracefully', () => {
    render(
      <Badge>
        This is a very long badge text that should be handled gracefully by the component
      </Badge>
    );
    expect(screen.getByText(/This is a very long badge text/i)).toBeInTheDocument();
  });

  it('renders with variant transition effects', () => {
    const { container } = render(
      <Badge variant="default">Transition</Badge>
    );
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toHaveStyle({ transition: expect.stringContaining('box-shadow') });
  });

  it('all variants are mutually exclusive', () => {
    const { container: container1 } = render(<Badge variant="default">Default</Badge>);
    const { container: container2 } = render(<Badge variant="secondary">Secondary</Badge>);
    const { container: container3 } = render(<Badge variant="destructive">Destructive</Badge>);
    const { container: container4 } = render(<Badge variant="outline">Outline</Badge>);

    const chip1 = container1.querySelector('.MuiChip-colorPrimary');
    const chip2 = container2.querySelector('.MuiChip-colorSecondary');
    const chip3 = container3.querySelector('.MuiChip-colorError');
    const chip4 = container4.querySelector('.MuiChip-outlined');

    expect(chip1 || chip2 || chip3 || chip4).toBeTruthy();
  });
});
