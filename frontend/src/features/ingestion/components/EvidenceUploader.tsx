import React, { useState } from 'react';
import {
    M3Button,
    M3Card,
    M3Select,
    M3IconButton
} from '@/components/ui';
import { UploadCloud, FileText, ChevronDown } from 'lucide-react';
import { m3Toast } from '@/utils/toast';

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
        <M3Card
            variant="tech"
            padding="none"
            className="border-2 border-dashed border-[var(--color-eucalypt-smoke-base)]/30 bg-transparent overflow-hidden"
        >
            <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--ref-palette-primary-90)] flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-[var(--ref-palette-primary-40)]" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bloom text-lg font-bold text-[var(--color-parchment)]">
                        Strategic Evidence Uploader
                    </h3>
                    <p className="font-field-note text-sm text-[var(--color-flannel-flower-dark)]">
                        Upload historical artifacts to enrich your professional vector.
                    </p>
                </div>
            </div>

            <div className="px-6 pb-6 flex gap-4 items-center flex-wrap">
                <div className="min-w-[220px]">
                    <M3Select
                        options={documentOptions}
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as SourceType)}
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
                    <M3Button
                        variant="filled"
                        color="secondary"
                        onClick={() => { }} // Controlled by label/input
                        disabled={isUploading}
                        loading={isUploading}
                        startIcon={<FileText className="w-5 h-5" />}
                        className="h-[56px] px-8"
                    >
                        {isUploading ? 'Synthesizing...' : 'Seed Intelligence'}
                    </M3Button>
                </label>
            </div>
        </M3Card>
    );
};
