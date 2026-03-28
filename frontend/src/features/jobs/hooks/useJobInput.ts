import { useState } from 'react';
import { jobService, JobListing } from '../../../api/jobService';

interface UseJobInputProps {
  onAnalyze: (
    jobTitle: string,
    companyName: string,
    rawText: string
  ) => Promise<JobListing | null | void>;
}

export function useJobInput({ onAnalyze }: UseJobInputProps) {
  const [jobUrl, setJobUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const [extractedRole, setExtractedRole] = useState('');
  const [extractedCompany, setExtractedCompany] = useState('');
  const [isEditingChips, setIsEditingChips] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtractedUrl, setLastExtractedUrl] = useState('');
  const [lastExtractedText, setLastExtractedText] = useState('');

  // Extension stubbed
  const isInstalled = false;

  const handleUrlBlur = async () => {
    if (jobUrl && jobUrl !== lastExtractedUrl && !isExtracting) {
      setIsExtracting(true);
      try {
        const result = await jobService.extractJobFromUrl(jobUrl);
        setExtractedRole(result.title || '');
        setExtractedCompany(result.company || '');
        setLastExtractedUrl(jobUrl);
      } catch (err) {
        console.error('Failed to extract basic details from URL:', err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleTextProcess = async (text: string) => {
    setRawText(text);
    if (text && text !== lastExtractedText && !isExtracting) {
      setIsExtracting(true);
      try {
        const result = await jobService.extractJobFromText(text);
        setExtractedRole(result.title || '');
        setExtractedCompany(result.company || '');
        setLastExtractedText(text);
      } catch (err) {
        console.error('Failed to extract basic details from text:', err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleFileProcess = async (
    files: File[],
    text?: string,
    fileData?: { data: string; mimeType: string }[]
  ) => {
    if (text) {
      handleTextProcess(text);
    } else if (fileData && fileData.length > 0) {
      setIsExtracting(true);
      try {
        const result = await jobService.extractJobFromText(fileData[0].data);
        setExtractedRole(result.title || '');
        setExtractedCompany(result.company || '');
      } catch (err) {
        console.error('Failed to extract details from file data:', err);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleAnalyze = async () => {
    await onAnalyze(extractedRole, extractedCompany, rawText || jobUrl);
  };

  return {
    jobUrl,
    setJobUrl,
    rawText,
    setRawText,
    isManualExpanded,
    setIsManualExpanded,
    extractedRole,
    setExtractedRole,
    extractedCompany,
    setExtractedCompany,
    isEditingChips,
    setIsEditingChips,
    isExtracting,
    isInstalled,
    handleUrlBlur,
    handleTextProcess,
    handleFileProcess,
    handleAnalyze,
  };
}
