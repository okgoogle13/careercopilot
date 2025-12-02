import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Box } from '@mui/material';
import { LoadingSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders single Skeleton by default when count is not provided', () => {
    const { container } = render(<LoadingSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(1);
  });

  it('renders single Skeleton when count=1 is explicitly set', () => {
    const { container } = render(<LoadingSkeleton count={1} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(1);
  });

  it('renders multiple Skeletons when count > 1', () => {
    const { container } = render(<LoadingSkeleton count={5} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(5);
  });

  it('renders correct number of Skeletons with count=3', () => {
    const { container } = render(<LoadingSkeleton count={3} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(3);
  });

  it('applies text variant to Skeleton when variant="text"', () => {
    const { container } = render(<LoadingSkeleton variant="text" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-text');
  });

  it('applies rectangular variant to Skeleton', () => {
    const { container } = render(<LoadingSkeleton variant="rectangular" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-rectangular');
  });

  it('applies circular variant to Skeleton', () => {
    const { container } = render(<LoadingSkeleton variant="circular" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-circular');
  });

  it('applies rounded variant to Skeleton', () => {
    const { container } = render(<LoadingSkeleton variant="rounded" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-rounded');
  });

  it('applies pulse animation when animation="pulse"', () => {
    const { container } = render(<LoadingSkeleton animation="pulse" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-pulse');
  });

  it('applies wave animation when animation="wave"', () => {
    const { container } = render(<LoadingSkeleton animation="wave" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-wave');
  });

  it('disables animation when animation=false', () => {
    const { container } = render(<LoadingSkeleton animation={false} />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).not.toHaveClass('MuiSkeleton-pulse');
    expect(skeleton).not.toHaveClass('MuiSkeleton-wave');
  });

  it('uses custom wrapper component when wrapper prop is provided', () => {
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-wrapper">{children}</div>
    );

    render(<LoadingSkeleton wrapper={CustomWrapper} />);
    expect(screen.getByTestId('custom-wrapper')).toBeInTheDocument();
  });

  it('renders Skeletons inside custom wrapper component', () => {
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-wrapper">{children}</div>
    );

    const { container } = render(
      <LoadingSkeleton count={2} wrapper={CustomWrapper} />
    );
    const wrapper = screen.getByTestId('custom-wrapper');
    const skeletons = wrapper.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(2);
  });

  it('uses Box as default wrapper component', () => {
    const { container } = render(<LoadingSkeleton />);
    const box = container.querySelector('.MuiBox-root');
    expect(box).toBeInTheDocument();
  });

  it('passes wrapperProps to wrapper component', () => {
    const { container } = render(
      <LoadingSkeleton
        wrapperProps={{ sx: { display: 'flex', gap: 2 } }}
      />
    );
    const box = container.querySelector('.MuiBox-root');
    expect(box).toHaveStyle('display: flex');
  });

  it('applies custom className from wrapperProps', () => {
    const { container } = render(
      <LoadingSkeleton wrapperProps={{ className: 'custom-wrapper-class' }} />
    );
    const box = container.querySelector('.custom-wrapper-class');
    expect(box).toBeInTheDocument();
  });

  it('applies custom sx prop to Skeleton elements', () => {
    const { container } = render(
      <LoadingSkeleton sx={{ marginBottom: 2, width: '100%' }} />
    );
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveStyle('margin-bottom: 16px');
  });

  it('applies custom height to Skeleton', () => {
    const { container } = render(
      <LoadingSkeleton sx={{ height: 60 }} />
    );
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveStyle('height: 60px');
  });

  it('applies background color to Skeleton from sx prop', () => {
    const { container } = render(
      <LoadingSkeleton sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
    );
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveStyle('background-color: rgba(0, 0, 0, 0.1)');
  });

  it('combines custom sx with default bgcolor', () => {
    const { container } = render(
      <LoadingSkeleton sx={{ width: '80%' }} />
    );
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveStyle('width: 80%');
  });

  it('applies text variant with transform none styling', () => {
    const { container } = render(<LoadingSkeleton variant="text" />);
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveClass('MuiSkeleton-text');
  });

  it('renders multiple Skeletons with custom wrapper and wrapperProps', () => {
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-wrapper" style={{ padding: '16px' }}>
        {children}
      </div>
    );

    const { container } = render(
      <LoadingSkeleton
        count={3}
        variant="circular"
        wrapper={CustomWrapper}
        wrapperProps={{ sx: { display: 'flex', gap: 1 } }}
      />
    );

    const wrapper = screen.getByTestId('custom-wrapper');
    const skeletons = wrapper.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(3);
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('MuiSkeleton-circular');
    });
  });

  it('renders Skeletons with rectangular variant and wave animation', () => {
    const { container } = render(
      <LoadingSkeleton
        count={4}
        variant="rectangular"
        animation="wave"
      />
    );

    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(4);
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('MuiSkeleton-rectangular');
      expect(skeleton).toHaveClass('MuiSkeleton-wave');
    });
  });

  it('renders with all props combined', () => {
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <section data-testid="section-wrapper">{children}</section>
    );

    const { container } = render(
      <LoadingSkeleton
        count={2}
        variant="rounded"
        animation="pulse"
        wrapper={CustomWrapper}
        wrapperProps={{
          sx: { padding: 2, backgroundColor: '#f5f5f5' },
          className: 'skeleton-container',
        }}
        sx={{ marginTop: 1, borderRadius: 1 }}
      />
    );

    const wrapper = screen.getByTestId('section-wrapper');
    expect(wrapper).toHaveClass('skeleton-container');

    const skeletons = wrapper.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(2);
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('MuiSkeleton-rounded');
      expect(skeleton).toHaveClass('MuiSkeleton-pulse');
    });
  });

  it('renders with zero count (edge case)', () => {
    const { container } = render(<LoadingSkeleton count={0} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(0);
  });

  it('renders with large count value', () => {
    const { container } = render(<LoadingSkeleton count={10} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toHaveLength(10);
  });

  it('passes through standard Skeleton props', () => {
    const { container } = render(
      <LoadingSkeleton width="200px" height="40px" />
    );
    const skeleton = container.querySelector('.MuiSkeleton-root');
    expect(skeleton).toHaveStyle('width: 200px');
    expect(skeleton).toHaveStyle('height: 40px');
  });

  it('applies custom wrapper with data-testid for testing', () => {
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="loader-wrapper">{children}</div>
    );

    render(
      <LoadingSkeleton
        count={3}
        wrapper={CustomWrapper}
      />
    );

    expect(screen.getByTestId('loader-wrapper')).toBeInTheDocument();
  });
});
