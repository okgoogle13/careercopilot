import {
  Business as Building2,
  CalendarToday as Calendar,
  AttachMoney as DollarSign,
  LocationOn as MapPin,
  MoreHoriz as MoreHorizontal,
  Schedule as Clock,
  Visibility as Eye,
} from '@mui/icons-material';
import { Box } from '@mui/material';
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
      sx={{
      '&:hover': { boxShadow: 3 },}}
    >
      <CardContent sx={{
      p: 4
    }}>
        {/* Header */}
        <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      mb: 3
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3,
      flex: 1,}}>
            <Avatar src={companyLogo} sx={{}} sx={{ bgcolor: 'primary.main' }}>
              <Building2 sx={{ fontSize: 16 }} />
            </Avatar>
            <Box sx={{
      flex: 1,}}>
              <Typography
                variant="h6"
                sx={{
      fontWeight: 600,
      typography: "body1",
      mb: 1,
      
    }}
                title={jobTitle}
              >
                {jobTitle}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
      
    }}
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
        <Box sx={{
      mb: 3
    }}>
          <Chip label={statusInfo.label} size="small" className={statusInfo.color} />
        </Box>

        {/* Job Details */}
        <Box sx={{
      mb: 4,
      typography: "body2",
      color: "gray.600"
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
            <MapPin sx={{ fontSize: 12 }} />
            <span sx={{
      
    }}>{location}</span>
          </Box>

          {salary && (
            <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
              <DollarSign sx={{ fontSize: 12 }} />
              <span>{salary}</span>
            </Box>
          )}

          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
            <Calendar sx={{ fontSize: 12 }} />
            <span>Applied {appliedDate}</span>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{
      mb: 4
    }}>
          <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 1
    }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{
      borderRadius: "9999px"
    }} />
        </Box>

        {/* Next Event */}
        {nextEvent && (
          <Box sx={{
      mb: 4,
      p: 2,
      bgcolor: "blue.50",
      borderRadius: "0.5rem"
    }}>
            <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      typography: "body2",
      color: "blue.700"
    }}>
              <Clock sx={{ fontSize: 12 }} />
              <span sx={{
      fontWeight: 500
    }}>{nextEvent.type}</span>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {nextEvent.date}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{
      display: "flex",
      gap: 2
    }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onViewTimeline?.(id)}
            startIcon={<Eye sx={{ fontSize: 14 }} />}
            sx={{
      typography: "body2"
    }}
          >
            Timeline
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
