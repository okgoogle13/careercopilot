
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-contained');
    expect(button).toHaveClass('MuiButton-containedPrimary');
    expect(button).toHaveClass('MuiButton-sizeMedium');
  });

  it('should render children correctly', () => {
    render(<Button><span>Child Span</span></Button>);
    expect(screen.getByText('Child Span')).toBeInTheDocument();
  });

  it('should apply variant, color, and size classes', () => {
    render(
      <Button variant="outlined" color="secondary" size="large">
        Styled Button
      </Button>
    );
    const button = screen.getByRole('button', { name: /styled button/i });
    expect(button).toHaveClass('MuiButton-outlined');
    expect(button).toHaveClass('MuiButton-outlinedSecondary');
    expect(button).toHaveClass('MuiButton-sizeLarge');
  });

  it('should handle onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading indicator and be disabled when loading prop is true', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render as a link when href is provided', () => {
    render(<Button href="https://example.com">Link Button</Button>);
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should apply fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveClass('MuiButton-fullWidth');
  });
});
