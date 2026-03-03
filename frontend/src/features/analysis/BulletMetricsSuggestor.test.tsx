import { render, screen, fireEvent } from '@testing-library/react';
import { BulletMetricsSuggestor } from './BulletMetricsSuggestor';
import type { ImprovedBullet } from '../../services/aiInterface';

const sampleBullets: ImprovedBullet[] = [
  {
    original: 'Led development of REST APIs',
    improved: 'Led development of 12 REST API endpoints serving 50K daily requests',
    metric_type: 'number',
    rationale: 'Concrete scale demonstrates technical impact.',
  },
  {
    original: 'Improved deployment pipeline',
    improved: 'Improved deployment pipeline, reducing release time by 40%',
    metric_type: 'percentage',
    rationale: 'Percentage reduction quantifies the efficiency gain.',
  },
];

describe('BulletMetricsSuggestor', () => {
  it('renders the component with header', () => {
    render(
      <BulletMetricsSuggestor
        bullets={[]}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    expect(screen.getByText('Bullet Metrics Suggestions')).toBeInTheDocument();
  });

  it('renders the Suggest Metrics button', () => {
    render(
      <BulletMetricsSuggestor
        bullets={[]}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    expect(screen.getByTestId('suggest-metrics-btn')).toBeInTheDocument();
    expect(screen.getByTestId('suggest-metrics-btn')).not.toBeDisabled();
  });

  it('calls onSuggestMetrics when the button is clicked', () => {
    const onSuggestMetrics = jest.fn();
    render(
      <BulletMetricsSuggestor
        bullets={[]}
        onSuggestMetrics={onSuggestMetrics}
        loading={false}
      />
    );
    fireEvent.click(screen.getByTestId('suggest-metrics-btn'));
    expect(onSuggestMetrics).toHaveBeenCalledTimes(1);
  });

  it('disables the button and shows loader when loading', () => {
    render(
      <BulletMetricsSuggestor
        bullets={[]}
        onSuggestMetrics={jest.fn()}
        loading={true}
      />
    );
    const btn = screen.getByTestId('suggest-metrics-btn');
    expect(btn).toBeDisabled();
    expect(screen.getByText('Enhancing…')).toBeInTheDocument();
  });

  it('shows the empty state when no bullets are provided', () => {
    render(
      <BulletMetricsSuggestor
        bullets={[]}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    expect(screen.getByText(/generate quantifiable rewrites/i)).toBeInTheDocument();
  });

  it('does not show the empty state when bullets are present', () => {
    render(
      <BulletMetricsSuggestor
        bullets={sampleBullets}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    // Empty-state text should not be visible
    expect(screen.queryByText(/Click.*Suggest Metrics/i)).not.toBeInTheDocument();
  });

  it('renders a card for each bullet', () => {
    render(
      <BulletMetricsSuggestor
        bullets={sampleBullets}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    expect(screen.getByTestId('bullet-card-0')).toBeInTheDocument();
    expect(screen.getByTestId('bullet-card-1')).toBeInTheDocument();
  });

  it('shows original and improved text in each bullet card', () => {
    render(
      <BulletMetricsSuggestor
        bullets={sampleBullets}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    expect(screen.getByText('Led development of REST APIs')).toBeInTheDocument();
    expect(screen.getByText(/50K daily requests/)).toBeInTheDocument();
  });

  it('shows the metric-type badge for each bullet', () => {
    render(
      <BulletMetricsSuggestor
        bullets={sampleBullets}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    const badges = screen.getAllByTestId('metric-badge');
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent('NUMBER');
    expect(badges[1]).toHaveTextContent('PERCENTAGE');
  });

  it('shows the rationale text', () => {
    render(
      <BulletMetricsSuggestor
        bullets={sampleBullets}
        onSuggestMetrics={jest.fn()}
        loading={false}
      />
    );
    expect(screen.getByText(/Concrete scale demonstrates/)).toBeInTheDocument();
  });
});
