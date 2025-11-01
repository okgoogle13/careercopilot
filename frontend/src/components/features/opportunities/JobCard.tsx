import {
  LocationOn as MapPin,
  Schedule as Clock,
  AttachMoney as DollarSign,
  BookmarkBorder as Bookmark,
  Bookmark as BookmarkCheck,
  OpenInNew as ExternalLink,
  Business as Building2,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import React from 'react';

type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
type ExperienceLevel =
  | 'Entry Level'
  | 'Mid Level'
  | 'Senior Level'
  | 'Lead/Principal'
  | 'Executive';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  experience: ExperienceLevel;
  salary?: string;
  description: string;
  skills: string[];
  postedDate: string;
  isBookmarked?: boolean;
  companyLogo?: string;
  isRemote?: boolean;
  onBookmark?: (id: string) => void;
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function JobCard({
  id,
  title,
  company,
  location,
  type,
  experience,
  salary,
  description,
  skills,
  postedDate,
  isBookmarked = false,
  companyLogo,
  isRemote = false,
  onBookmark,
  onApply,
  onViewDetails,
}: JobCardProps) {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(id);
  };

  return (
    <Card
      sx={{
      '&:hover': { boxShadow: 4 },
      "transition-shadow": true,
      cursor: "pointer"
    }}
      onClick={() => onViewDetails?.(id)}
    >
      <CardContent sx={{
      p: 6
    }}>
        {/* Header */}
        <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      mb: 4
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3,
      flex: 1
    }}>
            {/* Company Logo */}
            <Avatar src={companyLogo} sx={{
      "w-12": true,
      "h-12": true
    }} sx={{ bgcolor: 'primary.main' }}>
              <Building2 sx={{ fontSize: 20 }} />
            </Avatar>

            {/* Job Info */}
            <Box sx={{
      flex: 1,
      "min-w-0": true
    }}>
              <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 1,
      [object Object]
    }} title={title}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
      mb: 2
    }}>
                {company}
              </Typography>

              {/* Job Meta */}
              <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 3,
      typography: body1,
      color: "gray.600"
    }}>
                <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                  <MapPin sx={{ fontSize: 14 }} />
                  <span>{location}</span>
                  {isRemote && (
                    <Chip
                      label="Remote"
                      size="small"
                      sx={{
      ml: 1,
      bgcolor: "green.100",
      "text-green-800": true
    }}
                    />
                  )}
                </Box>
                <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                  <Clock sx={{ fontSize: 14 }} />
                  <span>{postedDate}</span>
                </Box>
                {salary && (
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                    <DollarSign sx={{ fontSize: 14 }} />
                    <span>{salary}</span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Bookmark Button */}
          <IconButton
            onClick={handleBookmark}
            sx={{
      "text-gray-400": true,
      '&:hover': { "text-primary": true }
    }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck sx={{ fontSize: 20 }} sx={{
      "text-primary": true
    }} />
            ) : (
              <Bookmark sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>

        {/* Job Type & Experience Chips */}
        <Box sx={{
      display: "flex",
      gap: 2,
      mb: 4
    }}>
          <Chip
            label={type}
            size="small"
            variant="outlined"
            sx={{
      borderColor: "blue.300",
      "text-blue-800": true
    }}
          />
          <Chip
            label={experience}
            size="small"
            variant="outlined"
            sx={{
      borderColor: "purple.300",
      "text-purple-800": true
    }}
          />
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{
      mb: 4,
      "line-clamp-3": true
    }}>
          {description}
        </Typography>

        {/* Skills */}
        <Box sx={{
      mb: 4
    }}>
          <Typography variant="caption" color="text.secondary" sx={{
      mb: 2,
      "block": true
    }}>
            Required Skills:
          </Typography>
          <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 1
    }}>
            {skills.slice(0, 5).map((skill, index) => (
              <Chip key={index} label={skill} size="small" sx={{
      bgcolor: "gray.100",
      "text-gray-800": true
    }} />
            ))}
            {skills.length > 5 && (
              <Chip
                label={`+${skills.length - 5} more`}
                size="small"
                sx={{
      bgcolor: "gray.100",
      color: "gray.600"
    }}
              />
            )}
          </Box>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{
      px: 6,
      pb: 6,
      pt: 0
    }}>
        <Box sx={{
      display: "flex",
      gap: 2,
      width: "100%"
    }}>
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(id);
            }}
            sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }}
          >
            Apply Now
          </Button>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(id);
            }}
            endIcon={<ExternalLink sx={{ fontSize: 16 }} />}
          >
            View Details
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
