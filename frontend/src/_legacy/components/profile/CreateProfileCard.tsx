import { Add as Plus } from '@mui/icons-material';
import {
  Button,
  Card,
  Typography,
  Box,
} from '@mui/material';

interface CreateProfileCardProps {
  onCreate: () => void;
}

export function CreateProfileCard({ onCreate }: CreateProfileCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 'var(--sys-space-6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        borderRadius: 'var(--sys-shape-corner-medium)',
        boxShadow: 'var(--sys-elevation-level1)',
        backgroundColor: 'var(--sys-color-surface-container-low)',
        border: '1px dashed var(--sys-color-outline)',
        transition: 'box-shadow var(--sys-motion-duration-short2) var(--sys-motion-easing-standard)',
        '&:hover': {
          boxShadow: 'var(--sys-elevation-level2)',
          backgroundColor: 'var(--sys-color-surface-container)',
        },
      }}
    >
      <Box
        sx={{
          width: 'var(--sys-icon-size-large)',
          height: 'var(--sys-icon-size-large)',
          borderRadius: 'var(--sys-shape-corner-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--sys-color-primary-container)',
          color: 'var(--sys-color-on-primary-container)',
          mb: 'var(--sys-space-4)',
        }}
      >
        <Plus sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
      </Box>

      <Box>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'var(--sys-type-font-family-brand)',
            fontWeight: 'var(--sys-type-weight-medium)',
            fontSize: 'var(--sys-type-size-title-large)',
            lineHeight: 'var(--sys-type-line-height-title-large)',
            color: 'var(--sys-color-on-surface)',
            mb: 'var(--sys-space-2)',
          }}
        >
          Create New Profile
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'var(--sys-type-font-family-plain)',
            fontWeight: 'var(--sys-type-weight-regular)',
            fontSize: 'var(--sys-type-size-body-medium)',
            lineHeight: 'var(--sys-type-line-height-body-medium)',
            color: 'var(--sys-color-on-surface-variant)',
            mb: 'var(--sys-space-4)',
          }}
        >
          Build a tailored profile to optimize your resume for specific job applications and track
          your progress.
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onCreate}
        sx={{
          backgroundColor: 'var(--sys-color-primary)',
          color: 'var(--sys-color-on-primary)',
          '&:hover': {
            backgroundColor: 'var(--sys-color-primary-dark)',
          },
        }}
        startIcon={<Plus />}
      >
        Create Profile
      </Button>
    </Card>
  );
}
