import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { cn } from '@/lib/utils';
import { Editor } from '@/components/ui/editor';
import { generateCoverLetter } from '@/api/aiServices';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

type ToneSetting = 'Formal' | 'Casual' | 'Enthusiastic';

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [tone, setTone] = useState<ToneSetting>('Formal');

  const handleGenerateCoverLetter = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const coverLetter = await generateCoverLetter(jobDescription, tone.toLowerCase());
      setGeneratedCoverLetter(coverLetter);
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn('container mx-auto p-8', 'bg-background', 'min-h-screen')}>
      <div className={cn('grid md:grid-cols-2 gap-8', 'max-w-6xl mx-auto')}>
        {/* Left Panel: Job Description */}
        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Job Description</h2>

          <TextField
            fullWidth
            multiline
            minRows={6}
            placeholder="Paste the job description here to generate a tailored cover letter..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />

          <div className="flex items-center gap-4">
            <FormControl sx={{ width: 180 }}>
              <InputLabel>Tone</InputLabel>
              <Select
                data-testid="tone-selector"
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value as ToneSetting)}
              >
                {['Formal', 'Casual', 'Enthusiastic'].map((toneOption) => (
                  <MenuItem key={toneOption} value={toneOption}>
                    {toneOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Button
            onClick={handleGenerateCoverLetter}
            disabled={!jobDescription || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Cover Letter...' : 'Generate Tailored Cover Letter'}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
              {error}
            </div>
          )}
        </Card>

        {/* Right Panel: Generated Cover Letter */}
        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Tailored Cover Letter</h2>

          <Editor
            value={generatedCoverLetter}
            onChange={setGeneratedCoverLetter}
            placeholder="Your tailored cover letter will appear here..."
            className="min-h-[450px]"
          />

          <div className="flex gap-4">
            <Button variant="outlined" className="flex-1">
              Download PDF
            </Button>
            <Button className="flex-1">Save Version</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
