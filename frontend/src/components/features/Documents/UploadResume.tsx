import { Upload, Description as FileText, Mail, EmojiEvents } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';

import type { UploadedFile } from '@/components/documents/DocumentUploadDropzone';
import { DocumentUploadDropzone } from '@/components/documents/DocumentUploadDropzone';
import { uploadAndCreateDocument } from '@/services/documentService';

interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

export function UploadResume({ onNext, onBack }: UploadResumeProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (files: UploadedFile[], type: 'resume' | 'cover-letter' | 'ksc') => {
    try {
      for (const { file } of files) {
        await uploadAndCreateDocument(file, type);
      }
      setUploadSuccess(true);
      setUploadError(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    }
  };

  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 4
    }}>
      <div sx={{
      "max-w-2xl": true,
      "mx-auto": true
    }}>
        {/* Header */}
        <div sx={{
      textAlign: "center",
      mb: 8
    }}>
          <h1 sx={{
      typography: h4,
      fontWeight: 600,
      mb: 2
    }}>Create Your Master Profile</h1>
          <p sx={{
      "text-muted-foreground": true
    }}>
            Upload your existing documents. We'll build your profile from them.
          </p>
        </div>

        {/* Upload Areas */}
        <div sx={{
      "space-y-6": true
    }}>
          {/* Resumes */}
          <Card sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 4
    }}>
              <div sx={{
      p: 2,
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                <FileText sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
              </div>
              <div>
                <h3 sx={{
      fontWeight: 600
    }}>Resumes</h3>
                <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                  Upload your current resume(s) in PDF or Word format
                </p>
              </div>
            </div>
            <DocumentUploadDropzone
              onUpload={(files) => handleUpload(files, 'resume')}
              maxFiles={5}
              showPreviews={false}
            />
          </Card>

          {/* Cover Letters */}
          <Card sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 4
    }}>
              <div sx={{
      p: 2,
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                <Mail sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
              </div>
              <div>
                <h3 sx={{
      fontWeight: 600
    }}>Cover Letters</h3>
                <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                  Upload any existing cover letters for reference
                </p>
              </div>
            </div>
            <DocumentUploadDropzone
              onUpload={(files) => handleUpload(files, 'cover-letter')}
              maxFiles={5}
              showPreviews={false}
            />
          </Card>

          {/* Selection Criteria */}
          <Card sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 4
    }}>
              <div sx={{
      p: 2,
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                <EmojiEvents sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
              </div>
              <div>
                <h3 sx={{
      fontWeight: 600
    }}>Selection Criteria Responses</h3>
                <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                  Upload any previous selection criteria responses
                </p>
              </div>
            </div>
            <DocumentUploadDropzone
              onUpload={(files) => handleUpload(files, 'ksc')}
              maxFiles={5}
              showPreviews={false}
            />
          </Card>
        </div>

        {/* Actions */}
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      mt: 8
    }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }}>
            Continue to Profile Creation
          </Button>
        </div>

        {/* Success/Error notifications */}
        <Snackbar
          open={uploadSuccess}
          autoHideDuration={6000}
          onClose={() => setUploadSuccess(false)}
        >
          <Alert severity="success" onClose={() => setUploadSuccess(false)}>
            Document uploaded successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={!!uploadError} autoHideDuration={6000} onClose={() => setUploadError(null)}>
          <Alert severity="error" onClose={() => setUploadError(null)}>
            {uploadError}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
