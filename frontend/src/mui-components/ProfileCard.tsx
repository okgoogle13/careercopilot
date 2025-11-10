import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  LinearProgress, 
  Chip, 
  alpha, 
  Divider, 
  useTheme, 
  CardProps
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type { Profile } from './types';

export interface ProfileCardProps extends Profile, Omit<CardProps, 'onEdit' | 'onDelete'> {
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  decorImage?: string;
  variant?: 'elevation' | 'outlined' | 'illustrated';
}

const getScoreColor = (score: number, theme: any) => {
  if (score >= 85) return theme.palette.success.main;
  if (score >= 70) return theme.palette.warning.main;
  return theme.palette.error.main;
};

// Create a type that extends CardProps with our custom variant
type CustomCardProps = Omit<CardProps, 'variant'> & {
  variant?: 'elevation' | 'outlined' | 'illustrated';
};

const StyledCard = ({ variant = 'outlined', isSelected, ...props }: CustomCardProps & { isSelected?: boolean }) => {
  const theme = useTheme();
  return (
    <Card
      variant={variant === 'illustrated' ? 'outlined' : variant}
      {...props}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : undefined,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
        transition: 'all 0.3s ease-in-out',
        ...props.sx,
      }}
    />
  );
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
  isSelected = false,
  decorImage = '/images/profile-decor.svg',
  variant = 'outlined',
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const scoreColor = getScoreColor(atsScore, theme);

  // Set the illustration if variant is 'illustrated'
  const cardSx = variant === 'illustrated' 
    ? { 
        '--card-illustration-url': `url(${decorImage})`,
        ...sx 
      }
    : sx;

  return (
    <StyledCard
      variant={variant}
      isSelected={isSelected}
      sx={cardSx}
      {...rest}
    >
      <CardContent sx={{
        p: 3,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative',
        zIndex: 1,
        color: 'tertiary.contrastText',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: avatarColor, color: 'primary.contrastText', fontWeight: 600 }}>
              {name.split(' ').map((n) => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, color: 'tertiary.contrastText' }}>
                {name}
              </Typography>
              <Typography variant="body2" color={alpha(theme.palette.tertiary.contrastText, 0.7)}>
                {role}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${atsScore}%`}
            size="small"
            sx={{
              bgcolor: alpha(scoreColor, 0.12),
              color: scoreColor,
              fontWeight: 600,
              border: 1,
              borderColor: alpha(scoreColor, 0.2),
              '& .MuiChip-label': {
                color: scoreColor,
              },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color={alpha(theme.palette.tertiary.contrastText, 0.7)}>ATS Score</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: scoreColor }}>{atsScore}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={atsScore}
            sx={{
              height: 6, borderRadius: 3, bgcolor: alpha(scoreColor, 0.2),
              '& .MuiLinearProgress-bar': { bgcolor: scoreColor, borderRadius: 3 },
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Card sx={{ bgcolor: (theme) => alpha(theme.palette.background.default, 0.3), textAlign: 'center', border: 'none' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                <TrackChangesIcon sx={{ fontSize: 12, color: 'primary.light' }} />
                <Typography variant="caption" color={alpha(theme.palette.tertiary.contrastText, 0.7)}>Applications</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.light' }}>{activeApplications}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: (theme) => alpha(theme.palette.background.default, 0.3), textAlign: 'center', border: 'none' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 12, color: 'success.light' }} />
                <Typography variant="caption" color={alpha(theme.palette.tertiary.contrastText, 0.7)}>Potential</Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.light' }}>High</Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: 1 }} /> 
        
        <Typography variant="caption" color={alpha(theme.palette.tertiary.contrastText, 0.7)} sx={{ textAlign: 'center' }}>
          Updated {lastUpdated}
        </Typography>

        <Divider sx={{ my: 1, borderColor: alpha(theme.palette.tertiary.contrastText, 0.1) }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="text" 
            size="small" 
            startIcon={<EditIcon sx={{ fontSize: 16 }} />} 
            onClick={onEdit} 
            sx={{ 
              flex: 1, 
              color: alpha(theme.palette.tertiary.contrastText, 0.7), 
              '&:hover': { 
                color: 'primary.light', 
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) 
              } 
            }}
          >
            Edit
          </Button>
          <Button 
            variant="text" 
            size="small" 
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />} 
            onClick={onDelete} 
            sx={{ 
              flex: 1, 
              color: alpha(theme.palette.tertiary.contrastText, 0.7), 
              '&:hover': { 
                color: 'error.light', 
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08) 
              } 
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
