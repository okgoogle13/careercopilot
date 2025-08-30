import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
  expect(handleClick).toHaveBeenCalled();
  });
});
