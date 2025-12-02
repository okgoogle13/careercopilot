import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface TemplateSelectorProps {
  documentType: 'resume' | 'cover-letter' | 'selection-criteria';
  onSelectTemplate: (templateId: string, type: 'resume' | 'cover-letter') => void;
  onBack: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ documentType, onSelectTemplate, onBack }) => {
  const templates = [
    { id: 'modern-minimal', name: 'Modern Minimal', type: 'resume' as const },
    { id: 'executive-pro', name: 'Executive Pro', type: 'resume' as const },
    { id: 'creative-portfolio', name: 'Creative Portfolio', type: 'resume' as const },
    { id: 'ats-optimized', name: 'ATS Optimized', type: 'resume' as const },
    { id: 'cover-professional', name: 'Professional Cover', type: 'cover-letter' as const },
    { id: 'cover-modern', name: 'Modern Cover', type: 'cover-letter' as const },
  ];

  const filteredTemplates = templates.filter(t => t.type === (documentType === 'selection-criteria' ? 'resume' : documentType));

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
          Choose a Template
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
          Select a template to get started with your {documentType}.
        </Typography>

        <Grid container spacing={'var(--sys-space-3)'} sx={{ mb: 'var(--sys-space-4)' }}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard)',
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
              >
                <CardContent sx={{ textAlign: 'center', py: 'var(--sys-space-4)' }}>
                  <Box
                    sx={{
                      p: 'var(--sys-space-3)',
                      backgroundColor: 'var(--sys-color-surface-container)',
                      borderRadius: 'var(--sys-shape-corner-small)',
                      mb: 'var(--sys-space-2)',
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
                      {template.name}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => onSelectTemplate(template.id, template.type)}
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default TemplateSelector;
