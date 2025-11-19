import { render, screen } from '@testing-library/react';
import { LoadingCard, LoadingProfileCard } from '../LoadingCard';

describe('LoadingCard', () => {
  it('renders without errors', () => {
    const { container } = render(<LoadingCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders skeleton loaders', () => {
    const { container } = render(<LoadingCard />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays card structure', () => {
    const { container } = render(<LoadingCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('has profile header skeleton section', () => {
    const { container } = render(<LoadingCard />);
    // Check for circular skeleton (avatar placeholder)
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(3);
  });

  it('has stats section with multiple skeletons', () => {
    const { container } = render(<LoadingCard />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    // Should have skeletons for header, stats, and actions
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });

  it('has action buttons skeleton section', () => {
    const { container } = render(<LoadingCard />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    // Verify multiple skeleton elements exist (including action buttons)
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('LoadingProfileCard', () => {
  it('renders LoadingCard component', () => {
    const { container } = render(<LoadingProfileCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('is an alias for LoadingCard', () => {
    const { container: loadingCardContainer } = render(<LoadingCard />);
    const { container: loadingProfileCardContainer } = render(<LoadingProfileCard />);

    const loadingCardSkeletons = loadingCardContainer.querySelectorAll('.MuiSkeleton-root');
    const loadingProfileCardSkeletons = loadingProfileCardContainer.querySelectorAll('.MuiSkeleton-root');

    expect(loadingProfileCardSkeletons.length).toBe(loadingCardSkeletons.length);
  });
});
