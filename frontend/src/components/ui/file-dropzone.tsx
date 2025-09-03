import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, AlertCircle, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Progress } from './progress';

export interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

export interface FileValidation {
  maxSize?: number; // in bytes
  maxFiles?: number;
  accept?: string[]; // mime types or extensions
  validateFile?: (file: File) => string | null; // return error message or null if valid
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileDropzoneProps {
  files?: FileWithPreview[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (files: FileWithPreview[]) => void;
  onFileRemove?: (file: FileWithPreview) => void;
  validation?: FileValidation;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  uploadProgress?: UploadProgress[];
  onUpload?: (files: FileWithPreview[]) => void;
  showPreview?: boolean;
  previewClassName?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function validateFile(file: File, validation?: FileValidation): string | null {
  if (!validation) return null;

  // Check file size
  if (validation.maxSize && file.size > validation.maxSize) {
    return `File size must be less than ${formatFileSize(validation.maxSize)}`;
  }

  // Check file type
  if (validation.accept && validation.accept.length > 0) {
    const isValidType = validation.accept.some(type => {
      if (type.startsWith('.')) {
        // Extension check
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      } else {
        // MIME type check
        return file.type === type || file.type.startsWith(type.replace('*', ''));
      }
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${validation.accept.join(', ')}`;
    }
  }

  // Custom validation
  if (validation.validateFile) {
    return validation.validateFile(file);
  }

  return null;
}

export function FileDropzone({
  files = [],
  onFilesChange,
  onFilesAdded,
  onFileRemove,
  validation,
  disabled = false,
  multiple = true,
  className,
  uploadProgress = [],
  onUpload,
  showPreview = true,
  previewClassName,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback((newFiles: File[]) => {
    const processedFiles: FileWithPreview[] = [];
    const newErrors: string[] = [];

    newFiles.forEach((file, index) => {
      // Validate file
      const error = validateFile(file, validation);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
        return;
      }

      // Check max files limit
      if (validation?.maxFiles && files.length + processedFiles.length >= validation.maxFiles) {
        newErrors.push(`Maximum ${validation.maxFiles} files allowed`);
        return;
      }

      // Create file with preview
      const fileWithPreview: FileWithPreview = {
        ...file,
        id: `file-${Date.now()}-${index}`,
      };

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string;
          // Trigger re-render if needed
          onFilesChange?.(files.map(f => f.id === fileWithPreview.id ? fileWithPreview : f));
        };
        reader.readAsDataURL(file);
      }

      processedFiles.push(fileWithPreview);
    });

    setErrors(newErrors);

    if (processedFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...processedFiles] : processedFiles;
      onFilesChange?.(updatedFiles);
      onFilesAdded?.(processedFiles);
    }
  }, [files, validation, multiple, onFilesChange, onFilesAdded]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounterRef.current = 0;

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [disabled, addFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFiles]);

  const handleRemoveFile = useCallback((fileToRemove: FileWithPreview) => {
    const updatedFiles = files.filter(file => file.id !== fileToRemove.id);
    onFilesChange?.(updatedFiles);
    onFileRemove?.(fileToRemove);
  }, [files, onFilesChange, onFileRemove]);

  const handleBrowseClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const getFileProgress = useCallback((file: FileWithPreview): UploadProgress | null => {
    return uploadProgress.find(progress => progress.file.name === file.name) || null;
  }, [uploadProgress]);

  const acceptString = validation?.accept?.join(',');

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-all',
          'hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          isDragOver && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          !disabled && 'cursor-pointer'
        )}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptString}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="sr-only"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full',
            isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isDragOver ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground">
              {validation?.accept && `Accepted formats: ${validation.accept.join(', ')}`}
              {validation?.maxSize && ` • Max size: ${formatFileSize(validation.maxSize)}`}
              {validation?.maxFiles && ` • Max files: ${validation.maxFiles}`}
            </p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Upload Errors</span>
          </div>
          <ul className="text-sm text-destructive space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && showPreview && (
        <div className={cn('mt-4 space-y-2', previewClassName)}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
            {onUpload && (
              <Button
                onClick={() => onUpload(files)}
                size="sm"
                disabled={disabled || files.length === 0}
              >
                Upload Files
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {files.map((file) => {
              const progress = getFileProgress(file);

              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 border rounded-md bg-card"
                >
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <File className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {progress && (
                        <>
                          {progress.status === 'uploading' && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          )}
                          {progress.status === 'success' && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                          {progress.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>

                    {/* Progress Bar */}
                    {progress && progress.status === 'uploading' && (
                      <Progress value={progress.progress} className="mt-1 h-1" />
                    )}

                    {/* Error Message */}
                    {progress && progress.status === 'error' && progress.error && (
                      <p className="text-xs text-destructive mt-1">{progress.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file);
                    }}
                    disabled={disabled || (progress?.status === 'uploading')}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized FileDropzone for images
interface ImageDropzoneProps extends Omit<FileDropzoneProps, 'validation'> {
  maxImageSize?: number;
  allowedImageTypes?: string[];
}

export function ImageDropzone({
  maxImageSize = 5 * 1024 * 1024, // 5MB
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ...props
}: ImageDropzoneProps) {
  const validation: FileValidation = {
    maxSize: maxImageSize,
    accept: allowedImageTypes,
    validateFile: (file: File) => {
      if (!file.type.startsWith('image/')) {
        return 'Only image files are allowed';
      }
      return null;
    },
  };

  return <FileDropzone {...props} validation={validation} />;
}

// Specialized FileDropzone for documents
interface DocumentDropzoneProps extends Omit<FileDropzoneProps, 'validation'> {
  maxDocumentSize?: number;
  allowedDocumentTypes?: string[];
}

export function DocumentDropzone({
  maxDocumentSize = 10 * 1024 * 1024, // 10MB
  allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pdf',
    '.doc',
    '.docx'
  ],
  ...props
}: DocumentDropzoneProps) {
  const validation: FileValidation = {
    maxSize: maxDocumentSize,
    accept: allowedDocumentTypes,
  };

  return <FileDropzone {...props} validation={validation} />;
}