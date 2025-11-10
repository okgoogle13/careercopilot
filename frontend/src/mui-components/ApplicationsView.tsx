import React from 'react';
import { Box, Typography, Button, Container, alpha } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AddIcon from '@mui/icons-material/Add';

export interface ApplicationsViewProps { onAddApplication?: () => void; }

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onAddApplication }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Applications</Typography>
            <Typography variant="body1" color="text.secondary">Track and manage your job applications</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddApplication}>Add Application</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, borderRadius: 3, border: 2, borderStyle: 'dashed', borderColor: (theme) => alpha(theme.palette.primary.main, 0.3), bgcolor: (theme) => alpha(theme.palette.surface.containerHigh, 0.4), textAlign: 'center' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), mb: 3 }}>
            <TrackChangesIcon sx={{ fontSize: 48, color: '#A78BFA' }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>No Applications Tracked</Typography>
          <Typography variant="body2" color="text.secondary">Click "Add Application" to start tracking.</Typography>
        </Box>
      </Box>
    </Container>
  );
};
