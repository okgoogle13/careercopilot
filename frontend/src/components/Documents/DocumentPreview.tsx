import React from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

export interface DocumentPreviewProps {
  documentId: string;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  documentType: 'resume' | 'cover-letter' | 'selection-criteria';
  templateName: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  onBack,
  onEdit,
  onSave,
  documentType,
  templateName,
}) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          {templateName} - Preview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Review your {documentType} before saving or downloading.
        </Typography>

        <Paper sx={{ p: 4, mb: 4, minHeight: '400px', bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
            Document preview content will be rendered here
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
            Back
          </Button>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
            Edit
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={onSave}>
            Download & Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DocumentPreview;
