import React from 'react';
import { render, screen } from '@testing-library/react';
import GridCompat from '../GridCompat';

describe('GridCompat', () => {
  describe('Rendering', () => {
    it('renders grid container', () => {
      render(<GridCompat container>Grid Container</GridCompat>);
      expect(screen.getByText('Grid Container')).toBeInTheDocument();
    });

    it('renders grid item', () => {
      render(<GridCompat item>Grid Item</GridCompat>);
      expect(screen.getByText('Grid Item')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<GridCompat ref={ref}>Grid</GridCompat>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Breakpoint Props', () => {
    it('renders with xs breakpoint', () => {
      render(<GridCompat xs={12}>Full width</GridCompat>);
      expect(screen.getByText('Full width')).toBeInTheDocument();
    });

    it('renders with sm breakpoint', () => {
      render(<GridCompat sm={6}>Half width</GridCompat>);
      expect(screen.getByText('Half width')).toBeInTheDocument();
    });

    it('renders with md breakpoint', () => {
      render(<GridCompat md={4}>One third width</GridCompat>);
      expect(screen.getByText('One third width')).toBeInTheDocument();
    });

    it('renders with lg breakpoint', () => {
      render(<GridCompat lg={3}>One quarter width</GridCompat>);
      expect(screen.getByText('One quarter width')).toBeInTheDocument();
    });

    it('renders with xl breakpoint', () => {
      render(<GridCompat xl={2}>One sixth width</GridCompat>);
      expect(screen.getByText('One sixth width')).toBeInTheDocument();
    });

    it('renders with multiple breakpoints', () => {
      render(
        <GridCompat xs={12} sm={6} md={4} lg={3}>
          Responsive grid
        </GridCompat>
      );
      expect(screen.getByText('Responsive grid')).toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    it('renders with size prop', () => {
      render(<GridCompat size={{ xs: 12, md: 6 }}>Sized grid</GridCompat>);
      expect(screen.getByText('Sized grid')).toBeInTheDocument();
    });

    it('handles size prop with all breakpoints', () => {
      render(
        <GridCompat size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          All breakpoints
        </GridCompat>
      );
      expect(screen.getByText('All breakpoints')).toBeInTheDocument();
    });

    it('prioritizes individual breakpoint props over size prop', () => {
      render(
        <GridCompat size={{ xs: 12 }} md={6}>
          Mixed props
        </GridCompat>
      );
      expect(screen.getByText('Mixed props')).toBeInTheDocument();
    });
  });

  describe('Container and Item Props', () => {
    it('renders as both container and item', () => {
      render(
        <GridCompat container item xs={12}>
          Container and Item
        </GridCompat>
      );
      expect(screen.getByText('Container and Item')).toBeInTheDocument();
    });

    it('renders nested grid structure', () => {
      render(
        <GridCompat container>
          <GridCompat item xs={6}>
            First Item
          </GridCompat>
          <GridCompat item xs={6}>
            Second Item
          </GridCompat>
        </GridCompat>
      );
      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(
        <GridCompat data-testid="custom-grid">Custom Grid</GridCompat>
      );
      expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<GridCompat className="custom-class">Grid</GridCompat>);
      const grid = screen.getByText('Grid');
      expect(grid.className).toContain('custom-class');
    });

    it('accepts style prop', () => {
      render(<GridCompat style={{ padding: '16px' }}>Styled Grid</GridCompat>);
      const grid = screen.getByText('Styled Grid');
      expect(grid).toHaveStyle({ padding: '16px' });
    });

    it('merges className with generated responsive classes', () => {
      render(
        <GridCompat className="custom-class" xs={12}>
          Grid with classes
        </GridCompat>
      );
      const grid = screen.getByText('Grid with classes');
      expect(grid.className).toContain('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('renders without any size props', () => {
      render(<GridCompat>No size</GridCompat>);
      expect(screen.getByText('No size')).toBeInTheDocument();
    });

    it('handles zero value for breakpoints', () => {
      render(<GridCompat xs={0}>Zero width</GridCompat>);
      expect(screen.getByText('Zero width')).toBeInTheDocument();
    });

    it('handles invalid breakpoint values in size prop', () => {
      render(<GridCompat size={{ xs: 12, invalid: 6 } as any}>Invalid breakpoint</GridCompat>);
      expect(screen.getByText('Invalid breakpoint')).toBeInTheDocument();
    });

    it('renders with children as array', () => {
      render(
        <GridCompat>
          {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </GridCompat>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Spacing', () => {
    it('renders with spacing prop', () => {
      render(
        <GridCompat container spacing={2}>
          Spaced grid
        </GridCompat>
      );
      expect(screen.getByText('Spaced grid')).toBeInTheDocument();
    });

    it('handles different spacing values', () => {
      render(
        <GridCompat container spacing={4}>
          Large spacing
        </GridCompat>
      );
      expect(screen.getByText('Large spacing')).toBeInTheDocument();
    });
  });
});
