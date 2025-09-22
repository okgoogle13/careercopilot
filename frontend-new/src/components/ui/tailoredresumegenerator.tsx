import { Editor } from '@/components/ui/editor';
import { TextField } from '@mui/material';
import { cn } from '@/lib/utils';
import { generateTailoredResume } from '@/api/aiServices';
import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

interface TailoredResumeGeneratorProps {
  userProfileId?: string;
}

export const TailoredResumeGenerator: React.FC<TailoredResumeGeneratorProps> = ({
  userProfileId = 'current-user-id',
}) => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const resumeData = await generateTailoredResume(jobDescription, userProfileId);

      // Extract resume content from the response
      // The actual structure will depend on your backend API response
      const resumeContent =
        resumeData.resume_content || resumeData.content || JSON.stringify(resumeData, null, 2);
      setGeneratedResume(resumeContent);
    } catch (error) {
      console.error('Resume generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate tailored resume');
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
            placeholder="Paste the job description here to generate a tailored resume..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />

          <Button
            onClick={handleGenerateResume}
            disabled={!jobDescription || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Resume...' : 'Generate Tailored Resume'}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
              {error}
            </div>
          )}
        </Card>

        {/* Right Panel: Generated Resume */}
        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Tailored Resume</h2>

          <Editor
            value={generatedResume}
            onChange={setGeneratedResume}
            placeholder="Your tailored resume will appear here..."
            className="min-h-[500px]"
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
