import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Badge } from './badge';
import { Progress } from './progress';

export type TrendDirection = 'up' | 'down' | 'neutral';
export type StatusCardVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type MetricType = 'applications' | 'interviews' | 'responses' | 'offers' | 'ats-score' | 'documents' | 'custom';

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    direction: TrendDirection;
    value: string | number;
    period?: string;
  };
  variant?: StatusCardVariant;
  type?: MetricType;
  icon?: React.ElementType;
  progress?: {
    value: number;
    max?: number;
    label?: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

const getVariantStyles = (variant: StatusCardVariant) => {
  switch (variant) {
    case 'success':
      return 'border-green-200 bg-green-50/50 hover:bg-green-50';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50';
    case 'danger':
      return 'border-red-200 bg-red-50/50 hover:bg-red-50';
    case 'info':
      return 'border-blue-200 bg-blue-50/50 hover:bg-blue-50';
    default:
      return 'hover:bg-accent/50';
  }
};

const getDefaultIcon = (type: MetricType) => {
  switch (type) {
    case 'applications':
      return FileText;
    case 'interviews':
      return Users;
    case 'responses':
      return CheckCircle;
    case 'offers':
      return Award;
    case 'ats-score':
      return Target;
    case 'documents':
      return FileText;
    default:
      return Activity;
  }
};

const getTrendIcon = (direction: TrendDirection) => {
  switch (direction) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    default:
      return Minus;
  }
};

const getTrendColor = (direction: TrendDirection) => {
  switch (direction) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};

export function StatusCard({
  title,
  value,
  description,
  trend,
  variant = 'default',
  type = 'custom',
  icon,
  progress,
  badge,
  className,
  onClick,
  loading = false,
}: StatusCardProps) {
  const Icon = icon || getDefaultIcon(type);
  const TrendIcon = trend ? getTrendIcon(trend.direction) : null;

  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toString();
  };

  return (
    <Card
      className={cn(
        'transition-colors duration-200',
        getVariantStyles(variant),
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant={badge.variant || 'default'} className="text-xs">
              {badge.text}
            </Badge>
          )}
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Main Value */}
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">
                {formatValue(value)}
              </div>
            )}

            {/* Trend Indicator */}
            {trend && TrendIcon && !loading && (
              <div className={cn('flex items-center text-xs', getTrendColor(trend.direction))}>
                <TrendIcon className="h-3 w-3 mr-1" />
                <span>{trend.direction === 'neutral' ? '±' : ''}{trend.value}</span>
                {trend.period && (
                  <span className="text-muted-foreground ml-1">vs {trend.period}</span>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress && !loading && (
            <div className="space-y-2">
              <Progress
                value={progress.value}
                max={progress.max || 100}
                className="h-2"
              />
              {progress.label && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.label}</span>
                  <span>{progress.value}{progress.max ? `/${progress.max}` : '%'}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <CardDescription className="text-xs">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized metric cards for Career Copilot dashboard
interface MetricCardProps extends Omit<StatusCardProps, 'type' | 'icon'> {
  metric: 'total-applications' | 'pending-responses' | 'interviews-scheduled' | 'offers-received' | 'avg-ats-score' | 'documents-generated';
}

export function MetricCard({ metric, ...props }: MetricCardProps) {
  const getMetricConfig = () => {
    switch (metric) {
      case 'total-applications':
        return {
          type: 'applications' as MetricType,
          icon: Briefcase,
          variant: 'default' as StatusCardVariant,
        };
      case 'pending-responses':
        return {
          type: 'responses' as MetricType,
          icon: Clock,
          variant: 'warning' as StatusCardVariant,
        };
      case 'interviews-scheduled':
        return {
          type: 'interviews' as MetricType,
          icon: Calendar,
          variant: 'info' as StatusCardVariant,
        };
      case 'offers-received':
        return {
          type: 'offers' as MetricType,
          icon: Award,
          variant: 'success' as StatusCardVariant,
        };
      case 'avg-ats-score':
        return {
          type: 'ats-score' as MetricType,
          icon: Target,
          variant: 'default' as StatusCardVariant,
        };
      case 'documents-generated':
        return {
          type: 'documents' as MetricType,
          icon: FileText,
          variant: 'default' as StatusCardVariant,
        };
      default:
        return {
          type: 'custom' as MetricType,
          icon: Activity,
          variant: 'default' as StatusCardVariant,
        };
    }
  };

  const config = getMetricConfig();

  return (
    <StatusCard
      type={config.type}
      icon={config.icon}
      variant={config.variant}
      {...props}
    />
  );
}

// Grid layout for multiple status cards
interface StatusCardGridProps {
  cards: StatusCardProps[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusCardGrid({
  cards,
  columns = 3,
  gap = 'md',
  className
}: StatusCardGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getGapSize = () => {
    switch (gap) {
      case 'sm': return 'gap-3';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div className={cn('grid', getGridCols(), getGapSize(), className)}>
      {cards.map((card, index) => (
        <StatusCard key={card.title + index} {...card} />
      ))}
    </div>
  );
}