import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { UploadCloud, FileText } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = '/api'; // Using relative proxy path

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

            toast.success(`Ingested ${file.name}`);
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <Card sx={{
            mb: 3,
            border: '2px dashed var(--sys-color-outline-variant)',
            backgroundColor: 'var(--sys-color-surface-container-low)',
            boxShadow: 'none'
        }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <UploadCloud size={24} color="var(--sys-color-primary)" />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontSize="1rem" fontWeight="bold">Evidence Uploader</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Upload past KSCs and Cover Letters to power the Gap Hunter.
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ pt: 0, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 200, backgroundColor: 'var(--sys-color-surface)' }}>
                    <InputLabel>Document Type</InputLabel>
                    <Select
                        value={selectedType}
                        label="Document Type"
                        onChange={(e) => setSelectedType(e.target.value as SourceType)}
                    >
                        <MenuItem value="ksc_response">KSC Response</MenuItem>
                        <MenuItem value="cover_letter">Cover Letter</MenuItem>
                        <MenuItem value="resume">Past Resume</MenuItem>
                    </Select>
                </FormControl>

                <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />

                <label htmlFor="file-upload">
                    <Button
                        variant="contained"
                        component="span"
                        disabled={isUploading}
                        startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <FileText size={20} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 'var(--sys-shape-corner-extra-large)'
                        }}
                    >
                        {isUploading ? 'Ingesting...' : 'Select File'}
                    </Button>
                </label>
            </CardContent>
        </Card>
    );
};
