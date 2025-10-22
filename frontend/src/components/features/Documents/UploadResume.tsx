import { Upload, Description as FileText, Mail, EmojiEvents } from '@mui/icons-material';
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
import { DocumentUploadDropzone, UploadedFile } from '@/components/documents/DocumentUploadDropzone';
import { uploadAndCreateDocument } from '@/services/documentService';

interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

export function UploadResume({ onNext, onBack }: UploadResumeProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (
    files: UploadedFile[],
    type: 'resume' | 'cover-letter' | 'ksc'
  ) => {
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create Your Master Profile</h1>
          <p className="text-muted-foreground">
            Upload your existing documents. We'll build your profile from them.
          </p>
        </div>

        {/* Upload Areas */}
        <div className="space-y-6">
          {/* Resumes */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Resumes</h3>
                <p className="text-sm text-muted-foreground">
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
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Cover Letters</h3>
                <p className="text-sm text-muted-foreground">
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
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <EmojiEvents className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Selection Criteria Responses</h3>
                <p className="text-sm text-muted-foreground">
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
        <div className="flex justify-between mt-8">
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
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
