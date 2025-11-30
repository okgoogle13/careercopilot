/**
 * Smart Upload Modal
 * AI-powered document upload with automatic tag suggestion
 */

import { CloudUpload, CheckCircle } from '@mui/icons-material';
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
import React, { useState } from 'react';

import { smartIngestionService } from '@/api/smartIngestionService';
import type { ContextTags } from '@/api/smartIngestionService';
import { isApiError } from '../types/api';

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
      
      if (isApiError(response)) {
        setError(response.message || 'Failed to process document');
        setStep('upload');
        return;
      }

      setSuggestedTags(response.data.suggestedTags);

      // Pre-select all suggested tags with confidence > 0.5
      const tagLabels = Object.keys(response.data.suggestedTags)
        .filter((key) => response.data.suggestedTags[key as keyof ContextTags] > 0.5)
        .map((key) => key.replace(/_/g, ' ').toUpperCase());
      setSelectedTags(tagLabels);
    } catch (error) {
      console.error('Error processing document:', error);
      setError('An unexpected error occurred while processing the document');
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
      const response = await smartIngestionService.extractAndSave({
        file,
        selectedTags,
        fileName: file.name,
      });

      if (isApiError(response)) {
        throw new Error(response.message || 'Failed to save document');
      }

      onUploadComplete({
        fileName: file.name,
        tags: selectedTags,
        ...response.data, // Include any additional data from the response
      });

      // Reset state
      handleClose();
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error instanceof Error ? error.message : 'Failed to save document');
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
      <DialogTitle
        sx={{
          fontSize: 'var(--sys-type-title-large-size)',
          fontWeight: 'var(--sys-type-title-large-weight)',
          lineHeight: 'var(--sys-type-title-large-lineHeight)',
        }}
      >
        {step === 'upload' && 'Upload Document'}
        {step === 'tagging' && 'Review & Tag Document'}
        {step === 'saving' && 'Saving Document'}
      </DialogTitle>

      <DialogContent sx={{ py: 'var(--sys-space-3)' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 'var(--sys-space-2)', borderRadius: 'var(--sys-shape-corner-small)' }}>
            {error}
          </Alert>
        )}

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
                bgcolor: (theme) => theme.palette.surface.containerHigh,
              },
            }}
            component="label"
          >
            <input type="file" hidden onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt" />
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
            <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)', mb: 'var(--sys-space-2)' }}>
              AI has analyzed your document. Select the tags that apply:
            </Typography>

            <Stack spacing={'var(--sys-space-2)'}>
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
                    sx={{
                      justifyContent: 'flex-start',
                      height: 'auto',
                      padding: 'var(--sys-space-1)',
                      backgroundColor: isSelected ? 'var(--sys-color-primary)' : 'transparent',
                      color: isSelected ? 'var(--sys-color-on-primary)' : 'var(--sys-color-on-surface)',
                      border: isSelected ? 'none' : '1px solid var(--sys-color-outline)',
                      borderRadius: 'var(--sys-shape-corner-small)',
                    }}
                  />
                );
              })}
            </Stack>

            <Typography variant="caption" sx={{ color: 'var(--sys-color-on-surface-variant)', mt: 'var(--sys-space-2)', display: 'block' }}>
              Confidence scores shown in parentheses. AI suggestions are pre-selected.
            </Typography>
          </Box>
        )}

        {step === 'saving' && (
          <Box sx={{ textAlign: 'center', py: 'var(--sys-space-4)' }}>
            <CircularProgress sx={{ mb: 'var(--sys-space-2)' }} />
            <Typography
              variant="body1"
              sx={{
                fontSize: 'var(--sys-type-body-large-size)',
                fontWeight: 'var(--sys-type-body-large-weight)',
                lineHeight: 'var(--sys-type-body-large-lineHeight)',
              }}
            >
              Saving your document...
            </Typography>
          </Box>
        )}

        {step === 'upload' && file && (
          <Box
            sx={{
              mt: 'var(--sys-space-2)',
              p: 'var(--sys-space-2)',
              backgroundColor: 'var(--sys-color-tertiary-container)',
              borderRadius: 'var(--sys-shape-corner-small)',
            }}
          >
            <Stack direction="row" spacing={'var(--sys-space-1)'} alignItems="center">
              <CheckCircle sx={{ color: 'var(--sys-color-on-tertiary-container)' }} />
              <Typography variant="body2" sx={{ color: 'var(--sys-color-on-tertiary-container)' }}>
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
          <Button onClick={() => setStep('tagging')} variant="contained" disabled={isLoading}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
