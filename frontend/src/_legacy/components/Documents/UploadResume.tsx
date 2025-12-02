import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface UploadResumeProps { onNext: () => void; onBack: () => void; }

export const UploadResume: React.FC<UploadResumeProps> = ({ onNext, onBack }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--sys-color-surface)', py: 'var(--sys-space-4)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 'var(--sys-space-6)' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'var(--sys-type-brand-font-family)',
              fontWeight: 'var(--sys-type-headline-small-weight)',
              fontSize: 'var(--sys-type-headline-small-size)',
              lineHeight: 'var(--sys-type-headline-small-lineHeight)',
              mb: 'var(--sys-space-1)',
            }}
          >
            Create Your Master Profile
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--sys-color-on-surface-variant)',
              fontSize: 'var(--sys-type-body-large-size)',
              fontWeight: 'var(--sys-type-body-large-weight)',
              lineHeight: 'var(--sys-type-body-large-lineHeight)',
            }}
          >
            Upload your existing documents. We'll extract the information to build your profile.
          </Typography>
        </Box>
        <Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level-1)' }}>
          <CardContent sx={{ p: 'var(--sys-space-4)' }}>
            <Box
              data-testid="upload-area"
              sx={{
                border: '2px dashed var(--sys-color-outline-variant)',
                borderRadius: 'var(--sys-shape-corner-small)',
                p: 'var(--sys-space-6)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard)',
                '&:hover': {
                  borderColor: 'var(--sys-color-primary)',
                  backgroundColor: 'rgba(var(--sys-color-primary-rgb), 0.02)',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            >
              <Box
                sx={{
                  p: 'var(--sys-space-2)',
                  borderRadius: 'var(--sys-shape-corner-full)',
                  backgroundColor: 'rgba(var(--sys-color-primary-rgb), 0.12)',
                  display: 'inline-block',
                  mb: 'var(--sys-space-2)',
                }}
              >
                <UploadIcon sx={{ fontSize: 32, color: 'var(--sys-color-primary)' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'var(--sys-type-title-medium-weight)',
                  fontSize: 'var(--sys-type-title-medium-size)',
                  lineHeight: 'var(--sys-type-title-medium-lineHeight)',
                  mb: 'var(--sys-space-1)',
                }}
              >
                Drag & Drop Your Resume
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--sys-color-on-surface-variant)', mb: 'var(--sys-space-2)' }}
              >
                or click to browse files
              </Typography>
              <Button variant="outlined">Upload Files</Button>
              <Typography
                variant="caption"
                display="block"
                sx={{ color: 'var(--sys-color-on-surface-variant)', mt: 'var(--sys-space-2)' }}
              >
                Supported formats: PDF, DOCX, TXT
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'var(--sys-space-4)' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>Back</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onNext}>Next</Button>
        </Box>
      </Container>
    </Box>
  );
};
