import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, LinearProgress, Chip } from '@mui/material';
import { ArrowRight, AccessTime, CheckCircle, Error } from '@mui/icons-material';

type ActionCardVariant = 'default' | 'featured' | 'urgent' | 'success';
type ActionCardStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
type ActionCardPriority = 'low' | 'medium' | 'high' | 'critical';

interface ActionCardProps {
  title: string;
  description: string;
  variant?: ActionCardVariant;
  status?: ActionCardStatus;
  priority?: ActionCardPriority;
  progress?: number;
  dueDate?: string;
  estimatedTime?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  tags?: string[];
}

const variantStyles = {
  default: 'border-gray-200',
  featured: 'border-primary bg-primary/5',
  urgent: 'border-orange-300 bg-orange-50',
  success: 'border-green-300 bg-green-50'
};

const statusConfig = {
  pending: { color: 'text-gray-500', icon: AccessTime, bgColor: 'bg-gray-100' },
  'in-progress': { color: 'text-blue-500', icon: AccessTime, bgColor: 'bg-blue-100' },
  completed: { color: 'text-green-500', icon: CheckCircle, bgColor: 'bg-green-100' },
  failed: { color: 'text-red-500', icon: Error, bgColor: 'bg-red-100' }
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export function ActionCard({
  title,
  description,
  variant = 'default',
  status = 'pending',
  priority = 'medium',
  progress,
  dueDate,
  estimatedTime,
  actionLabel = 'Start',
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  tags = []
}: ActionCardProps) {
  const StatusIcon = statusConfig[status].icon;
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <Card className={`p-0 border-2 ${variantStyles[variant]} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        {/* Header with Icon and Status */}
        <Box className="flex items-start justify-between mb-4">
          <Box className="flex items-center gap-3">
            {icon && (
              <Box className="p-2 bg-primary/10 rounded-lg">
                {icon}
              </Box>
            )}
            <Box>
              <Typography variant="h6" className="font-semibold mb-1">
                {title}
              </Typography>
              <Box className="flex items-center gap-2">
                <StatusIcon sx={{ fontSize: 16 }} className={statusConfig[status].color} />
                <Typography variant="caption" className={statusConfig[status].color}>
                  {status.replace('-', ' ').toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Priority Badge */}
          <Chip
            label={priority.toUpperCase()}
            size="small"
            className={priorityColors[priority]}
          />
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" className="mb-4">
          {description}
        </Typography>

        {/* Progress Bar */}
        {progress !== undefined && (
          <Box className="mb-4">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              className="h-2 rounded-full"
            />
          </Box>
        )}

        {/* Meta Information */}
        <Box className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
          {estimatedTime && (
            <Box className="flex items-center gap-1">
              <AccessTime sx={{ fontSize: 14 }} />
              <span>{estimatedTime}</span>
            </Box>
          )}
          {dueDate && (
            <Box className="flex items-center gap-1">
              <span>Due: {dueDate}</span>
            </Box>
          )}
        </Box>

        {/* Tags */}
        {tags.length > 0 && (
          <Box className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                className="text-xs"
              />
            ))}
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions className="px-6 pb-6 pt-0">
        <Box className="flex gap-2 w-full">
          {onAction && (
            <Button
              variant={variant === 'featured' ? 'contained' : 'outlined'}
              onClick={onAction}
              disabled={isCompleted || isFailed}
              endIcon={<ArrowRight sx={{ fontSize: 16 }} />}
              className={variant === 'featured' ? 'bg-primary hover:bg-primary/90' : ''}
            >
              {actionLabel}
            </Button>
          )}

          {onSecondaryAction && secondaryActionLabel && (
            <Button
              variant="text"
              onClick={onSecondaryAction}
              disabled={isCompleted || isFailed}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}