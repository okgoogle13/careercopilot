import { Download, Edit, Share as Share2, Delete as Trash2, Close as X } from '@mui/icons-material';
import React from 'react';
import { ATSScoreCircle } from '../features/Analysis/ATSScoreCircle';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Document } from './types';

interface DocumentPreviewModalProps {
  document: Document | null;
  onClose: () => void;
  onEdit?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onShare?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onEdit,
  onDownload,
  onShare,
  onDelete,
}) => {
  if (!document) return null;

  const formattedDate = document.lastModified.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <DialogTitle className="text-xl">{document.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {document.type} • {formattedDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {document.atsScore !== undefined && (
            <div className="flex items-center">
              <span className="text-sm mr-2">ATS Score:</span>
              <ATSScoreCircle score={document.atsScore} size="small" showScore={false} />
              <span className="ml-1 font-medium">{document.atsScore}</span>
            </div>
          )}
          <Button variant="text" size="small" onClick={onClose} className="ml-2" aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogHeader>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto py-6">
          {document.previewUrl ? (
            <div className="bg-muted/30 rounded-lg border border-border p-4 flex items-center justify-center">
              <img
                src={document.previewUrl}
                alt={`Preview of ${document.title}`}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-border">
              <p className="text-muted-foreground">No preview available</p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="space-x-2">
            <Button variant="outline" size="small" onClick={() => onEdit?.(document)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="small" onClick={() => onDownload?.(document)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="text" size="small" onClick={() => onShare?.(document)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => onDelete?.(document)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
