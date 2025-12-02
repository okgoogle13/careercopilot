import {
  Business as Building2,
  CalendarToday as Calendar,
  AttachMoney as DollarSign,
  LocationOn as MapPin,
  MoreHoriz as MoreHorizontal,
  Schedule as Clock,
  Visibility as Eye,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Avatar,
  LinearProgress,
} from '@mui/material';
import React from 'react';

type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected';

interface NextEvent {
  type: string;
  date: string;
}

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: ApplicationStatus;
  nextEvent?: NextEvent;
  progress: number;
  companyLogo?: string;
  onViewTimeline?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDragging?: boolean;
}

const statusConfig = {
  applied: {
    bg: 'var(--sys-color-primary-container)',
    text: 'var(--sys-color-on-primary-container)',
    label: 'Applied',
  },
  screening: {
    bg: 'var(--sys-color-secondary-container)',
    text: 'var(--sys-color-on-secondary-container)',
    label: 'Screening',
  },
  interview: {
    bg: 'var(--sys-color-tertiary-container)',
    text: 'var(--sys-color-on-tertiary-container)',
    label: 'Interview',
  },
  offer: {
    bg: 'var(--sys-color-primary-container)',
    text: 'var(--sys-color-on-primary-container)',
    label: 'Offer',
  },
  rejected: {
    bg: 'var(--sys-color-error-container)',
    text: 'var(--sys-color-on-error-container)',
    label: 'Rejected',
  },
};
export function ApplicationCard({
  id,
  jobTitle,
  company,
  location,
  salary,
  appliedDate,
  status,
  nextEvent,
  progress,
  companyLogo,
  onViewTimeline,
  onEdit,
  isDragging = false,
}: ApplicationCardProps) {
  const statusInfo = statusConfig[status];
  return (
    <Card
      sx={{
        borderRadius: 'var(--sys-shape-corner-large)',
        boxShadow: isDragging
          ? 'var(--sys-elevation-level3)'
          : 'var(--sys-elevation-level1)',
        transition:
          'box-shadow var(--sys-motion-duration-short2) var(--sys-motion-easing-standard)',
        '&:hover': { boxShadow: 'var(--sys-elevation-level2)' },
      }}
    >
      <CardContent sx={{ p: 'var(--sys-spacing-4)' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 'var(--sys-spacing-3)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--sys-spacing-3)',
              flex: 1,
            }}
          >
            <Avatar
              src={companyLogo}
              sx={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--sys-color-primary-container)',
                color: 'var(--sys-color-on-primary-container)',
              }}
            >
              <Building2 sx={{ fontSize: '20px' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  font: 'var(--sys-type-title-medium)',
                  fontWeight: 'var(--sys-type-weight-semibold)',
                  color: 'var(--sys-color-on-surface)',
                  mb: 'var(--sys-spacing-1)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={jobTitle}
              >
                {jobTitle}
              </Typography>
              <Typography
                sx={{
                  font: 'var(--sys-type-body-medium)',
                  color: 'var(--sys-color-on-surface-variant)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={company}
              >
                {company}
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={() => onEdit?.(id)}
            aria-label="More options"
          >
            <MoreHorizontal sx={{ fontSize: '20px' }} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 'var(--sys-spacing-3)' }}>
          <Chip
            label={statusInfo.label}
            size="small"
            sx={{
              backgroundColor: statusInfo.bg,
              color: statusInfo.text,
              font: 'var(--sys-type-label-medium)',
            }}
          />
        </Box>

        <Box
          sx={{
            mb: 'var(--sys-spacing-4)',
            font: 'var(--sys-type-body-small)',
            color: 'var(--sys-color-on-surface-variant)',
            display: 'grid',
            gap: 'var(--sys-spacing-1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sys-spacing-1)',
            }}
          >
            <MapPin sx={{ fontSize: '16px' }} />
            <Typography component="span" sx={{ font: 'inherit' }}>
              {location}
            </Typography>
          </Box>

          {salary && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sys-spacing-1)',
              }}
            >
              <DollarSign sx={{ fontSize: '16px' }} />
              <Typography component="span" sx={{ font: 'inherit' }}>
                {salary}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sys-spacing-1)',
            }}
          >
            <Calendar sx={{ fontSize: '16px' }} />
            <Typography component="span" sx={{ font: 'inherit' }}>
              Applied {appliedDate}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 'var(--sys-spacing-4)' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 'var(--sys-spacing-1)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                font: 'var(--sys-type-label-small)',
                color: 'var(--sys-color-on-surface-variant)',
              }}
            >
              Progress
            </Typography>
            <Typography
              variant="caption"
              sx={{
                font: 'var(--sys-type-label-small)',
                color: 'var(--sys-color-on-surface-variant)',
              }}
            >
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              borderRadius: 'var(--sys-shape-corner-full)',
              height: '8px',
              backgroundColor: 'var(--sys-color-surface-container-high)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'var(--sys-color-primary)',
              },
            }}
          />
        </Box>

        {nextEvent && (
          <Box
            sx={{
              mb: 'var(--sys-spacing-4)',
              p: 'var(--sys-spacing-2)',
              backgroundColor: 'var(--sys-color-primary-container)',
              borderRadius: 'var(--sys-shape-corner-medium)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sys-spacing-1)',
                font: 'var(--sys-type-body-small)',
                color: 'var(--sys-color-on-primary-container)',
              }}
            >
              <Clock sx={{ fontSize: '16px' }} />
              <Typography
                component="span"
                sx={{
                  font: 'inherit',
                  fontWeight: 'var(--sys-type-weight-medium)',
                }}
              >
                {nextEvent.type}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                font: 'var(--sys-type-label-small)',
                color: 'var(--sys-color-on-primary-container)',
              }}
            >
              {nextEvent.date}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 'var(--sys-spacing-2)' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onViewTimeline?.(id)}
            startIcon={<Eye sx={{ fontSize: '18px' }} />}
            sx={{
              font: 'var(--sys-type-label-large)',
              borderColor: 'var(--sys-color-outline)',
              color: 'var(--sys-color-primary)',
            }}
          >
            Timeline
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}