import React, { useState, useCallback, useRef } from 'react';
import { Card, Button } from './';
import {
  Upload, X, FileText, Image as ImageIcon, File,
  Check, AlertCircle, Download, Eye, RotateCcw,
  Camera, FolderOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface MultiFileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  allowedExtensions?: string[];
  showPreview?: boolean;
  className?: string;
  disabled?: boolean;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onFilesChange,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  maxFiles = 10,
  maxSize = 10, // 10MB default
  allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
  showPreview = true,
  className,
  disabled = false
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && !allowedExtensions.includes(extension)) {
      return `File type .${extension} is not supported`;
    }

    return null;
  };

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const processFiles = async (fileList: FileList) => {
    if (files.length + fileList.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validation = validateFile(file);

      if (validation) {
        toast.error(`${file.name}: ${validation}`);
        continue;
      }

      const preview = await createFilePreview(file);

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        status: 'uploading',
        progress: 0
      };

      newFiles.push(uploadedFile);
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Simulate upload progress
    newFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id);
    });

    onFilesChange?.(updatedFiles);
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;

      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, status: 'success', progress: 100 } : f
        ));
        toast.success(`${files.find(f => f.id === fileId)?.name} uploaded successfully`);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    const removedFile = files.find(f => f.id === fileId);
    if (removedFile) {
      toast.success(`${removedFile.name} removed`);
    }
  };

  const retryUpload = (fileId: string) => {
    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'uploading', progress: 0, error: undefined } : f
    ));
    simulateUpload(fileId);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [disabled, files, maxFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const getFileIcon = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <div className="mb-4">
            <Upload className={cn(
              'mx-auto w-12 h-12',
              isDragging ? 'text-blue-500' : 'text-gray-400'
            )} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {isDragging ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-sm text-gray-600">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-xs text-gray-500">
              Supports: {allowedExtensions.map(ext => `.${ext}`).join(', ')}
              (Max {maxFiles} files, {maxSize}MB each)
            </p>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Browse Files
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              disabled={disabled}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </div>
      </Card>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File Preview Grid */}
      {files.length > 0 && showPreview && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Uploaded Files ({files.length}/{maxFiles})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFiles([]);
                onFilesChange?.([]);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => {
              const FileIcon = getFileIcon(file);

              return (
                <Card key={file.id} className="p-4">
                  <div className="space-y-3">
                    {/* File Preview/Icon */}
                    <div className="relative">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Status Overlay */}
                      <div className="absolute top-2 right-2">
                        {file.status === 'success' && (
                          <div className="bg-green-500 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        {file.status === 'error' && (
                          <div className="bg-red-500 text-white rounded-full p-1">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Uploading...</span>
                            <span>{Math.round(file.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {file.status === 'error' && file.error && (
                        <p className="text-xs text-red-600">{file.error}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {file.preview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.preview, '_blank')}
                            className="h-7 w-7 p-0"
                            title="Preview"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        )}

                        {file.status === 'success' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const url = URL.createObjectURL(file.file);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = file.name;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="h-7 w-7 p-0"
                            title="Download"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        )}

                        {file.status === 'error' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryUpload(file.id)}
                            className="h-7 w-7 p-0"
                            title="Retry"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
