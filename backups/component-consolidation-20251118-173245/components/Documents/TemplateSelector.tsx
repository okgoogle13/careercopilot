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
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Choose a Template
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select a template to get started with your {documentType}.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
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
