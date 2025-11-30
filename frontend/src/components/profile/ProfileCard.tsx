import { Edit, Delete as Trash2 } from '@mui/icons-material';
import {
  Button,
  Card,
  Typography,
  Box,
} from '@mui/material';

import { Avatar, AvatarFallback } from '../ui/avatar';

interface ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export function ProfileCard({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
  isSelected = false,
}: ProfileCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 'var(--sys-space-6)',
        borderRadius: 'var(--sys-shape-corner-medium)',
        boxShadow: 'var(--sys-elevation-level1)',
        backgroundColor: isSelected ? 'var(--sys-color-primary-container)' : 'var(--sys-color-surface)',
        border: isSelected ? '1px solid var(--sys-color-primary)' : '1px solid var(--sys-color-outline-variant)',
        transition: 'box-shadow var(--sys-motion-duration-short2) var(--sys-motion-easing-standard)',
        '&:hover': {
          boxShadow: 'var(--sys-elevation-level2)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)' }}>
        <Avatar>
          <AvatarFallback
            style={{
              backgroundColor: avatarColor,
              color: 'var(--sys-color-on-primary-container)',
              fontFamily: 'var(--sys-type-font-family-brand)',
              fontWeight: 'var(--sys-type-weight-medium)',
              fontSize: 'var(--sys-type-size-title-medium)',
              lineHeight: 'var(--sys-type-line-height-title-medium)',
            }}
          >
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'var(--sys-type-font-family-brand)',
              fontWeight: 'var(--sys-type-weight-medium)',
              fontSize: 'var(--sys-type-size-title-large)',
              lineHeight: 'var(--sys-type-line-height-title-large)',
              color: 'var(--sys-color-on-surface)',
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--sys-type-font-family-plain)',
              fontWeight: 'var(--sys-type-weight-regular)',
              fontSize: 'var(--sys-type-size-body-medium)',
              lineHeight: 'var(--sys-type-line-height-body-medium)',
              color: 'var(--sys-color-on-surface-variant)',
            }}
          >
            {role}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 'var(--sys-space-4)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 'var(--sys-space-2)' }}>
          <Typography variant="body1" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>Active Applications:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>{activeApplications}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 'var(--sys-space-2)' }}>
          <Typography variant="body1" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>ATS Score Average:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>{atsScore}%</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>Last Updated:</Typography>
          <Typography variant="body1" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>{lastUpdated}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)', pt: 'var(--sys-space-4)' }}>
        <Button
          variant="text"
          size="small"
          onClick={onEdit}
          sx={{
            flex: 1,
            color: 'var(--sys-color-primary)',
            '& .MuiButton-startIcon': {
              width: 'var(--sys-icon-size-medium)',
              height: 'var(--sys-icon-size-medium)',
            },
          }}
          startIcon={<Edit />}
        >
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={onDelete}
          sx={{
            flex: 1,
            color: 'var(--sys-color-error)',
            '& .MuiButton-startIcon': {
              width: 'var(--sys-icon-size-medium)',
              height: 'var(--sys-icon-size-medium)',
            },
          }}
          startIcon={<Trash2 />}
        >
        </Button>
      </Box>
    </Card>
  );
}
