import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';
import { TrendingUp } from '@mui/icons-material';

describe('StatCard', () => {
  describe('Basic Rendering', () => {
    it('renders with title and value', () => {
      render(<StatCard title="Total Users" value={1234} />);

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1234')).toBeInTheDocument();
    });

    it('renders with string value', () => {
      render(<StatCard title="Revenue" value="$45.2K" />);

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$45.2K')).toBeInTheDocument();
    });

    it('renders with numeric value', () => {
      render(<StatCard title="Active Sessions" value={892} />);

      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('892')).toBeInTheDocument();
    });
  });

  describe('Subtitle', () => {
    it('renders subtitle when provided', () => {
      render(
        <StatCard
          title="Total Sales"
          value="$10,500"
          subtitle="This month"
        />
      );

      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('$10,500')).toBeInTheDocument();
      expect(screen.getByText('This month')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<StatCard title="Users" value={100} />);

      expect(screen.queryByText('This month')).not.toBeInTheDocument();
    });
  });

  describe('Icon', () => {
    it('renders with icon', () => {
      render(
        <StatCard
          title="Growth"
          value="15%"
          icon={<TrendingUp data-testid="trend-icon" />}
        />
      );

      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
    });

    it('does not render icon when not provided', () => {
      render(<StatCard title="Users" value={100} />);

      expect(screen.queryByTestId('trend-icon')).not.toBeInTheDocument();
    });
  });

  describe('Trend', () => {
    it('renders upward trend', () => {
      render(
        <StatCard
          title="Revenue"
          value="$50K"
          trend="up"
          trendValue="+12%"
        />
      );

      expect(screen.getByText(/\+12%/)).toBeInTheDocument();
      expect(screen.getByText(/↗/)).toBeInTheDocument();
    });

    it('renders downward trend', () => {
      render(
        <StatCard
          title="Expenses"
          value="$30K"
          trend="down"
          trendValue="-5%"
        />
      );

      expect(screen.getByText(/-5%/)).toBeInTheDocument();
      expect(screen.getByText(/↘/)).toBeInTheDocument();
    });

    it('renders neutral trend', () => {
      render(
        <StatCard
          title="Balance"
          value="$20K"
          trend="neutral"
          trendValue="0%"
        />
      );

      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });

    it('does not render trend when trendValue is not provided', () => {
      render(
        <StatCard
          title="Users"
          value={100}
          trend="up"
        />
      );

      expect(screen.queryByText(/↗/)).not.toBeInTheDocument();
    });

    it('renders trendValue without trend indicator when trend is not provided', () => {
      render(
        <StatCard
          title="Users"
          value={100}
          trendValue="+10%"
        />
      );

      expect(screen.getByText(/\+10%/)).toBeInTheDocument();
      expect(screen.queryByText(/↗/)).not.toBeInTheDocument();
      expect(screen.queryByText(/↘/)).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('accepts className prop', () => {
      const { container } = render(
        <StatCard
          title="Users"
          value={100}
          className="custom-stat-card"
        />
      );

      const card = container.querySelector('.custom-stat-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Complete StatCard', () => {
    it('renders all props together', () => {
      render(
        <StatCard
          title="Monthly Revenue"
          value="$45,200"
          subtitle="Last 30 days"
          icon={<TrendingUp data-testid="trend-icon" />}
          trend="up"
          trendValue="+12.5%"
          className="revenue-card"
        />
      );

      expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
      expect(screen.getByText('$45,200')).toBeInTheDocument();
      expect(screen.getByText('Last 30 days')).toBeInTheDocument();
      expect(screen.getByTestId('trend-icon')).toBeInTheDocument();
      expect(screen.getByText(/\+12.5%/)).toBeInTheDocument();
      expect(screen.getByText(/↗/)).toBeInTheDocument();
    });
  });

  describe('Trend Color Logic', () => {
    it('applies success color for up trend', () => {
      render(
        <StatCard
          title="Users"
          value={100}
          trend="up"
          trendValue="+10%"
        />
      );

      const trendText = screen.getByText(/\+10%/);
      expect(trendText).toBeInTheDocument();
    });

    it('applies error color for down trend', () => {
      render(
        <StatCard
          title="Users"
          value={100}
          trend="down"
          trendValue="-5%"
        />
      );

      const trendText = screen.getByText(/-5%/);
      expect(trendText).toBeInTheDocument();
    });

    it('applies secondary color for neutral trend', () => {
      render(
        <StatCard
          title="Users"
          value={100}
          trend="neutral"
          trendValue="0%"
        />
      );

      const trendText = screen.getByText(/0%/);
      expect(trendText).toBeInTheDocument();
    });
  });
});
