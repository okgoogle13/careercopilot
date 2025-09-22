import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

export interface UploadedFile {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

interface DocumentUploadDropzoneProps {
  /**
   * Accepted file types (MIME types)
   * @default ['.pdf', '.doc', '.docx', '.txt']
   */
  accept?: Record<string, string[]>;
  /**
   * Maximum file size in bytes
   * @default 5MB
   */
  maxSize?: number;
  /**
   * Maximum number of files
   * @default 1
   */
  maxFiles?: number;
  /**
   * Callback when files are selected
   */
  onUpload: (files: UploadedFile[]) => Promise<void>;
  /**
   * Whether to show file previews
   * @default true
   */
  showPreviews?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

export const DocumentUploadDropzone: React.FC<DocumentUploadDropzoneProps> = ({
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  onUpload,
  showPreviews = true,
  className,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setDragActive(false);
      
      // Handle rejected files
      if (fileRejections.length > 0) {
        const rejectedMessages = fileRejections.map(({ file, errors }) => {
          const messages = errors.map((e: any) => {
            if (e.code === 'file-too-large') return 'File is too large';
            if (e.code === 'file-invalid-type') return 'Invalid file type';
            return e.message;
          });
          return `${file.name}: ${messages.join(', ')}`;
        });
        
        console.error('Rejected files:', rejectedMessages.join('\n'));
        // You might want to show these errors to the user
      }

      // Create previews for accepted files
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
      }));

      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles, ...newFiles].slice(0, maxFiles);
        return updatedFiles;
      });
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const filesWithProgress = files.map(file => ({
        ...file,
        progress: 0,
      }));
      
      setFiles([...filesWithProgress]);
      
      // Update progress (in a real app, this would be tied to actual upload progress)
      const interval = setInterval(() => {
        setFiles(prevFiles =>
          prevFiles.map(f => ({
            ...f,
            progress: Math.min(f.progress! + 10, 90), // Cap at 90% until complete
          }))
        );
      }, 200);
      
      // Call the provided upload handler
      await onUpload(files);
      
      // Complete the progress
      clearInterval(interval);
      setFiles(prevFiles =>
        prevFiles.map(f => ({
          ...f,
          progress: 100,
        }))
      );
      
      // Clear files after a short delay
      setTimeout(() => {
        setFiles([]);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      // Update files with error state
      setFiles(prevFiles =>
        prevFiles.map(f => ({
          ...f,
          error: 'Upload failed. Please try again.',
        }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          'hover:border-primary/50 cursor-pointer',
          dragActive ? 'border-primary bg-primary/5' : 'border-border',
          isUploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">
              {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {`${Object.values(accept)
                .flat()
                .join(', ')} (max ${maxSize / 1024 / 1024}MB)`}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div
              key={`${file.file.name}-${index}`}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-md bg-muted">
                    <File className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate max-w-xs">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {file.progress !== undefined && file.progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {file.progress < 100 ? 'Uploading...' : 'Uploaded'}
                    </span>
                    <span>{Math.round(file.progress)}%</span>
                  </div>
                  <Progress value={file.progress} className="h-2" />
                </div>
              )}

              {file.error && (
                <p className="text-sm text-destructive mt-1">{file.error}</p>
              )}

              {showPreviews && file.preview && (
                <div className="mt-3 border rounded-md overflow-hidden">
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="w-full h-auto max-h-40 object-contain"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setFiles([])}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
