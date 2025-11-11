import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export interface ResumeBuilderProps {
  template: { id: string; name: string; type: 'resume' | 'cover-letter' };
  onNext: () => void;
  onBack: () => void;
  profileName?: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ template, onNext, onBack, profileName }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          {template.name} - {template.type === 'resume' ? 'Resume' : 'Cover Letter'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Edit your document using the AI-powered editor. {profileName && `Profile: ${profileName}`}
        </Typography>
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Document editor content will be rendered here
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ResumeBuilder;
