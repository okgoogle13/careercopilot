import { useRef, useState } from 'react';
import { Placard } from '../../../components/ui/Placard';
import { RedlineActionBar } from './RedlineActionBar';
import { documentService } from '@/api/documentService';

export interface DocumentRedlineUploadPanelProps {
  documentId: number;
  documentName: string;
  onCancel: () => void;
  onSuccess: (blob: Blob, filename: string) => void;
}

export function DocumentRedlineUploadPanel({
  documentId: _documentId,
  documentName,
  onCancel,
  onSuccess,
}: DocumentRedlineUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [editsJson, setEditsJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!file) {
      setError('Select a DOCX file to redline.');
      return;
    }

    let parsedEdits: unknown;
    try {
      parsedEdits = JSON.parse(editsJson);
    } catch {
      setError('Edits field contains invalid JSON. Fix it before submitting.');
      return;
    }

    if (!Array.isArray(parsedEdits)) {
      setError('Edits must be a JSON array.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { blob, filename } = await documentService.processRedline(
        _documentId,
        file,
        parsedEdits
      );
      onSuccess(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const textareaStyle: React.CSSProperties = {
    backgroundColor: 'var(--sys-color-charcoalBackground-base)',
    color: 'var(--sys-color-paperWhite)',
    borderRadius: 'var(--sys-shape-blockRiot02)',
    border: '2px solid var(--sys-color-concreteGrey-base)',
    fontFamily: 'var(--sys-type-font-mono)',
    fontSize: '0.8125rem',
    lineHeight: 1.6,
    resize: 'vertical',
    width: '100%',
    padding: '0.75rem 1rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--sys-type-font-work-sans)',
    color: 'var(--sys-color-worker-ash-base)',
    display: 'block',
    marginBottom: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  return (
    <Placard
      elevation="floating"
      header={
        <div>
          <h2
            className="text-xl font-black"
            style={{
              fontFamily: 'var(--sys-type-font-fraunces)',
              color: 'var(--sys-color-paperWhite)',
            }}
          >
            Redline Workspace
          </h2>
          <p
            className="mt-1 text-sm"
            style={{
              fontFamily: 'var(--sys-type-font-work-sans)',
              color: 'var(--sys-color-worker-ash-base)',
            }}
          >
            {documentName}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* File upload */}
        <div>
          <label
            style={labelStyle}
            htmlFor="redline-file-input"
          >
            DOCX File
          </label>
          <input
            id="redline-file-input"
            ref={fileInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.625rem 1rem',
              borderRadius: 'var(--sys-shape-blockRiot02)',
              border: '2px solid var(--sys-color-concreteGrey-base)',
              backgroundColor: 'var(--sys-color-charcoalBackground-base)',
              color: 'var(--sys-color-worker-ash-base)',
              fontFamily: 'var(--sys-type-font-work-sans)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
            data-testid="redline-file-input"
          />
          {file && (
            <p
              className="mt-1 text-xs"
              style={{
                color: 'var(--sys-color-concreteGrey-base)',
                fontFamily: 'var(--sys-type-font-mono)',
              }}
            >
              {file.name}
            </p>
          )}
        </div>

        {/* Edits JSON textarea */}
        <div>
          <label
            style={labelStyle}
            htmlFor="redline-edits-input"
          >
            Edits (JSON array)
          </label>
          <textarea
            id="redline-edits-input"
            rows={8}
            placeholder='[{"find": "old text", "replace": "new text"}]'
            value={editsJson}
            onChange={(e) => {
              setEditsJson(e.target.value);
              setError(null);
            }}
            style={textareaStyle}
            data-testid="redline-edits-input"
          />
        </div>

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="text-sm"
            style={{
              color: 'var(--sys-color-solidarityRed-base)',
              fontFamily: 'var(--sys-type-font-work-sans)',
            }}
            data-testid="redline-error"
          >
            {error}
          </p>
        )}

        <RedlineActionBar
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </Placard>
  );
}
