/**
 * @file UploadResume.tsx
 * @description This component orchestrates the multi-step "Smart Ingestion" workflow,
 * managing file uploads, tag confirmation, and data extraction. It functions as a state
 * machine, guiding the user through the process and providing clear feedback at each stage.
 */
import { UploadFile } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Snackbar,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';

import type { UploadedFile } from '@/components/documents/DocumentUploadDropzone';
import { DocumentUploadDropzone } from '@/components/documents/DocumentUploadDropzone';
import {
  uploadAndTagFile,
  extractAndSaveData,
  ApiServiceError,
} from '@/services/ingestion.service';
import type {
  UploadAndTagResponse,
  ExtractAndSaveRequest,
} from '@/schemas/api.schema';
import { ConfirmTagsModal } from '@/components/ingestion/ConfirmTagsModal';

// --- Helper Components for different states ---

const ProgressLoading = ({ progress, text }: { progress: number; text: string }) => (
  <Box textAlign="center" p={4}>
    <Typography variant="h6" gutterBottom>{text}</Typography>
    <LinearProgress variant="determinate" value={progress} />
    <Typography variant="body1" mt={2}>{`${progress}%`}</Typography>
  </Box>
);

const SpinnerLoading = ({ text }: { text: string }) => (
  <Box textAlign="center" p={4}>
    <CircularProgress />
    <Typography variant="h6" mt={2}>{text}</Typography>
  </Box>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <Box textAlign="center" p={4}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
    <Button variant="contained" onClick={onRetry}>
      Retry
    </Button>
  </Box>
);


// --- Main Component ---

type IngestionStatus = 'idle' | 'uploading' | 'confirming_tags' | 'extracting' | 'success' | 'error';

interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

export function UploadResume({ onNext, onBack }: UploadResumeProps) {
  const [status, setStatus] = useState<IngestionStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResponse, setUploadResponse] = useState<UploadAndTagResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetState = () => {
    setStatus('idle');
    setUploadProgress(0);
    setUploadResponse(null);
    setError(null);
  };

  const handleUpload = async (files: UploadedFile[]) => {
    const file = files[0]?.file;
    if (!file) return;

    setStatus('uploading');
    setError(null);

    try {
      const response = await uploadAndTagFile(file, setUploadProgress);
      setUploadResponse(response);
      setStatus('confirming_tags');
    } catch (err) {
      const errorMessage = err instanceof ApiServiceError ? err.message : 'An unknown error occurred during upload.';
      setError(errorMessage);
      setStatus('error');
    }
  };

  const handleConfirmTagsSubmit = async (data: ExtractAndSaveRequest) => {
    setStatus('extracting');
    try {
      const response = await extractAndSaveData(data);
      setSuccessMessage(response.message || 'Successfully processed your document!');
      setStatus('success');
      // The onNext() will be called after the success snackbar is shown
    } catch (err) {
      const errorMessage = err instanceof ApiServiceError ? err.message : 'Failed to process the document.';
      setError(errorMessage);
      setStatus('error');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UploadFile className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Upload Document</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a resume, KSC, or voice profile to get started.
                </p>
              </div>
            </div>
            <DocumentUploadDropzone
              onUpload={handleUpload}
              maxFiles={1}
              showPreviews={true}
            />
          </Card>
        );
      case 'uploading':
        return <ProgressLoading progress={uploadProgress} text="Uploading document..." />;
      case 'extracting':
        return <SpinnerLoading text="Extracting key information..." />;
      case 'error':
        return <ErrorState message={error || 'An unknown error occurred.'} onRetry={resetState} />;
      case 'confirming_tags':
      case 'success':
        // Modal and Snackbar handle UI during these states
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Smart Document Ingestion</h1>
          <p className="text-muted-foreground">
            Let's analyze your document to build your career profile automatically.
          </p>
        </div>

        <div className="space-y-6">
          {renderContent()}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outlined" onClick={onBack} disabled={status !== 'idle'}>
            Back
          </Button>
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90"
            disabled={status !== 'idle'}
          >
            Skip & Continue Manually
          </Button>
        </div>

        {uploadResponse && (
          <ConfirmTagsModal
            open={status === 'confirming_tags'}
            onClose={() => resetState()}
            data={uploadResponse}
            onSubmit={handleConfirmTagsSubmit}
            isSubmitting={status === 'extracting'}
          />
        )}

        <Snackbar
          open={status === 'success'}
          autoHideDuration={3000}
          onClose={() => onNext()} // Navigate after snackbar closes
          message={successMessage}
        >
           <Alert severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
