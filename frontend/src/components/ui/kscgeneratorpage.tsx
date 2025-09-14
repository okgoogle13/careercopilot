import { KscCriterionCard } from '@/components/KSC/KscCriterionCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { generateKscResponses, generateSingleKscResponse } from '@/api/aiServices';
import React, { useState } from 'react';

export const KscGeneratorPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [detectedKsc, setDetectedKsc] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    try {
      const kscResponses = await generateKscResponses(jobDescription);
      setDetectedKsc(kscResponses);
    } catch (error) {
      console.error('KSC Generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate KSC responses');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateResponse = async (criterion: string): Promise<string> => {
    try {
      return await generateSingleKscResponse(criterion, jobDescription);
    } catch (error) {
      console.error('Single KSC generation failed:', error);
      throw error;
    }
  };

  return (
    <div className={cn('container mx-auto p-8', 'bg-background', 'min-h-screen')}>
      <div className={cn('max-w-4xl mx-auto', 'space-y-8')}>
        <h1 className={cn('text-3xl font-semibold', 'text-foreground', 'text-center')}>
          Key Selection Criteria Generator
        </h1>

        <Textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder='Paste your job description here to detect Key Selection Criteria...'
          className='min-h-[200px]'
        />

        <Button
          onClick={handleAnalyze}
          disabled={!jobDescription || isAnalyzing}
          className='w-full'
        >
          {isAnalyzing
            ? 'Generating KSC Responses...'
            : 'Generate Key Selection Criteria Responses'}
        </Button>

        {error && (
          <div
            className={cn(
              'p-4',
              'bg-destructive/10',
              'border border-destructive/20',
              'rounded-md',
              'text-destructive'
            )}
          >
            {error}
          </div>
        )}

        {detectedKsc.length > 0 && (
          <div className='space-y-6'>
            <h2 className={cn('text-2xl font-semibold', 'text-foreground')}>
              Generated KSC Responses
            </h2>

            <div className='space-y-4'>
              {detectedKsc.map((response, index) => (
                <div
                  key={index}
                  className={cn('p-4', 'bg-card', 'border border-border', 'rounded-md')}
                >
                  <div className={cn('text-sm', 'text-foreground', 'whitespace-pre-wrap')}>
                    {response}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
