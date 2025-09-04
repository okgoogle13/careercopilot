import React, { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
// @ts-expect-error - Temporary workaround for type issues
import Dropzone from 'react-dropzone';
import { cn } from '../ui/utils';

interface DocumentUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  className = '',
  disabled = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setError(null);

      // Handle rejected files
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const error = rejection.errors[0];
        if (error.code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB`);
        } else if (error.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a document file.');
        } else {
          setError('Error uploading file. Please try again.');
        }
        return;
      }

      // Handle accepted files
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files at a time.`);
        return;
      }

      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    [files, maxFiles, maxSize]
  );

  const dropzoneConfig = {
    onDrop,
    accept: accept as any, // Type assertion to fix type issues
    maxSize,
    multiple: maxFiles > 1,
    disabled,
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      setError(null);
      await onUpload(files);
      setFiles([]);
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Dropzone {...dropzoneConfig}>
        {({
          getRootProps,
          getInputProps,
          isDragActive,
        }: {
          getRootProps: () => any;
          getInputProps: () => any;
          isDragActive: boolean;
        }) => (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center justify-center space-y-2'>
              <Upload className='h-8 w-8 text-gray-400' />
              {isDragActive ? (
                <p className='font-medium'>Drop the files here</p>
              ) : (
                <>
                  <p className='font-medium'>Drag and drop files here, or click to select</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Supported formats: PDF, DOC, DOCX, TXT (max {maxSize / (1024 * 1024)}MB)
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </Dropzone>

      {error && (
        <div className='text-sm text-destructive flex items-center gap-2'>
          <X className='w-4 h-4' />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-medium text-foreground'>Files to upload</h4>
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className='flex items-center justify-between p-2 bg-muted/30 rounded-md'
              >
                <div className='flex items-center gap-2 min-w-0'>
                  <FileText className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                  <span className='text-sm truncate'>{file.name}</span>
                  <span className='text-xs text-muted-foreground'>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6'
                  onClick={e => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className='w-3.5 h-3.5' />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className='w-full mt-2'
          >
            {isUploading
              ? 'Uploading...'
              : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
