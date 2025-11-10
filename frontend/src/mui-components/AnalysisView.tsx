import React from 'react';
import { Box, Typography, Button, Container, alpha } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import UploadIcon from '@mui/icons-material/Upload';

export interface AnalysisViewProps { onAnalyzeDocument?: () => void; }

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onAnalyzeDocument }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>ATS Analysis</Typography>
            <Typography variant="body1" color="text.secondary">Get AI-powered insights on your resume's ATS compatibility</Typography>
          </Box>
          <Button variant="contained" startIcon={<UploadIcon />} onClick={onAnalyzeDocument} sx={{ bgcolor: 'tertiary.main', '&:hover': { bgcolor: 'tertiary.dark' } }}>Analyze Document</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, borderRadius: 3, border: 2, borderStyle: 'dashed', borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.3), bgcolor: (theme) => alpha(theme.palette.surface.containerHigh, 0.4), textAlign: 'center' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12), mb: 3 }}>
            <BarChartIcon sx={{ fontSize: 48, color: '#F472B6' }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Ready for Analysis</Typography>
          <Typography variant="body2" color="text.secondary">Upload a document to get your ATS score.</Typography>
        </Box>
      </Box>
    </Container>
  );
};
