import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Resume file upload"
      />

      {/* Upload area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
        `}
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
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <div>
              <p className="text-sm font-medium">Processing your resume...</p>
              <p className="text-xs text-muted-foreground mt-1">
                This may take a few moments
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="w-10 h-10 mx-auto text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-sm font-medium">
                Drop your resume here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOCX, DOC, or TXT • Max 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mt-4 p-3 bg-destructive/15 border border-destructive/20 rounded-md">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-destructive">
                Upload Error
              </p>
              <p className="text-sm text-destructive/80 mt-1">
                {validationError.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
                className="mt-2 h-8"
              >
                Try Another File
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error with Retry */}
      {uploadError && (
        <div className="mt-4 p-3 bg-destructive/15 border border-destructive/20 rounded-md">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">
                Processing Failed
              </p>
              <p className="text-sm text-destructive/80 mt-1">
                {uploadError.message}
              </p>
              {retryCount > 0 && (
                <p className="text-xs text-destructive/60 mt-1">
                  Attempt {retryCount} of {maxRetries}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="h-8"
                  disabled={isProcessing}
                >
                  {retryCount < maxRetries ? 'Try Again' : 'Choose Different File'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: PDF, DOCX, DOC, TXT</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Your resume will be analyzed for skills and experience</p>
      </div>
    </div>
  );
}