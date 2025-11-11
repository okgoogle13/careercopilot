/**
 * @file ConfirmTagsModal.tsx
 * @description A modal component for confirming AI-suggested tags and document type
 * after a file upload. It uses MUI for UI, react-hook-form for form management,
 * and Zod for validation.
 */

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import {
  UploadAndTagResponse,
  ExtractAndSaveRequest,
} from '../../schemas/api.schema';
import { contextTagsSchema } from '../../schemas/asset.schema';

// --- Form Validation Schema ---

// The form schema is a combination of fields needed for the ExtractAndSaveRequest.
const confirmTagsFormSchema = z.object({
  // We take the tags schema and modify the subsectors to be a string for the form input
  confirmedTags: contextTagsSchema.extend({
    subsectors: z.string().min(1, 'Please provide at least one subsector.'),
  }),
  documentType: z.enum(['resume', 'ksc', 'voice'], {
    required_error: 'You must select a document type.',
  }),
});

type ConfirmTagsFormValues = z.infer<typeof confirmTagsFormSchema>;

// --- Component Props ---

interface ConfirmTagsModalProps {
  open: boolean;
  onClose: () => void;
  data: UploadAndTagResponse;
  onSubmit: (data: ExtractAndSaveRequest) => void;
  isSubmitting: boolean;
}

// --- Helper Functions ---

/**
 * Formats file size from bytes to a more readable format.
 * @param bytes - The file size in bytes.
 * @returns A formatted string (e.g., "1.23 MB").
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- Main Component ---

export const ConfirmTagsModal: React.FC<ConfirmTagsModalProps> = ({
  open,
  onClose,
  data,
  onSubmit,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfirmTagsFormValues>({
    resolver: zodResolver(confirmTagsFormSchema),
    defaultValues: {
      confirmedTags: {
        roleType: '',
        subsectors: '',
      },
      documentType: undefined,
    },
  });

  // Populate form with suggested tags when data changes
  useEffect(() => {
    if (data) {
      reset({
        confirmedTags: {
          roleType: data.suggestedTags.roleType,
          subsectors: data.suggestedTags.subsectors.join(', '),
        },
        documentType: undefined, // User must always select this
      });
    }
  }, [data, reset]);

  const handleFormSubmit = (formValues: ConfirmTagsFormValues) => {
    // Transform form data to match the API request schema
    const requestPayload: ExtractAndSaveRequest = {
      fileId: data.fileId,
      confirmedTags: {
        ...formValues.confirmedTags,
        // Convert comma-separated string back to an array of strings
        subsectors: formValues.confirmedTags.subsectors.split(',').map(s => s.trim()).filter(Boolean),
      },
      documentType: formValues.documentType,
    };
    onSubmit(requestPayload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Confirm Document Details</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>File Information</Typography>
            <Typography variant="body2"><strong>File:</strong> {data.fileName}</Typography>
            <Typography variant="body2"><strong>Size:</strong> {formatFileSize(data.fileSizeBytes)}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Confirm AI Suggestions</Typography>
            <Controller
              name="confirmedTags.roleType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Primary Role Type"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmedTags?.roleType}
                  helperText={errors.confirmedTags?.roleType?.message}
                />
              )}
            />

            <Controller
              name="confirmedTags.subsectors"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Industry Subsectors"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmedTags?.subsectors}
                  helperText={errors.confirmedTags?.subsectors?.message || 'Enter comma-separated values'}
                />
              )}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset" error={!!errors.documentType}>
              <FormLabel component="legend">Document Type*</FormLabel>
              <Controller
                name="documentType"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="resume" control={<Radio />} label="Resume" />
                    <FormControlLabel value="ksc" control={<Radio />} label="KSC" />
                    <FormControlLabel value="voice" control={<Radio />} label="Voice Profile" />
                  </RadioGroup>
                )}
              />
              {errors.documentType && <FormHelperText>{errors.documentType.message}</FormHelperText>}
            </FormControl>
          </Box>

        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Extracting...' : 'Confirm & Extract'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
