import { Download, Edit, Share as Share2, Delete as Trash2, Close as X } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';

import { ATSScoreCircle } from '../features/Analysis/ATSScoreCircle';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

import type { Document } from './types';

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
      <DialogHeader sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      pb: 4,
      borderBottom: 1
    }}>
        <div>
          <DialogTitle sx={{
      typography: "h5"
    }}>{document.title}</DialogTitle>
          <p sx={{
      typography: "body1",}}>
            {document.type} • {formattedDate}
          </p>
        </div>
        <div sx={{
      display: "flex",
      alignItems: "center",}}>
          {document.atsScore !== undefined && (
            <div sx={{
      display: "flex",
      alignItems: "center"
    }}>
              <span sx={{
      typography: "body1",
      mr: 2
    }}>ATS Score:</span>
              <ATSScoreCircle score={document.atsScore} size="small" showScore={false} />
              <span sx={{
      ml: 1,
      fontWeight: 500
    }}>{document.atsScore}</span>
            </div>
          )}
          <Button variant="link" size="small" onClick={onClose} sx={{
      ml: 2
    }} aria-label="Close">
            <X sx={{}} />
          </Button>
        </div>
      </DialogHeader>
      <DialogContent sx={{
      h: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
        <div sx={{
      flex: 1,
      overflow: "auto",
      py: 6
    }}>
          {document.previewUrl ? (
            <div sx={{
      borderRadius: "0.5rem",
      border: 1,
      p: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
              <img
                src={document.previewUrl}
                alt={`Preview of ${document.title}`}
                sx={{
      maxWidth: "100%",
      h: "60vh",}}
              />
            </div>
          ) : (
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.5rem",
      border: 1,
      borderStyle: "dashed",}}>
              <p sx={{}}>No preview available</p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogFooter>
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pt: 4,
      borderTop: 1
    }}>
          <div sx={{}}>
            <Button variant="outline" size="small" onClick={() => onEdit?.(document)}>
              <Edit sx={{
      mr: 2
    }} />
              Edit
            </Button>
            <Button variant="outline" size="small" onClick={() => onDownload?.(document)}>
              <Download sx={{
      mr: 2
    }} />
              Download
            </Button>
          </div>
          <div sx={{}}>
            <Button variant="link" size="small" onClick={() => onShare?.(document)}>
              <Share2 sx={{
      mr: 2
    }} />
              Share
            </Button>
            <Button
              variant="link"
              size="small"
              onClick={() => onDelete?.(document)}
              sx={{
      '&:hover': {}
    }}
            >
              <Trash2 sx={{
      mr: 2
    }} />
              Delete
            </Button>
          </div>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
