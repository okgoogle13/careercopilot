import React from 'react';
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
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Building2,
} from '@mui/icons-material';

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
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewDetails?.(id)}
    >
      <CardContent className="p-6">
        {/* Header */}
        <Box className="flex items-start justify-between mb-4">
          <Box className="flex items-start gap-3 flex-1">
            {/* Company Logo */}
            <Avatar src={companyLogo} className="w-12 h-12" sx={{ bgcolor: 'primary.main' }}>
              <Building2 sx={{ fontSize: 20 }} />
            </Avatar>

            {/* Job Info */}
            <Box className="flex-1 min-w-0">
              <Typography variant="h6" className="font-semibold mb-1 truncate" title={title}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" className="mb-2">
                {company}
              </Typography>

              {/* Job Meta */}
              <Box className="flex flex-wrap gap-3 text-sm text-gray-600">
                <Box className="flex items-center gap-1">
                  <MapPin sx={{ fontSize: 14 }} />
                  <span>{location}</span>
                  {isRemote && (
                    <Chip
                      label="Remote"
                      size="small"
                      className="ml-1 bg-green-100 text-green-800"
                    />
                  )}
                </Box>
                <Box className="flex items-center gap-1">
                  <Clock sx={{ fontSize: 14 }} />
                  <span>{postedDate}</span>
                </Box>
                {salary && (
                  <Box className="flex items-center gap-1">
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
            className="text-gray-400 hover:text-primary"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck sx={{ fontSize: 20 }} className="text-primary" />
            ) : (
              <Bookmark sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>

        {/* Job Type & Experience Chips */}
        <Box className="flex gap-2 mb-4">
          <Chip
            label={type}
            size="small"
            variant="outlined"
            className="border-blue-300 text-blue-800"
          />
          <Chip
            label={experience}
            size="small"
            variant="outlined"
            className="border-purple-300 text-purple-800"
          />
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" className="mb-4 line-clamp-3">
          {description}
        </Typography>

        {/* Skills */}
        <Box className="mb-4">
          <Typography variant="caption" color="text.secondary" className="mb-2 block">
            Required Skills:
          </Typography>
          <Box className="flex flex-wrap gap-1">
            {skills.slice(0, 5).map((skill, index) => (
              <Chip key={index} label={skill} size="small" className="bg-gray-100 text-gray-800" />
            ))}
            {skills.length > 5 && (
              <Chip
                label={`+${skills.length - 5} more`}
                size="small"
                className="bg-gray-100 text-gray-600"
              />
            )}
          </Box>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions className="px-6 pb-6 pt-0">
        <Box className="flex gap-2 w-full">
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(id);
            }}
            className="bg-primary hover:bg-primary/90"
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
