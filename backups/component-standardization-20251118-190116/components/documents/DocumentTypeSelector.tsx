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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>
            What would you like to create?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select the type of document you want to generate for this opportunity.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {documentTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all var(--sys-motion-duration-medium2)',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => onSelect(type.id as 'resume' | 'cover-letter' | 'selection-criteria')}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <FileTextIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {type.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
