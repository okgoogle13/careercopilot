import React from 'react';
import { Box, Typography, Button, Container, alpha } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';

export interface OpportunitiesViewProps { onAnalyzeJob?: () => void; }

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ onAnalyzeJob }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Opportunities</Typography>
            <Typography variant="body1" color="text.secondary">Discover and analyze job opportunities that match your profile</Typography>
          </Box>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={onAnalyzeJob} sx={{ bgcolor: 'tertiary.main', '&:hover': { bgcolor: 'tertiary.dark' } }}>Analyze Job</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, borderRadius: 3, border: 2, borderStyle: 'dashed', borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.3), bgcolor: (theme) => alpha(theme.palette.surface.containerHigh, 0.4), textAlign: 'center' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12), mb: 3 }}>
            <WorkIcon sx={{ fontSize: 48, color: '#F472B6' }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Find Your Next Role</Typography>
          <Typography variant="body2" color="text.secondary">Use the "Analyze Job" feature to get started.</Typography>
        </Box>
      </Box>
    </Container>
  );
};
