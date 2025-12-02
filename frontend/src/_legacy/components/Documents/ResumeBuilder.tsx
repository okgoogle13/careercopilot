import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

export interface ResumeBuilderProps {
  template: { id: string; name: string; type: 'resume' | 'cover-letter' };
  onNext: () => void;
  onBack: () => void;
  profileName?: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ template, onNext, onBack, profileName }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 'var(--sys-space-4)' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'var(--sys-type-headline-small-weight)',
            fontSize: 'var(--sys-type-headline-small-size)',
            lineHeight: 'var(--sys-type-headline-small-lineHeight)',
            mb: 'var(--sys-space-2)',
          }}
        >
          {template.name} - {template.type === 'resume' ? 'Resume' : 'Cover Letter'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'var(--sys-color-on-surface-variant)',
            mb: 'var(--sys-space-4)',
            fontSize: 'var(--sys-type-body-large-size)',
            fontWeight: 'var(--sys-type-body-large-weight)',
            lineHeight: 'var(--sys-type-body-large-lineHeight)',
          }}
        >
          Edit your document using the AI-powered editor. {profileName && `Profile: ${profileName}`}
        </Typography>
        <Paper
          sx={{
            p: 'var(--sys-space-4)',
            bgcolor: 'var(--sys-color-surface)',
            borderRadius: 'var(--sys-shape-corner-medium)',
            boxShadow: 'var(--sys-elevation-level-1)',
            mb: 'var(--sys-space-4)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'var(--sys-color-on-surface-variant)',
              fontSize: 'var(--sys-type-body-medium-size)',
              fontWeight: 'var(--sys-type-body-medium-weight)',
              lineHeight: 'var(--sys-type-body-medium-lineHeight)',
            }}
          >
            Document editor content will be rendered here
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResumeBuilder;
