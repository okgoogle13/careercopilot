import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  default: 'border-gray-200',
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-green-200 bg-green-50',
  warning: 'border-orange-200 bg-orange-50',
  error: 'border-red-200 bg-red-50'
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default'
}: StatCardProps) {
  return (
    <Card className={`border ${variantStyles[variant]} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        {/* Header with Icon */}
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="body2" color="text.secondary" className="font-medium">
            {title}
          </Typography>
          {icon && (
            <Box className="p-2 bg-gray-100 rounded-lg">
              {icon}
            </Box>
          )}
        </Box>

        {/* Main Value */}
        <Typography variant="h3" className="text-3xl font-bold mb-2">
          {value}
        </Typography>

        {/* Subtitle and Trend */}
        <Box className="flex items-center justify-between">
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Box className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <Typography
                variant="caption"
                className={trend.isPositive ? 'text-green-500' : 'text-red-500'}
              >
                {trend.value > 0 ? '+' : ''}{trend.value}%
                {trend.label && ` ${trend.label}`}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}