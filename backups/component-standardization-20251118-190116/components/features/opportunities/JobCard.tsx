import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import {
  BookmarkBorder,
  Bookmark,
  LocationOn,
  Business,
  AttachMoney,
  Bolt,
  Star,
  TrendingUp,
  VerifiedUser,
  OpenInNew,
} from '@mui/icons-material';

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';
    salary?: {
      min: number;
      max: number;
      currency: string;
      period: 'hourly' | 'annually';
    };
    description: string;
    requirements: string[];
    skills: string[];
    benefits?: string[];
    postedDate: Date | string;
    applicationDeadline?: Date | string;
    companySize?: string;
    industry?: string;
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
    remote: boolean;
    sponsored?: boolean;
    verified?: boolean;
    aiMatch?: {
      score: number;
      reasons: string[];
    };
    logoUrl?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  saved?: boolean;
  applied?: boolean;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  variant = 'default',
  saved = false,
  applied = false,
  onSave,
  onApply,
  onViewDetails,
}) => {
  const [isSaved, setIsSaved] = useState(saved);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  const formatSalary = () => {
    if (!job.salary) return null;
    const { min, max, currency, period } = job.salary;
    const periodText = period === 'hourly' ? '/hr' : '/year';

    if (min === max) {
      return `${currency}${min.toLocaleString()}${periodText}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}${periodText}`;
  };

  const getExperienceBadgeColor = () => {
    switch (job.experienceLevel) {
      case 'entry':
        return { bg: alpha('var(--sys-color-success)', 0.1), text: 'var(--sys-color-success)', border: alpha('var(--sys-color-success)', 0.2) };
      case 'mid':
        return { bg: alpha('var(--sys-color-info-light)', 0.1), text: 'var(--sys-color-info-light)', border: alpha('var(--sys-color-info-light)', 0.2) };
      case 'senior':
        return { bg: alpha('var(--sys-color-primary)', 0.1), text: 'var(--sys-color-primary)', border: alpha('var(--sys-color-primary)', 0.2) };
      case 'executive':
        return { bg: alpha('var(--sys-color-warning)', 0.1), text: 'var(--sys-color-warning)', border: alpha('var(--sys-color-warning)', 0.2) };
      default:
        return { bg: alpha('var(--sys-color-text-disabled)', 0.1), text: 'var(--sys-color-text-disabled)', border: alpha('var(--sys-color-text-disabled)', 0.2) };
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return { text: 'var(--sys-color-success)', bg: alpha('var(--sys-color-success)', 0.1) };
    if (score >= 75) return { text: 'var(--sys-color-info-light)', bg: alpha('var(--sys-color-info-light)', 0.1) };
    if (score >= 60) return { text: 'var(--sys-color-warning)', bg: alpha('var(--sys-color-warning)', 0.1) };
    return { text: 'var(--sys-color-error)', bg: alpha('var(--sys-color-error)', 0.1) };
  };

  if (variant === 'compact') {
    return (
      <Card
        variant="interactive"
        sx={{
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => theme.customShadows.glowPrimary,
          },
        }}
        onClick={() => onViewDetails?.(job.id)}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {job.title}
                </Typography>
                {job.verified && <VerifiedUser sx={{ fontSize: 16, color: 'var(--sys-color-info-light)' }} />}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Business sx={{ fontSize: 12 }} />
                <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {job.company}
                </Typography>
                <Typography variant="caption">•</Typography>
                <LocationOn sx={{ fontSize: 12 }} />
                <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {job.location}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              {job.aiMatch && (
                <Chip
                  label={`${job.aiMatch.score}% match`}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: getMatchScoreColor(job.aiMatch.score).bg,
                    color: getMatchScoreColor(job.aiMatch.score).text,
                  }}
                />
              )}
              <IconButton
                size="small"
                onClick={handleSave}
                sx={{
                  color: isSaved ? 'primary.main' : 'text.secondary',
                }}
              >
                {isSaved ? <Bookmark sx={{ fontSize: 16 }} /> : <BookmarkBorder sx={{ fontSize: 16 }} />}
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const experienceColor = getExperienceBadgeColor();
  const matchColor = job.aiMatch ? getMatchScoreColor(job.aiMatch.score) : null;

  return (
    <Card
      variant={variant === 'featured' ? 'interactive' : 'glass'}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        ...(variant === 'featured' && {
          ring: 2,
          ringColor: (theme) => alpha(theme.palette.primary.main, 0.2),
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.customShadows.glowPrimary,
          borderColor: 'primary.main',
        },
      }}
      onClick={() => onViewDetails?.(job.id)}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: 'surface.containerHigh',
              }}
            >
              {job.logoUrl ? (
                <img src={job.logoUrl} alt={job.company} style={{ width: 32, height: 32, borderRadius: 8 }} />
              ) : (
                <Business sx={{ fontSize: 24 }} />
              )}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.secondary">
                  {job.company}
                </Typography>
                {job.verified && <VerifiedUser sx={{ fontSize: 16, color: 'var(--sys-color-info-light)' }} />}
                {job.sponsored && (
                  <Chip
                    label="Sponsored"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.675rem',
                      bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.1),
                      color: 'tertiary.main',
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {job.industry} • {job.companySize}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {job.aiMatch && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: matchColor?.bg,
                    color: matchColor?.text,
                  }}
                >
                  {job.aiMatch.score}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  AI Match
                </Typography>
              </Box>
            )}

            <IconButton
              size="small"
              onClick={handleSave}
              sx={{
                color: isSaved ? 'primary.main' : 'text.secondary',
              }}
            >
              {isSaved ? <Bookmark sx={{ fontSize: 20 }} /> : <BookmarkBorder sx={{ fontSize: 20 }} />}
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {job.title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>

          {job.salary && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttachMoney sx={{ fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                {formatSalary()}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            Posted {formatRelativeTime(job.postedDate)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.6,
          }}
        >
          {job.description}
        </Typography>

        {/* Job Type & Experience Level */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip label={job.type.replace('-', ' ').toUpperCase()} size="small" variant="outlined" />
          <Chip
            label={`${job.experienceLevel.toUpperCase()} LEVEL`}
            size="small"
            variant="outlined"
            sx={{
              bgcolor: experienceColor.bg,
              color: experienceColor.text,
              borderColor: experienceColor.border,
            }}
          />
          {job.remote && (
            <Chip
              label="REMOTE"
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            />
          )}
        </Box>

        {/* Skills */}
        {job.skills.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Required Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {job.skills.slice(0, 6).map((skill, index) => (
                <Chip key={index} label={skill} size="small" />
              ))}
              {job.skills.length > 6 && (
                <Chip label={`+${job.skills.length - 6} more`} size="small" variant="outlined" />
              )}
            </Box>
          </Box>
        )}

        {/* AI Match Reasons */}
        {job.aiMatch && job.aiMatch.reasons.length > 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Bolt sx={{ fontSize: 16, color: 'var(--sys-color-primary)' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Why this matches you
              </Typography>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
              {job.aiMatch.reasons.slice(0, 3).map((reason, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    listStyle: 'none',
                  }}
                >
                  <Star sx={{ fontSize: 12, color: 'var(--sys-color-primary)', mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary">
                    {reason}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {applied ? (
          <Button
            variant="outlined"
            fullWidth
            disabled
            sx={{
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
              borderColor: (theme) => alpha(theme.palette.success.main, 0.2),
              color: 'success.main',
            }}
          >
            Applied
          </Button>
        ) : (
          <Button
            variant="aurora"
            fullWidth
            startIcon={<TrendingUp sx={{ fontSize: 16 }} />}
            onClick={handleApply}
          >
            Apply Now
          </Button>
        )}

        <Button
          variant="outlined"
          endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(job.id);
          }}
          sx={{ ml: 1 }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
