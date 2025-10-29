/**
 * Smart Upload Modal
 * AI-powered document upload with automatic tag suggestion
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import { smartIngestionService, ContextTags } from '../api/smartIngestionService';

interface SmartUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (document: any) => void;
}

export const SmartUploadModal: React.FC<SmartUploadModalProps> = ({
  open,
  onClose,
  onUploadComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'tagging' | 'saving'>('upload');
  const [suggestedTags, setSuggestedTags] = useState<ContextTags | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    // Start the upload and tagging process
    setStep('tagging');
    setIsLoading(true);

    try {
      // Upload and get tag suggestions
      const response = await smartIngestionService.uploadAndTag(selectedFile);
      setSuggestedTags(response.suggestedTags);

      // Pre-select all suggested tags
      const tagLabels = Object.keys(response.suggestedTags)
        .filter((key) => response.suggestedTags[key as keyof ContextTags] > 0.5)
        .map((key) => key.replace(/_/g, ' ').toUpperCase());
      setSelectedTags(tagLabels);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process document');
      setStep('upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!file) return;

    setIsLoading(true);
    setStep('saving');

    try {
      await smartIngestionService.extractAndSave({
        file,
        selectedTags,
        fileName: file.name,
      });

      onUploadComplete({
        fileName: file.name,
        tags: selectedTags,
      });

      // Reset state
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save document');
      setStep('tagging');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setStep('upload');
    setSuggestedTags(null);
    setSelectedTags([]);
    setError(null);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {step === 'upload' && 'Upload Document'}
        {step === 'tagging' && 'Review & Tag Document'}
        {step === 'saving' && 'Saving Document'}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {step === 'upload' && (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt"
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & drop your document
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse (PDF, DOC, DOCX, TXT)
            </Typography>
          </Box>
        )}

        {step === 'tagging' && suggestedTags && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AI has analyzed your document. Select the tags that apply:
            </Typography>

            <Stack spacing={2}>
              {Object.entries(suggestedTags).map(([key, confidence]) => {
                const label = key.replace(/_/g, ' ').toUpperCase();
                const isSelected = selectedTags.includes(label);
                const showTag = confidence > 0.3;

                if (!showTag) return null;

                return (
                  <Chip
                    key={key}
                    label={`${label} (${Math.round(confidence * 100)}%)`}
                    onClick={() => toggleTag(label)}
                    variant={isSelected ? 'filled' : 'outlined'}
                    color={isSelected ? 'primary' : 'default'}
                    sx={{ justifyContent: 'flex-start', height: 'auto' }}
                  />
                );
              })}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Confidence scores shown in parentheses. AI suggestions are pre-selected.
            </Typography>
          </Box>
        )}

        {step === 'saving' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">Saving your document...</Typography>
          </Box>
        )}

        {step === 'upload' && file && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircle color="success" />
              <Typography variant="body2">
                Selected: {file.name}
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {step === 'tagging' && (
          <Button
            onClick={handleSaveDocument}
            variant="contained"
            disabled={isLoading || selectedTags.length === 0}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Document'}
          </Button>
        )}
        {step === 'upload' && file && (
          <Button
            onClick={() => setStep('tagging')}
            variant="contained"
            disabled={isLoading}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
