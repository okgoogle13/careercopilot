import React from 'react';
import { Box, Typography, Button, Container, alpha } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';

export interface DocumentsViewProps { onCreateDocument?: () => void; }

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onCreateDocument }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Documents</Typography>
            <Typography variant="body1" color="text.secondary">Manage your resumes, cover letters, and other career documents</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateDocument}>New Document</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, borderRadius: 3, border: 2, borderStyle: 'dashed', borderColor: (theme) => alpha(theme.palette.primary.main, 0.3), bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4), textAlign: 'center' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), mb: 3 }}>
            <DescriptionIcon sx={{ fontSize: 48, color: (theme) => theme.palette.primary.light }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>No Documents Yet</Typography>
          <Typography variant="body2" color="text.secondary">Click "New Document" to get started.</Typography>
        </Box>
      </Box>
    </Container>
  );
};
