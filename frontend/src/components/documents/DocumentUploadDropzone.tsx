import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, InsertDriveFile, Close, HourglassEmpty } from '@mui/icons-material';
import { Button, LinearProgress, Stack, Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface UploadedFile {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

interface DocumentUploadDropzoneProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: UploadedFile[]) => Promise<void>;
  showPreviews?: boolean;
  className?: string;
}

const DropzoneContainer = styled('div')<{ isDragActive: boolean; isUploading: boolean }>(
  ({ theme, isDragActive, isUploading }) => ({
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    transition: theme.transitions.create(['border-color', 'background-color']),
    cursor: 'pointer',
    backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
    opacity: isUploading ? 0.5 : 1,
    pointerEvents: isUploading ? 'none' : 'auto',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  })
);

const PreviewImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: 160,
  objectFit: 'contain',
  borderRadius: 4,
});

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

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
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
      }

      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, maxFiles));
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
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
      const filesWithProgress = files.map((file) => ({ ...file, progress: 0 }));
      setFiles([...filesWithProgress]);

      const interval = setInterval(() => {
        setFiles((prevFiles) =>
          prevFiles.map((f) => ({ ...f, progress: Math.min(f.progress! + 10, 90) }))
        );
      }, 200);

      await onUpload(files);

      clearInterval(interval);
      setFiles((prevFiles) => prevFiles.map((f) => ({ ...f, progress: 100 })));

      setTimeout(() => setFiles([]), 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setFiles((prevFiles) =>
        prevFiles.map((f) => ({ ...f, error: 'Upload failed. Please try again.' }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Stack spacing={2} className={className}>
      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive} isUploading={isUploading}>
        <input {...getInputProps()} />
        <Stack alignItems="center" spacing={1}>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              color: 'primary.main',
            }}
          >
            <Upload />
          </Box>
          <Typography variant="body1" fontWeight="medium">
            {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {`${Object.values(accept).flat().join(', ')} (max ${maxSize / 1024 / 1024}MB)`}
          </Typography>
        </Stack>
      </DropzoneContainer>

      {files.length > 0 && (
        <Stack spacing={1.5}>
          {files.map((file, index) => (
            <Box
              key={`${file.file.name}-${index}`}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <Box sx={{ p: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                    <InsertDriveFile fontSize="small" color="action" />
                  </Box>
                  <Stack>
                    <Typography variant="body2" fontWeight="medium" sx={{ maxWidth: 250 }} noWrap>
                      {file.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton size="small" onClick={() => removeFile(index)} disabled={isUploading}>
                  <Close fontSize="small" />
                </IconButton>
              </Stack>

              {file.progress !== undefined && file.progress > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      {file.progress < 100 ? 'Uploading...' : 'Uploaded'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >{`${Math.round(file.progress)}%`}</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={file.progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}

              {file.error && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {file.error}
                </Typography>
              )}

              {showPreviews && file.preview && (
                <Box
                  sx={{
                    mt: 1.5,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <PreviewImage src={file.preview} alt="Preview" />
                </Box>
              )}
            </Box>
          ))}

          <Stack direction="row" justifyContent="flex-end" spacing={1} pt={1}>
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
              startIcon={isUploading ? <HourglassEmpty /> : null}
            >
              {isUploading
                ? 'Uploading...'
                : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
