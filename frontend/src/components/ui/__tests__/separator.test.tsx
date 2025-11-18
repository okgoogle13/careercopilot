import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { Separator } from '../separator';

describe('Separator', () => {
  it('renders without crashing', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders horizontal by default', () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('hr');
    expect(separator).toHaveClass('MuiDivider-root');
  });

  it('renders vertical when specified', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('hr');
    expect(separator).toHaveClass('MuiDivider-vertical');
  });

  it('accepts className prop', () => {
    const { container } = render(<Separator className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has separator role', () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('hr');
    expect(separator).toBeInTheDocument();
  });
});
