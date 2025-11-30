import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, Grid } from '@mui/material';
import FileTextIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface DocumentTypeSelectorProps {
  onSelect: (type: 'resume' | 'cover-letter' | 'selection-criteria') => void;
  onBack: () => void;
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ onSelect, onBack }) => {
  const documentTypes = [
    { id: 'resume', label: 'Resume', description: 'Create a tailored resume for the job' },
    { id: 'cover-letter', label: 'Cover Letter', description: 'Write a compelling cover letter' },
    { id: 'selection-criteria', label: 'Selection Criteria', description: 'Address selection criteria' },
  ];

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
            What would you like to create?
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
            Select the type of document you want to generate for this opportunity.
          </Typography>
        </Box>

        <Grid container spacing={'var(--sys-space-3)'} sx={{ mb: 'var(--sys-space-4)' }}>
          {documentTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)',
                  borderRadius: 'var(--sys-shape-corner-medium)',
                  boxShadow: 'var(--sys-elevation-level-1)',
                  '&:hover': {
                    boxShadow: 'var(--sys-elevation-level-2)',
                    transform: 'translateY(calc(-1 * var(--sys-space-1)))',
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                    transform: 'none',
                  },
                }}
                onClick={() => onSelect(type.id as 'resume' | 'cover-letter' | 'selection-criteria')}
              >
                <CardContent sx={{ textAlign: 'center', py: 'var(--sys-space-4)' }}>
                  <FileTextIcon sx={{ fontSize: 48, color: 'var(--sys-color-primary)', mb: 'var(--sys-space-2)' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'var(--sys-type-title-medium-weight)',
                      fontSize: 'var(--sys-type-title-medium-size)',
                      lineHeight: 'var(--sys-type-title-medium-lineHeight)',
                      mb: 'var(--sys-space-1)',
                    }}
                  >
                    {type.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--sys-color-on-surface-variant)',
                      fontSize: 'var(--sys-type-body-medium-size)',
                      fontWeight: 'var(--sys-type-body-medium-weight)',
                      lineHeight: 'var(--sys-type-body-medium-lineHeight)',
                    }}
                  >
                    {type.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
            Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
