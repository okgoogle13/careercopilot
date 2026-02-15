import { Jar, Pebble, Stone } from '@/components/ui';
import { m3Toast } from '@/utils/toast';
import { FileText, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';

const API_BASE_URL = '/api';

type SourceType = 'resume' | 'cover_letter' | 'ksc_response';

export const EvidenceUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<SourceType>('ksc_response');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_type', selectedType);

    try {
      const response = await fetch(`${API_BASE_URL}/ingest/artifacts/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      m3Toast.success('Success', `Ingested ${file.name}`);
    } catch (error) {
      console.error(error);
      m3Toast.error('Upload Failed', error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const documentOptions = [
    { value: 'ksc_response', label: 'KSC Response' },
    { value: 'cover_letter', label: 'Cover Letter' },
    { value: 'resume', label: 'Past Resume' },
  ];

  return (
    <Stone
      mode="KrDark"
      className="p-0 border-2 border-dashed border-[var(--sys-color-worker-ash-base)]/30 bg-transparent overflow-hidden"
    >
      <div className="p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--sys-color-inkGold-base)]/10 flex items-center justify-center">
          <UploadCloud className="w-6 h-6 text-[var(--sys-color-inkGold-base)]" />
        </div>
        <div className="flex-grow">
          <h3 className="font-bloom text-lg font-bold text-[var(--sys-color-worker-ash-steps-6)]">
            Strategic Evidence Uploader
          </h3>
          <p className="font-field-note text-sm text-[var(--sys-color-worker-ash-steps-2)]">
            Upload historical artifacts to enrich your professional vector.
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-4 items-center flex-wrap">
        <div className="min-w-[220px]">
          <Jar
            options={documentOptions}
            value={selectedType}
            onChange={(val: string) => setSelectedType(val as SourceType)}
            label="Knowledge Domain"
          />
        </div>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          disabled={isUploading}
        />

        <label htmlFor="file-upload">
          <Pebble
            variant="secondary"
            onClick={() => {}} // Controlled by label/input
            disabled={isUploading}
            isLoading={isUploading}
            iconLeft={<FileText className="w-5 h-5" />}
            className="h-[56px] px-8"
          >
            {isUploading ? 'Synthesizing...' : 'Seed Intelligence'}
          </Pebble>
        </label>
      </div>
    </Stone>
  );
};
