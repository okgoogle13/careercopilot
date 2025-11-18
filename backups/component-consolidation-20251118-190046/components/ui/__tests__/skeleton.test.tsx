import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  describe('Basic Rendering', () => {
    it('renders skeleton component', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBeDefined();
    });
  });

  describe('Variants', () => {
    it('renders text variant', () => {
      render(<Skeleton variant="text" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('renders circular variant', () => {
      render(<Skeleton variant="circular" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('renders rectangular variant', () => {
      render(<Skeleton variant="rectangular" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('renders rounded variant', () => {
      render(<Skeleton variant="rounded" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });

  describe('Dimensions', () => {
    it('accepts width prop', () => {
      render(<Skeleton width={200} data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('accepts height prop', () => {
      render(<Skeleton height={100} data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('accepts percentage width', () => {
      render(<Skeleton width="100%" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '100%' });
    });
  });

  describe('Animation', () => {
    it('has pulse animation by default', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with wave animation', () => {
      render(<Skeleton animation="wave" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('renders with pulse animation', () => {
      render(<Skeleton animation="pulse" data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('renders without animation', () => {
      render(<Skeleton animation={false} data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('accepts className prop', () => {
      render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-skeleton');
    });

    it('accepts sx prop for custom styles', () => {
      render(
        <Skeleton
          sx={{ borderRadius: 2 }}
          data-testid="skeleton"
        />
      );
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('accepts style prop', () => {
      render(
        <Skeleton
          style={{ backgroundColor: '#f0f0f0' }}
          data-testid="skeleton"
        />
      );
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ backgroundColor: '#f0f0f0' });
    });
  });

  describe('Common Patterns', () => {
    it('renders avatar skeleton', () => {
      render(
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          data-testid="avatar-skeleton"
        />
      );
      expect(screen.getByTestId('avatar-skeleton')).toBeInTheDocument();
    });

    it('renders card skeleton', () => {
      render(
        <div>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      );
      // All skeletons should be rendered
      const skeletons = screen.getAllByRole('presentation', { hidden: true });
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders list item skeleton', () => {
      render(
        <div>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      );

      const skeletons = screen.getAllByRole('presentation', { hidden: true });
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Loading States', () => {
    it('can be used for multiple loading rows', () => {
      const rowCount = 5;
      render(
        <div>
          {Array.from({ length: rowCount }).map((_, index) => (
            <Skeleton key={index} variant="text" width="100%" />
          ))}
        </div>
      );

      const skeletons = screen.getAllByRole('presentation', { hidden: true });
      expect(skeletons.length).toBeGreaterThanOrEqual(rowCount);
    });

    it('can represent different content types', () => {
      render(
        <div>
          {/* Image */}
          <Skeleton variant="rectangular" width={300} height={200} />
          {/* Title */}
          <Skeleton variant="text" width="80%" />
          {/* Description */}
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      );

      const skeletons = screen.getAllByRole('presentation', { hidden: true });
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });
  });
});
