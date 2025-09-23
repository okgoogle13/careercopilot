import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

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
  default: {
    border: '1px solid #e5e7eb',
    backgroundColor: 'transparent'
  },
  primary: {
    border: '1px solid rgba(var(--md-sys-color-primary), 0.2)',
    backgroundColor: 'rgba(var(--md-sys-color-primary), 0.05)'
  },
  success: {
    border: '1px solid #bbf7d0',
    backgroundColor: '#f0fdf4'
  },
  warning: {
    border: '1px solid #fed7aa',
    backgroundColor: '#fffbeb'
  },
  error: {
    border: '1px solid #fecaca',
    backgroundColor: '#fef2f2'
  }
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
    <Card
      sx={{
        ...variantStyles[variant],
        '&:hover': {
          boxShadow: 2
        },
        transition: 'box-shadow 0.2s ease-in-out'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ p: 1, backgroundColor: 'grey.100', borderRadius: 1 }}>
              {icon}
            </Box>
          )}
        </Box>

        {/* Main Value */}
        <Typography variant="h3" sx={{ fontSize: '1.875rem', fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>

        {/* Subtitle and Trend */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend.isPositive ? (
                <TrendingUp fontSize="small" sx={{ color: 'success.main' }} />
              ) : (
                <TrendingDown fontSize="small" sx={{ color: 'error.main' }} />
              )}
              <Typography
                variant="caption"
                sx={{ color: trend.isPositive ? 'success.main' : 'error.main' }}
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