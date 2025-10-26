import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledStatCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

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
        return 'success.main';
      case 'down':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <StyledStatCard className={className}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
        </Box>

        <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trendValue && (
            <Typography
              variant="caption"
              sx={{
                color: getTrendColor(trend),
                fontWeight: 500,
              }}
            >
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trendValue}
            </Typography>
          )}
        </Box>
      </CardContent>
    </StyledStatCard>
  );
};
