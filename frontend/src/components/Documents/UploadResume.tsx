import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, alpha } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface UploadResumeProps { onNext: () => void; onBack: () => void; }

export const UploadResume: React.FC<UploadResumeProps> = ({ onNext, onBack }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Create Your Master Profile</Typography>
          <Typography variant="body1" color="text.secondary">Upload your existing documents. We'll extract the information to build your profile.</Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ border: 2, borderStyle: 'dashed', borderColor: 'outline.variant', borderRadius: 2, p: 6, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02) } }}>
              <Box sx={{ p: 2, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), display: 'inline-block', mb: 2 }}>
                <UploadIcon sx={{ fontSize: 32, color: (theme) => theme.palette.primary.light }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Drag & Drop Your Resume</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>or click to browse files</Typography>
              <Button variant="outlined">Upload Files</Button>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>Supported formats: PDF, DOCX, TXT</Typography>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>Back</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onNext}>Next</Button>
        </Box>
      </Container>
    </Box>
  );
};
