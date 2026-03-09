import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@careercopilot/ui'; // Assuming shadcn button exists
import { validateFile } from '@/utils/fileValidation';

import { useAuth } from '@/context/AuthContext';

interface ResumeUploaderProps {
  onUploadSuccess?: (data: any) => void;
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const { session } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    await processUpload(files[0]);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUpload(e.target.files[0]);
    }
  }, []);

  const processUpload = async (file: File) => {
    const validation = validateFile(file, ['.pdf', '.txt']);
    if (!validation.valid) {
      setStatus('error');
      setErrorMessage(validation.error!);
      return;
    }

    setStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('files', file);

      const token = session?.access_token || null;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/career/ingest', {
        method: 'POST',
        body: formData,
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      setStatus('success');

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6 text-center">
        <h2 className="text-display-small font-bold text-on-surface mb-2">Upload Your Resume</h2>
        <p className="text-body-large text-on-surface-variant">
          Drop your PDF here to build your Career DNA profile
        </p>
      </div>

      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-tech min-h-[300px] flex flex-col items-center justify-center p-8 transition-colors cursor-pointer overflow-hidden',
          isDragging
            ? 'border-primary bg-primary-container/20'
            : 'border-outline-variant bg-surface-container'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resume-input')?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />

        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-march bg-surface-container-high flex items-center justify-center mb-4 shadow-sm">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-title-medium font-bold text-on-surface mb-1">
                Drag & Drop or Click to Upload
              </p>
              <p className="text-label-large text-tertiary">PDF or TXT up to 10MB</p>
            </motion.div>
          )}

          {status === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
              <p className="text-title-medium font-bold text-primary animate-pulse">
                Analyzing Career DNA...
              </p>
              <p className="text-body-medium text-on-surface-variant mt-2">
                Extracting skills, timeline, and achievements
              </p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-march bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-title-medium font-bold text-green-700">Analysis Complete!</p>
              <Button
                className="mt-6"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus('idle');
                }}
              >
                Upload Another
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-march bg-error-container flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-error" />
              </div>
              <p className="text-title-medium font-bold text-error">Upload Failed</p>
              <p className="text-body-medium text-on-error-container mt-2 mb-4">{errorMessage}</p>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus('idle');
                }}
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
