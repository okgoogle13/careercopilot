import React, { useState, forwardRef, useRef, DragEvent } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from './progress';

export interface FileUploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadProps {
  value?: FileUploadFile[];
  onChange?: (files: FileUploadFile[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      value = [],
      onChange,
      onUpload,
      accept,
      maxSize = 10 * 1024 * 1024, // 10MB default
      maxFiles,
      disabled,
      className = '',
      multiple = true,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
      if (disabled) return;

      let validFiles = files;

      // Check max files
      if (maxFiles && value.length + files.length > maxFiles) {
        validFiles = files.slice(0, maxFiles - value.length);
      }

      // Validate file sizes
      const uploadFiles: FileUploadFile[] = validFiles.map((file) => {
        if (file.size > maxSize) {
          return {
            file,
            progress: 0,
            status: 'error' as const,
            error: `File size exceeds ${formatFileSize(maxSize)}`,
          };
        }
        return {
          file,
          progress: 0,
          status: 'pending' as const,
        };
      });

      onChange?.([...value, ...uploadFiles]);

      // Simulate upload if onUpload is provided
      if (onUpload) {
        uploadFiles.forEach((uploadFile, index) => {
          if (uploadFile.status === 'pending') {
            simulateUpload(value.length + index);
          }
        });
      }
    };

    const simulateUpload = async (index: number) => {
      const newFiles = [...value];
      newFiles[index] = { ...newFiles[index], status: 'uploading' };
      onChange?.(newFiles);

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        newFiles[index] = { ...newFiles[index], progress };
        onChange?.([...newFiles]);
      }

      newFiles[index] = { ...newFiles[index], status: 'success', progress: 100 };
      onChange?.([...newFiles]);
    };

    const removeFile = (index: number) => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange?.(newFiles);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
      <div className={`w-full ${className}`}>
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative p-8 rounded-[var(--radius-lg)]
            border-2 border-dashed
            transition-all duration-300 cursor-pointer
            ${
              isDragging
                ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--tertiary)]/20 to-transparent shadow-[var(--shadow-glow-aurora)]'
                : 'border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] hover:border-[var(--glass-border-hover)]'
            }
            ${disabled && 'opacity-50 cursor-not-allowed'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={`
              p-4 rounded-full
              bg-gradient-to-br from-[var(--primary)]/20 to-[var(--tertiary)]/20
              border border-[var(--primary)]/30
            `}
            >
              <Upload className="w-8 h-8 text-[var(--primary)]" />
            </div>

            <div className="text-center">
              <p className="text-[var(--on-surface)] mb-1">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-[var(--on-surface-variant)]">
                {accept && `Accepted formats: ${accept}`}
                {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                {maxFiles && ` • Max files: ${maxFiles}`}
              </p>
            </div>
          </div>
        </div>

        {value.length > 0 && (
          <div className="mt-4 space-y-3">
            {value.map((uploadFile, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-[var(--radius-lg)]
                  bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
                  border-2 border-[var(--glass-border)]
                  transition-all duration-300
                `}
              >
                <div className="flex items-start gap-3">
                  <File className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[var(--on-surface)] truncate">{uploadFile.file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--on-surface-variant)] whitespace-nowrap">
                          {formatFileSize(uploadFile.file.size)}
                        </span>
                        {uploadFile.status === 'success' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-[var(--on-surface-variant)] hover:text-[var(--color-error)] transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-1" />
                    )}

                    {uploadFile.error && (
                      <p className="text-sm text-[var(--color-error)] mt-1">{uploadFile.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
