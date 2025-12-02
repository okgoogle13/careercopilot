import React from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

export interface DocumentPreviewProps {
  documentId: string;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  documentType: 'resume' | 'cover-letter' | 'selection-criteria';
  templateName: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  onBack,
  onEdit,
  onSave,
  documentType,
  templateName,
}) => {
  const buttonStyles = {
    transition: 'background-color var(--sys-motion-duration-short-2) var(--sys-motion-easing-standard)',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: 'var(--sys-space-8)', paddingBottom: 'var(--sys-space-8)' }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: 'var(--sys-type-headline-small-size)',
            fontWeight: 'var(--sys-type-headline-small-weight)',
            lineHeight: 'var(--sys-type-headline-small-lineHeight)',
            marginBottom: 'var(--sys-space-2)',
          }}
        >
          {templateName} - Preview
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--sys-color-on-surface-variant)',
            marginBottom: 'var(--sys-space-4)',
            fontSize: 'var(--sys-type-body-large-size)',
            fontWeight: 'var(--sys-type-body-large-weight)',
            lineHeight: 'var(--sys-type-body-large-lineHeight)',
          }}
        >
          Review your {documentType} before saving or downloading.
        </Typography>

        <Paper
          sx={{
            padding: 'var(--sys-space-4)',
            marginBottom: 'var(--sys-space-4)',
            minHeight: '400px',
            backgroundColor: 'var(--sys-color-surface)',
            borderRadius: 'var(--sys-shape-corner-medium)',
            boxShadow: 'var(--sys-elevation-level-1)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'var(--sys-color-on-surface-variant)',
              textAlign: 'center',
              paddingTop: 'var(--sys-space-10)',
              paddingBottom: 'var(--sys-space-10)',
              fontSize: 'var(--sys-type-body-medium-size)',
              fontWeight: 'var(--sys-type-body-medium-weight)',
              lineHeight: 'var(--sys-type-body-medium-lineHeight)',
            }}
          >
            Document preview content will be rendered here
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)', justifyContent: 'flex-start' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack} sx={buttonStyles}>
            Back
          </Button>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit} sx={buttonStyles}>
            Edit
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={onSave} sx={buttonStyles}>
            Download & Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DocumentPreview;
