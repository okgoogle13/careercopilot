import React from 'react';
import { FileText, Download, Trash2, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

export interface DocumentCardProps {
  document: {
    id: string;
    originalFilename: string;
    fileType: string;
    size: number;
    createdAt: { _seconds: number } | Date;
    downloadUrl?: string;
  };
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
  onDelete,
  className = '',
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCreatedAt = () => {
    if (document.createdAt instanceof Date) {
      return format(document.createdAt, 'PPpp');
    }
    return format(new Date(document.createdAt._seconds * 1000), 'PPpp');
  };

  return (
    <div
      className={`bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow ${className}`}
    >
      <div className='flex items-start gap-3'>
        <div className='bg-primary/10 p-3 rounded-lg'>
          <FileText className='w-6 h-6 text-primary' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-foreground truncate'>{document.originalFilename}</h3>
          <div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
            <span className='capitalize'>{document.fileType}</span>
            <span>•</span>
            <span>{formatFileSize(document.size)}</span>
            <span>•</span>
            <div className='flex items-center gap-1'>
              <Clock className='w-3.5 h-3.5' />
              <span>{getCreatedAt()}</span>
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          {onDownload && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDownload(document.id)}
              aria-label={`Download ${document.originalFilename}`}
            >
              <Download className='w-4 h-4' />
            </Button>
          )}
          {onDelete && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(document.id)}
              className='text-destructive hover:text-destructive hover:bg-destructive/10'
              aria-label={`Delete ${document.originalFilename}`}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
