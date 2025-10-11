import React from 'react';
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
import {
  Business as Building2,
  CalendarToday as Calendar,
  AttachMoney as DollarSign,
  LocationOn as MapPin,
  MoreHoriz as MoreHorizontal,
  Schedule as Clock,
  Visibility as Eye,
} from '@mui/icons-material';

type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

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
  applied: { color: 'bg-blue-100 text-blue-800', label: 'Applied' },
  screening: { color: 'bg-yellow-100 text-yellow-800', label: 'Screening' },
  interview: { color: 'bg-purple-100 text-purple-800', label: 'Interview' },
  offer: { color: 'bg-green-100 text-green-800', label: 'Offer' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
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
      className={`transition-all duration-200 hover:shadow-md ${
        isDragging ? 'rotate-2 scale-105 shadow-lg' : ''
      }`}
    >
      <CardContent className="p-4">
        {/* Header */}
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar src={companyLogo} className="w-10 h-10" sx={{ bgcolor: 'primary.main' }}>
              <Building2 sx={{ fontSize: 16 }} />
            </Avatar>
            <Box className="flex-1 min-w-0">
              <Typography
                variant="h6"
                className="font-semibold text-sm mb-1 truncate"
                title={jobTitle}
              >
                {jobTitle}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="truncate"
                title={company}
              >
                {company}
              </Typography>
            </Box>
          </Box>

          <IconButton size="small" onClick={() => onEdit?.(id)} aria-label="More options">
            <MoreHorizontal sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Status Badge */}
        <Box className="mb-3">
          <Chip label={statusInfo.label} size="small" className={statusInfo.color} />
        </Box>

        {/* Job Details */}
        <Box className="space-y-2 mb-4 text-xs text-gray-600">
          <Box className="flex items-center gap-1">
            <MapPin sx={{ fontSize: 12 }} />
            <span className="truncate">{location}</span>
          </Box>

          {salary && (
            <Box className="flex items-center gap-1">
              <DollarSign sx={{ fontSize: 12 }} />
              <span>{salary}</span>
            </Box>
          )}

          <Box className="flex items-center gap-1">
            <Calendar sx={{ fontSize: 12 }} />
            <span>Applied {appliedDate}</span>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box className="mb-4">
          <Box className="flex justify-between items-center mb-1">
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} className="h-1.5 rounded-full" />
        </Box>

        {/* Next Event */}
        {nextEvent && (
          <Box className="mb-4 p-2 bg-blue-50 rounded-lg">
            <Box className="flex items-center gap-1 text-xs text-blue-700">
              <Clock sx={{ fontSize: 12 }} />
              <span className="font-medium">{nextEvent.type}</span>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {nextEvent.date}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box className="flex gap-2">
          <Button
            size="small"
            variant="outline"
            onClick={() => onViewTimeline?.(id)}
            startIcon={<Eye sx={{ fontSize: 14 }} />}
            className="text-xs"
          >
            Timeline
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
