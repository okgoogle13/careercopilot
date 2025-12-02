import React from 'react';
import { Card } from '../ui/card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
}) => {
  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm text-gray-500">{title}</div>
        {icon && <div className="text-primary-500">{icon}</div>}
      </div>

      <div className="text-3xl font-bold mb-0.5">{value}</div>

      <div className="flex items-center gap-1">
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        {trendValue && (
          <div className={`text-xs font-medium ${getTrendColor(trend)}`}>
            {trend === 'up' && '↗'}
            {trend === 'down' && '↘'}
            {trendValue}
          </div>
        )}
      </div>
    </Card>
  );
};
