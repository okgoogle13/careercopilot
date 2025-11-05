/**
 * Application Generator Modal
 * One-click job application package generation
 */

import { CheckCircle, FileText, Mail, Send } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material';
import React, { useState } from 'react';

import { workflowService } from '../services/workflowService';
import type { ApplicationPackage } from '../services/workflowService';
import { ApiResponse, isApiError } from '../types/api';

interface ApplicationGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  onSuccess?: (applicationPackage: ApplicationPackage) => void;
}

const steps = ['Prepare Documents', 'Customize Content', 'Review', 'Submit'];

export const ApplicationGeneratorModal: React.FC<ApplicationGeneratorModalProps> = ({
  open,
  onClose,
  jobTitle,
  jobDescription,
  companyName,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationPackage, setApplicationPackage] = useState<ApplicationPackage | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGeneratePackage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate the application package
      const response = await workflowService.generateApplicationPackage({
        jobTitle,
        jobDescription,
        companyName,
      });

      if (isApiError(response)) {
        setError(response.message || 'Failed to generate application package');
        return;
      }

      setApplicationPackage(response.data);
      setActiveStep(2); // Skip to review step
    } catch (error) {
      console.error('Error generating application package:', error);
      setError('Failed to generate application package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!applicationPackage) return;

    setIsLoading(true);
    setError(null);

    try {
      setActiveStep(3);
      setProgress(33);

      // Simulate submission process with progress updates
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(66);

      // In a real app, you would call an API endpoint here
      // For example:
      // const response = await applicationService.submitApplication(applicationPackage);
      // if (isApiError(response)) {
      //   throw new Error(response.message);
      // }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(100);

      onSuccess?.(applicationPackage);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit application');
      setActiveStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Job Application</DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Job Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Job Position
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {jobTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {companyName}
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ minHeight: 200 }}>
          {activeStep === 0 && (
            <Stack spacing={2}>
              <Typography variant="body1" gutterBottom>
                We'll generate a complete application package with:
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Tailored resume optimized for this job</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Custom cover letter addressing the role</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Key Selection Criteria responses</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">ATS optimization analysis</Typography>
                </Box>
              </Stack>
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={2}>
              <Typography variant="body1" gutterBottom>
                Customizing your application...
              </Typography>
              <CircularProgress />
            </Stack>
          )}

          {activeStep === 2 && applicationPackage && (
            <Stack spacing={2}>
              <Typography variant="body1" gutterBottom fontWeight={600}>
                Review Your Application Package
              </Typography>

              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FileText sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2">Resume</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Tailored for {jobTitle} position
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Mail sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2">Cover Letter</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Custom message addressing company and role
                    </Typography>
                  </Box>

                  {applicationPackage.kscResponses && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Key Selection Criteria
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {applicationPackage.kscResponses.map((_, idx) => (
                          <Chip key={idx} label={`KSC ${idx + 1}`} size="small" />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Typography variant="caption" color="text.secondary">
                You can further customize these documents after submission
              </Typography>
            </Stack>
          )}

          {activeStep === 3 && (
            <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
              {progress < 100 ? (
                <>
                  <CircularProgress variant="determinate" value={progress} />
                  <Typography variant="body2">Submitting your application...</Typography>
                  <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
                </>
              ) : (
                <>
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
                  <Typography variant="h6">Application Submitted!</Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Your application package has been generated and is ready to send
                  </Typography>
                </>
              )}
            </Stack>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        {activeStep === 0 && (
          <Button onClick={handleGeneratePackage} variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Generate Package'}
          </Button>
        )}
        {activeStep === 2 && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Send />}
            disabled={isLoading}
          >
            Submit Application
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
