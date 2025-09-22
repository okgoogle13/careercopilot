import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { logError, logUserAction, logInfo } from '@/utils/logger';

interface UploadResumeProps {
  onUploadSuccess?: (file: File, analysisResult: any) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

interface ValidationError {
  type: 'size' | 'type' | 'general';
  message: string;
}

interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  // Add more analysis properties as needed
  extractedText?: string;
  skills?: string[];
  experience?: string;
}

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'text/plain', // .txt
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

export function UploadResume({ onUploadSuccess, onUploadError, className }: UploadResumeProps) {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxRetries = 3;

  const validateFile = (file: File): ValidationError | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        type: 'size',
        message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`
      };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension || '')) {
      return {
        type: 'type',
        message: `File type not supported. Please upload a PDF, DOCX, DOC, or TXT file. You uploaded: ${file.type || 'unknown type'}`
      };
    }

    return null;
  };

  const simulateFileProcessing = async (file: File): Promise<AnalysisResult> => {
    // Simulate processing time and potential failures
    const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    const shouldFail = Math.random() < 0.2; // 20% chance of failure

    await new Promise(resolve => setTimeout(resolve, processingTime));

    if (shouldFail) {
      throw new Error('Failed to process resume. Please try again.');
    }

    // Simulate successful analysis result
    return {
      id: Date.now().toString(),
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      extractedText: 'Sample extracted text from resume...',
      skills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
      experience: '5+ years in software development',
    };
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setValidationError(null);
    setUploadError(null);

    try {
      logUserAction('file_upload_started', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        retryAttempt: retryCount,
      });

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setValidationError(validationError);
        logError('File validation failed', new Error(validationError.message), undefined, {
          fileName: file.name,
          fileSize: file.size,
          validationType: validationError.type,
        });
        return;
      }

      logInfo('File validation passed, starting processing', {
        fileName: file.name,
        fileSize: file.size,
      });

      // Process file
      const startTime = performance.now();
      const result = await simulateFileProcessing(file);
      const processingTime = performance.now() - startTime;

      logUserAction('file_upload_success', {
        fileName: file.name,
        processingTimeMs: processingTime,
        retryAttempt: retryCount,
        resultId: result.id,
      });

      // Reset retry count on success
      setRetryCount(0);

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(file, result);
      }

    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Unknown upload error');
      setUploadError(uploadError);

      logError('File upload failed', uploadError, undefined, {
        fileName: file.name,
        fileSize: file.size,
        retryAttempt: retryCount,
        maxRetries,
      });

      if (onUploadError) {
        onUploadError(uploadError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    processFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    // Reset input value to allow uploading the same file again
    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFileSelect(event.dataTransfer.files);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries && fileInputRef.current?.files?.[0]) {
      setRetryCount(prev => prev + 1);
      processFile(fileInputRef.current.files[0]);
    } else {
      // Reset and allow user to select file again
      setRetryCount(0);
      setUploadError(null);
      fileInputRef.current?.click();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearError = () => {
    setValidationError(null);
    setUploadError(null);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 448, mx: 'auto', ...className }}>
      {/* Hidden file input */}
      <Box
        component="input"
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleInputChange}
        sx={{ display: 'none' }}
        aria-label="Resume file upload"
      />

      {/* Upload area */}
      <Paper
        elevation={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isProcessing ? openFileDialog : undefined}
        role="button"
        tabIndex={0}
        aria-label="Upload resume file by clicking or dragging"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isProcessing) {
            e.preventDefault();
            openFileDialog();
          }
        }}
        sx={{
          position: 'relative',
          border: `2px dashed ${
            dragActive ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.25)
          }`,
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          transition: 'all 0.2s ease-in-out',
          cursor: isProcessing ? 'default' : 'pointer',
          pointerEvents: isProcessing ? 'none' : 'auto',
          opacity: isProcessing ? 0.5 : 1,
          bgcolor: dragActive
            ? alpha(theme.palette.primary.main, 0.05)
            : 'transparent',
          '&:hover': !isProcessing ? {
            borderColor: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          } : {},
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        {isProcessing ? (
          <Stack spacing={2} alignItems="center">
            <CircularProgress
              size={32}
              sx={{ color: theme.palette.primary.main }}
            />
            <Box>
              <Typography variant="body2" fontWeight="500">
                Processing your resume...
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                This may take a few moments
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2} alignItems="center">
            <CloudUpload
              sx={{
                fontSize: 40,
                color: theme.palette.text.secondary
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight="500">
                Drop your resume here or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                PDF, DOCX, DOC, or TXT • Max 5MB
              </Typography>
            </Box>
          </Stack>
        )}
      </Paper>

      {/* Validation Error */}
      {validationError && (
        <Alert
          severity="error"
          icon={<Warning />}
          sx={{ mt: 2 }}
          action={
            <Button
              variant="outlined"
              size="small"
              onClick={clearError}
              sx={{
                height: 32,
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                '&:hover': {
                  borderColor: theme.palette.error.dark,
                  bgcolor: alpha(theme.palette.error.main, 0.04),
                }
              }}
            >
              Try Another File
            </Button>
          }
        >
          <AlertTitle>Upload Error</AlertTitle>
          {validationError.message}
        </Alert>
      )}

      {/* Upload Error with Retry */}
      {uploadError && (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mt: 2 }}
          action={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRetry}
                disabled={isProcessing}
                sx={{
                  height: 32,
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.dark,
                    bgcolor: alpha(theme.palette.error.main, 0.04),
                  }
                }}
              >
                {retryCount < maxRetries ? 'Try Again' : 'Choose Different File'}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={clearError}
                sx={{
                  height: 32,
                  color: theme.palette.error.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.04),
                  }
                }}
              >
                Cancel
              </Button>
            </Stack>
          }
        >
          <AlertTitle>Processing Failed</AlertTitle>
          <Typography variant="body2">
            {uploadError.message}
          </Typography>
          {retryCount > 0 && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
              Attempt {retryCount} of {maxRetries}
            </Typography>
          )}
        </Alert>
      )}

      {/* Instructions */}
      <Box sx={{ mt: 2 }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            • Supported formats: PDF, DOCX, DOC, TXT
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Maximum file size: 5MB
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • Your resume will be analyzed for skills and experience
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}