import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Loader2, FileX } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFPreviewProps {
  file?: File | string; // File object or URL
  className?: string;
  showControls?: boolean;
  initialScale?: number;
  onLoadSuccess?: (pdf: any) => void;
  onLoadError?: (error: Error) => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  file,
  className,
  showControls = true,
  initialScale = 1.0,
  onLoadSuccess,
  onLoadError,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(initialScale);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      setNumPages(pdf.numPages);
      setPageNumber(1);
      setError(null);
      setLoading(false);
      onLoadSuccess?.(pdf);
    },
    [onLoadSuccess]
  );

  const onDocumentLoadError = useCallback(
    (error: Error) => {
      setError(error.message);
      setLoading(false);
      setNumPages(0);
      setPageNumber(1);
      onLoadError?.(error);
    },
    [onLoadError]
  );

  const onPageLoadStart = useCallback(() => {
    setLoading(true);
  }, []);

  const onPageLoadSuccess = useCallback(() => {
    setLoading(false);
  }, []);

  const onPageLoadError = useCallback((error: Error) => {
    setError(error.message);
    setLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(3, prev + 0.25));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  }, []);

  const downloadPDF = useCallback(() => {
    if (typeof file === 'string') {
      // If file is a URL, trigger download
      const link = document.createElement('a');
      link.href = file;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file) {
      // If file is a File object, create object URL and download
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!file) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg',
          className
        )}
      >
        <div className='text-center'>
          <FileX className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-sm text-muted-foreground'>No PDF file provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {showControls && (
        <div className='flex items-center justify-between p-4 border-b bg-muted/30'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || loading}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='text-sm font-medium px-2'>
              {pageNumber} / {numPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={goToNextPage}
              disabled={pageNumber >= numPages || loading}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={zoomOut}
              disabled={scale <= 0.5 || loading}
            >
              <ZoomOut className='h-4 w-4' />
            </Button>
            <span className='text-sm font-medium px-2'>{Math.round(scale * 100)}%</span>
            <Button variant='outline' size='sm' onClick={zoomIn} disabled={scale >= 3 || loading}>
              <ZoomIn className='h-4 w-4' />
            </Button>
          </div>

          <Button variant='outline' size='sm' onClick={downloadPDF} disabled={loading}>
            <Download className='h-4 w-4' />
          </Button>
        </div>
      )}

      <div className='flex-1 overflow-auto bg-muted/10'>
        <div className='flex items-center justify-center min-h-full p-4'>
          {loading && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span className='text-sm'>Loading PDF...</span>
            </div>
          )}

          {error && (
            <div className='text-center'>
              <FileX className='h-12 w-12 text-destructive mx-auto mb-4' />
              <p className='text-sm text-destructive mb-2'>Failed to load PDF</p>
              <p className='text-xs text-muted-foreground'>{error}</p>
            </div>
          )}

          {!error && (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              error={null}
              className='flex items-center justify-center'
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadStart={onPageLoadStart}
                onLoadSuccess={onPageLoadSuccess}
                onLoadError={onPageLoadError}
                loading={null}
                error={null}
                className='shadow-lg'
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
