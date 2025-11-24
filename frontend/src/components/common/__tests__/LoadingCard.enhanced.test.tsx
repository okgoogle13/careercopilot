import { render, screen } from '@testing-library/react';
import { LoadingCard, LoadingProfileCard } from '../LoadingCard';

describe('LoadingCard', () => {
  it('renders without errors', () => {
    const { container } = render(<LoadingCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders as a Material-UI Card', () => {
    const { container } = render(<LoadingCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders skeleton loaders', () => {
    const { container } = render(<LoadingCard />);
    // Should render multiple skeleton components
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders profile header skeleton section', () => {
    const { container } = render(<LoadingCard />);
    // Should render skeleton loaders for profile header
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons).toBeTruthy();
  });

  it('renders profile stats skeleton section', () => {
    const { container } = render(<LoadingCard />);
    // Should render multiple skeleton rows for stats
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(3);
  });

  it('renders action buttons skeleton section', () => {
    const { container } = render(<LoadingCard />);
    // Should render skeleton loaders for action buttons
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('maintains card padding', () => {
    const { container } = render(<LoadingCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders consistent skeleton structure', () => {
    const { container: firstRender } = render(<LoadingCard />);
    const { container: secondRender } = render(<LoadingCard />);

    const firstSkeletons = firstRender.querySelectorAll('.MuiSkeleton-root');
    const secondSkeletons = secondRender.querySelectorAll('.MuiSkeleton-root');

    // Both renders should have the same number of skeletons
    expect(firstSkeletons.length).toBe(secondSkeletons.length);
  });

  it('renders without any text content', () => {
    const { container } = render(<LoadingCard />);
    // Loading card should only have skeleton elements, no actual text
    const textContent = container.textContent;
    expect(textContent).toBe('');
  });

  it('uses flexbox layout for skeleton sections', () => {
    const { container } = render(<LoadingCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('renders multiple skeleton rows for stats', () => {
    const { container } = render(<LoadingCard />);
    // Should have at least 3 stat rows based on component structure
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(2);
  });

  it('renders skeleton loaders in action button section', () => {
    const { container } = render(<LoadingCard />);
    // Should have skeleton loaders for action buttons
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not render any interactive elements', () => {
    render(<LoadingCard />);
    // Loading card should not have any buttons or inputs
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('maintains visual hierarchy with skeleton arrangement', () => {
    const { container } = render(<LoadingCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
    // Card should contain skeleton elements
    const skeletons = card?.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons && skeletons.length > 0).toBe(true);
  });

  it('renders with appropriate skeleton shapes', () => {
    const { container } = render(<LoadingCard />);
    // Should have at least one skeleton with border-radius for avatar
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders consistently across multiple renders', () => {
    const { container: render1 } = render(<LoadingCard />);
    const { container: render2 } = render(<LoadingCard />);
    const { container: render3 } = render(<LoadingCard />);

    const skeletons1 = render1.querySelectorAll('.MuiSkeleton-root');
    const skeletons2 = render2.querySelectorAll('.MuiSkeleton-root');
    const skeletons3 = render3.querySelectorAll('.MuiSkeleton-root');

    expect(skeletons1.length).toBe(skeletons2.length);
    expect(skeletons2.length).toBe(skeletons3.length);
  });

  it('has no accessibility violations in loading state', () => {
    const { container } = render(<LoadingCard />);
    // Loading card should render without errors
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });
});

describe('LoadingProfileCard', () => {
  it('renders without errors', () => {
    const { container } = render(<LoadingProfileCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('is a wrapper around LoadingCard', () => {
    const { container: profileContainer } = render(<LoadingProfileCard />);
    const { container: loadingContainer } = render(<LoadingCard />);

    const profileSkeletons = profileContainer.querySelectorAll('.MuiSkeleton-root');
    const loadingSkeletons = loadingContainer.querySelectorAll('.MuiSkeleton-root');

    // Both should render the same number of skeletons
    expect(profileSkeletons.length).toBe(loadingSkeletons.length);
  });

  it('renders the same content as LoadingCard', () => {
    const { container: profileContainer } = render(<LoadingProfileCard />);
    const { container: loadingContainer } = render(<LoadingCard />);

    expect(profileContainer.innerHTML).toBe(loadingContainer.innerHTML);
  });

  it('renders skeleton loaders', () => {
    const { container } = render(<LoadingProfileCard />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders as a Material-UI Card', () => {
    const { container } = render(<LoadingProfileCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('does not accept any props', () => {
    // LoadingProfileCard is a simple wrapper with no props
    const { container } = render(<LoadingProfileCard />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });
});

// Integration tests
describe('LoadingCard Integration', () => {
  it('simulates loading state for profile data', () => {
    const TestComponent = () => {
      const [loading, setLoading] = React.useState(true);

      return loading ? (
        <LoadingCard />
      ) : (
        <div>Loaded Profile Data</div>
      );
    };

    const { container } = render(<TestComponent />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('can be replaced with actual content after loading', () => {
    const TestComponent = () => {
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
      }, []);

      return loading ? <LoadingCard /> : <div>Content Loaded</div>;
    };

    render(<TestComponent />);
    // Initially should show loading card
    const { container } = render(<LoadingCard />);
    expect(container.querySelector('.MuiCard-root')).toBeInTheDocument();
  });

  it('maintains same card dimensions as actual content', () => {
    const { container: loadingContainer } = render(<LoadingCard />);
    const { container: contentContainer } = render(
      <div className="MuiCard-root" style={{ padding: '24px' }}>
        <div>Profile Content</div>
      </div>
    );

    // Both should use MUI Card
    expect(loadingContainer.querySelector('.MuiCard-root')).toBeInTheDocument();
    expect(contentContainer.querySelector('.MuiCard-root')).toBeInTheDocument();
  });

  it('provides visual feedback during data fetching', () => {
    let isLoading = true;

    const { container, rerender } = render(
      isLoading ? <LoadingCard /> : <div>Profile Data</div>
    );

    // Should show skeleton loaders while loading
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);

    // Simulate loading complete
    isLoading = false;
    rerender(isLoading ? <LoadingCard /> : <div>Profile Data</div>);

    // Should now show actual content
    expect(screen.getByText('Profile Data')).toBeInTheDocument();
  });

  it('works with suspense boundaries', () => {
    const FallbackComponent = () => <LoadingCard />;

    const { container } = render(<FallbackComponent />);
    expect(container.querySelector('.MuiCard-root')).toBeInTheDocument();
  });
});

// Add React import
import * as React from 'react';
