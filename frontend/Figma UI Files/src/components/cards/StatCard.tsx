import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus, Info, ExternalLink, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  trend?: {
    value: number;
    label?: string;
    timeframe?: string;
  };
  status?: 'positive' | 'negative' | 'neutral' | 'warning';
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onInfoClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = 'neutral',
  variant = 'default',
  loading = false,
  error = false,
  disabled = false,
  onClick,
  onInfoClick,
  onMenuClick,
  className = '',
  children,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'text-brand-primary';
      case 'negative':
        return 'text-brand-error';
      case 'warning':
        return 'text-brand-tertiary';
      case 'neutral':
      default:
        return 'text-on-surface';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend.value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-on-surface-variant';
    if (trend.value > 0) return 'text-brand-primary';
    if (trend.value < 0) return 'text-brand-error';
    return 'text-on-surface-variant';
  };

  const formatTrendValue = () => {
    if (!trend) return null;
    const sign = trend.value > 0 ? '+' : '';
    return `${sign}${trend.value}%`;
  };

  // Loading state
  if (loading) {
    return (
      <Card
        className={`
        p-4 animate-pulse 
        ${variant === 'compact' ? 'p-3' : ''}
        ${className}
      `}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-surface-container-high rounded w-20"></div>
            {variant !== 'minimal' && (
              <div className="w-8 h-8 bg-surface-container-high rounded-lg"></div>
            )}
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-surface-container-high rounded w-16"></div>
            {variant === 'detailed' && (
              <>
                <div className="h-3 bg-surface-container-high rounded w-24"></div>
                <div className="h-3 bg-surface-container-high rounded w-20"></div>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card
        className={`
        p-4 border-brand-error/20 bg-brand-error/5
        ${variant === 'compact' ? 'p-3' : ''}
        ${className}
      `}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-on-surface-variant">{title}</h3>
            {onInfoClick && (
              <Button variant="ghost" size="sm" onClick={onInfoClick} className="h-6 w-6 p-0">
                <Info className="w-3 h-3 text-brand-error" />
              </Button>
            )}
          </div>
          <div>
            <p className="text-2xl font-medium text-brand-error mb-1">—</p>
            <p className="text-xs text-brand-error">Failed to load</p>
          </div>
        </div>
      </Card>
    );
  }

  const cardClasses = `
    transition-all duration-300
    ${onClick && !disabled ? 'cursor-pointer card-interactive' : 'card-surface'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${variant === 'compact' ? 'p-3' : 'p-4'}
    ${variant === 'minimal' ? 'p-3 bg-transparent border-none shadow-none' : ''}
    ${className}
  `;

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <Card className={cardClasses} onClick={handleClick}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3
              className={`
              font-medium truncate
              ${variant === 'compact' ? 'text-xs' : 'text-sm'}
              ${disabled ? 'text-on-surface-variant' : 'text-on-surface-variant'}
            `}
            >
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onInfoClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick();
                }}
                className="h-6 w-6 p-0 hover:bg-surface-container-high"
              >
                <Info className="w-3 h-3 text-on-surface-variant" />
              </Button>
            )}

            {Icon && variant !== 'minimal' && (
              <div
                className={`
                flex items-center justify-center rounded-lg bg-surface-container-high
                ${variant === 'compact' ? 'w-6 h-6' : 'w-8 h-8'}
              `}
              >
                <Icon
                  className={`
                  ${getStatusColor()}
                  ${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'}
                `}
                />
              </div>
            )}

            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick();
                }}
                className="h-6 w-6 p-0 hover:bg-surface-container-high"
              >
                <MoreVertical className="w-3 h-3 text-on-surface-variant" />
              </Button>
            )}

            {onClick && (
              <ExternalLink className="w-3 h-3 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Value */}
        <div>
          <p
            className={`
            font-medium leading-none mb-1 ${getStatusColor()}
            ${variant === 'compact' ? 'text-xl' : 'text-2xl'}
            ${variant === 'minimal' ? 'text-lg' : ''}
          `}
          >
            {value}
          </p>

          {subtitle && (
            <p
              className={`
              text-on-surface-variant
              ${variant === 'compact' ? 'text-xs' : 'text-sm'}
            `}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Trend */}
        {trend && variant !== 'minimal' && (
          <div className="flex items-center gap-1">
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className={`font-medium ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                {formatTrendValue()}
              </span>
            </div>
            {trend.label && (
              <span
                className={`
                text-on-surface-variant
                ${variant === 'compact' ? 'text-xs' : 'text-sm'}
              `}
              >
                {trend.label}
              </span>
            )}
            {trend.timeframe && (
              <span
                className={`
                text-on-surface-variant
                ${variant === 'compact' ? 'text-xs' : 'text-sm'}
              `}
              >
                • {trend.timeframe}
              </span>
            )}
          </div>
        )}

        {/* Additional Content */}
        {children && variant === 'detailed' && (
          <div className="pt-2 border-t border-outline-variant">{children}</div>
        )}
      </div>

      {/* Status Indicator */}
      {status !== 'neutral' && variant === 'detailed' && (
        <div
          className={`
          absolute top-2 right-2 w-2 h-2 rounded-full
          ${status === 'positive' ? 'bg-brand-primary' : ''}
          ${status === 'negative' ? 'bg-brand-error' : ''}
          ${status === 'warning' ? 'bg-brand-tertiary' : ''}
        `}
        />
      )}
    </Card>
  );
};

// Pre-configured variants for common use cases
export const CompactStatCard: React.FC<Omit<StatCardProps, 'variant'>> = (props) => (
  <StatCard {...props} variant="compact" />
);

export const DetailedStatCard: React.FC<Omit<StatCardProps, 'variant'>> = (props) => (
  <StatCard {...props} variant="detailed" />
);

export const MinimalStatCard: React.FC<Omit<StatCardProps, 'variant'>> = (props) => (
  <StatCard {...props} variant="minimal" />
);

export default StatCard;
